package com.example.hotel_reservation_be.service;

import com.example.hotel_reservation_be.dto.reservation.ReservationCreateRequest;
import com.example.hotel_reservation_be.dto.reservation.ReservationResponse;
import com.example.hotel_reservation_be.entity.Guest;
import com.example.hotel_reservation_be.entity.Reservation;
import com.example.hotel_reservation_be.entity.ReservationGuest;
import com.example.hotel_reservation_be.entity.RoomType;
import com.example.hotel_reservation_be.enums.ReservationStatus;
import com.example.hotel_reservation_be.exception.BadRequestException;
import com.example.hotel_reservation_be.exception.ResourceNotFoundException;
import com.example.hotel_reservation_be.exception.RoomNotAvailableException;
import com.example.hotel_reservation_be.mapper.GuestMapper;
import com.example.hotel_reservation_be.mapper.ReservationMapper;
import com.example.hotel_reservation_be.repository.GuestRepository;
import com.example.hotel_reservation_be.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final GuestRepository guestRepository;
    private final RoomTypeService roomTypeService;
    private final PricingService pricingService;
    private final AvailabilityService availabilityService;
    private final ReservationMapper reservationMapper;
    private final GuestMapper guestMapper;

    /**
     * Rezervasyon formu gonderildiginde cagrilir. Bu asamada stok
     * DUSURULMEZ (sadece "musait mi?" kontrolu yapilir) - stok, odeme
     * basarili oldugunda AvailabilityService.reserveNights ile dusurulur.
     * Boylece odeme yapmayan kullanicilar yuzunden oda "bosa" kilitlenmez.
     */
    @Transactional
    public ReservationResponse create(ReservationCreateRequest request) {
        validateDates(request.getCheckIn(), request.getCheckOut());

        RoomType roomType = roomTypeService.getEntityById(request.getRoomTypeId());

        int totalGuests = request.getAdultCount() + (request.getChildCount() == null ? 0 : request.getChildCount());
        if (totalGuests > roomType.getMaxAdult() + roomType.getMaxChild()) {
            throw new BadRequestException("Secilen oda tipi bu kadar misafir icin uygun degil.");
        }

        if (!availabilityService.isAvailable(roomType.getId(), request.getCheckIn(), request.getCheckOut())) {
            throw RoomNotAvailableException.forDate(roomType.getName(), request.getCheckIn());
        }

        BigDecimal totalPrice = pricingService.calculateTotalPrice(
                roomType.getId(), request.getBoardType(), request.getCheckIn(), request.getCheckOut(),
                request.getAdultCount(), request.getChildCount() == null ? 0 : request.getChildCount()
        );

        Guest leadGuest = upsertGuest(request);

        Reservation reservation = Reservation.builder()
                .reservationCode(generateReservationCode())
                .leadGuest(leadGuest)
                .roomType(roomType)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .boardType(request.getBoardType())
                .adultCount(request.getAdultCount())
                .childCount(request.getChildCount() == null ? 0 : request.getChildCount())
                .totalPrice(totalPrice)
                .status(ReservationStatus.PENDING_PAYMENT)
                .specialRequests(request.getSpecialRequests())
                .build();

        List<ReservationGuest> guests = reservationMapper.toReservationGuestList(request.getGuests());
        guests.forEach(g -> g.setReservation(reservation));
        reservation.setGuests(guests);

        Reservation saved = reservationRepository.save(reservation);
        return reservationMapper.toResponse(saved);
    }

    public ReservationResponse getByCode(String code) {
        return reservationMapper.toResponse(getEntityByCode(code));
    }

    public Reservation getEntityByCode(String code) {
        return reservationRepository.findByReservationCode(code)
                .orElseThrow(() -> ResourceNotFoundException.of("Rezervasyon", code));
    }

    public Reservation getEntityById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Rezervasyon", id));
    }

    public List<ReservationResponse> listByStatus(ReservationStatus status) {
        return reservationRepository.findByStatus(status).stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    /**
     * Odeme basarili oldugunda PaymentService tarafindan cagrilir.
     * Stok burada dusurulur (reserveNights) ve rezervasyon CONFIRMED yapilir.
     * Stok yetersizse (nadir race condition) rezervasyon CANCELLED olarak
     * isaretlenir ve hata firlatilir - odeme iade akisi tetiklenmelidir.
     */
    @Transactional
    public void confirmAfterPayment(Long reservationId) {
        Reservation reservation = getEntityById(reservationId);

        if (reservation.getStatus() != ReservationStatus.PENDING_PAYMENT) {
            throw new BadRequestException("Bu rezervasyon zaten islenmis durumda: " + reservation.getStatus());
        }

        try {
            availabilityService.reserveNights(
                    reservation.getRoomType().getId(), reservation.getCheckIn(), reservation.getCheckOut()
            );
        } catch (RoomNotAvailableException ex) {
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(reservation);
            throw ex;
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservationRepository.save(reservation);
    }

    /** Resepsiyon/admin tarafindan veya odeme basarisiz oldugunda cagrilir. */
    @Transactional
    public void cancel(Long reservationId) {
        Reservation reservation = getEntityById(reservationId);

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            availabilityService.releaseNights(
                    reservation.getRoomType().getId(), reservation.getCheckIn(), reservation.getCheckOut()
            );
        }
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    private Guest upsertGuest(ReservationCreateRequest request) {
        var dto = request.getLeadGuest();
        Guest guest = guestRepository.findByEmail(dto.getEmail()).orElseGet(Guest::new);
        guestMapper.updateGuest(dto, guest);
        return guestRepository.save(guest);
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("Giris tarihi bugunden once olamaz.");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Cikis tarihi giris tarihinden sonra olmalidir.");
        }
    }

    /** Ornek format: XBLK-20260828-A1B2C3. Gercek projede sequence/DB kurali da kullanilabilir. */
    private String generateReservationCode() {
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String randomPart = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "XBLK-" + datePart + "-" + randomPart;
    }
}