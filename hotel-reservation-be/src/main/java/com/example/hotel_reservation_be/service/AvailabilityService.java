package com.example.hotel_reservation_be.service;

import com.example.hotel_reservation_be.dto.admin.AvailabilityBulkRequest;
import com.example.hotel_reservation_be.dto.admin.AvailabilityDayResponse;
import com.example.hotel_reservation_be.dto.availability.AvailabilitySearchRequest;
import com.example.hotel_reservation_be.dto.availability.AvailabilitySearchResponse;
import com.example.hotel_reservation_be.dto.availability.BoardOptionPrice;
import com.example.hotel_reservation_be.entity.RoomAvailability;
import com.example.hotel_reservation_be.entity.RoomType;
import com.example.hotel_reservation_be.enums.BoardType;
import com.example.hotel_reservation_be.exception.BadRequestException;
import com.example.hotel_reservation_be.exception.ResourceNotFoundException;
import com.example.hotel_reservation_be.exception.RoomNotAvailableException;
import com.example.hotel_reservation_be.mapper.AvailabilityMapper;
import com.example.hotel_reservation_be.mapper.RoomTypeMapper;
import com.example.hotel_reservation_be.repository.RoomAvailabilityRepository;
import com.example.hotel_reservation_be.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Musaitlik sorgulama  ve stok dusurme/artirma */
@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final RoomAvailabilityRepository availabilityRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomTypeMapper roomTypeMapper;
    private final AvailabilityMapper availabilityMapper;
    private final PricingService pricingService;

    /**
     * Ana sayfadaki takvimden gelen aramaya cevap uretir: musait (veya
     * musait olmayan, available=false ile birlikte) oda tiplerini,
     * her pansiyon tipi icin hesaplanmis toplam fiyatla doner.
     */
    @Transactional(readOnly = true)
    public List<AvailabilitySearchResponse> search(AvailabilitySearchRequest request) {
        List<RoomType> roomTypes = request.getRoomTypeId() != null
                ? List.of(roomTypeRepository.findById(request.getRoomTypeId())
                        .orElseThrow(() -> new IllegalArgumentException("Oda tipi bulunamadi")))
                : roomTypeRepository.findByActiveTrueAndDeletedFalse();

        int nights = (int) ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());

        return roomTypes.stream()
                .filter(rt -> rt.getMaxAdult() + rt.getMaxChild() >= request.getAdultCount() + request.getChildCount())
                .map(rt -> buildSearchResponse(rt, request, nights))
                .toList();
    }

    private AvailabilitySearchResponse buildSearchResponse(RoomType roomType, AvailabilitySearchRequest request, int nights) {
        boolean available = isAvailable(roomType.getId(), request.getCheckIn(), request.getCheckOut());

        List<BoardOptionPrice> boardOptions = available
                ? buildBoardOptions(roomType, request, nights)
                : List.of();

        return AvailabilitySearchResponse.builder()
                .roomType(roomTypeMapper.toResponse(roomType))
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .nights(nights)
                .available(available)
                .boardOptions(boardOptions)
                .build();
    }

    private List<BoardOptionPrice> buildBoardOptions(RoomType roomType, AvailabilitySearchRequest request, int nights) {
        return List.of(BoardType.values()).stream()
                .map(boardType -> {
                    BigDecimal total;
                    try {
                        total = pricingService.calculateTotalPrice(
                                roomType.getId(), boardType, request.getCheckIn(), request.getCheckOut(),
                                request.getAdultCount(), request.getChildCount()
                        );
                    } catch (Exception ex) {
                        return null; // bu pansiyon tipi icin fiyat tanimli degil - listeden cikar
                    }
                    BigDecimal perNight = nights > 0
                            ? total.divide(BigDecimal.valueOf(nights), 2, RoundingMode.HALF_UP)
                            : total;
                    return BoardOptionPrice.builder()
                            .boardType(boardType)
                            .displayName(boardType.getDisplayName())
                            .totalPrice(total)
                            .pricePerNight(perNight)
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    /** checkIn (dahil) - checkOut (haric) araligindaki HER gun icin en az 1 oda musait mi? */
    @Transactional(readOnly = true)
    public boolean isAvailable(Long roomTypeId, LocalDate checkIn, LocalDate checkOut) {
        List<RoomAvailability> range = availabilityRepository.findRangeForRoomType(roomTypeId, checkIn, checkOut);

        long expectedDays = ChronoUnit.DAYS.between(checkIn, checkOut);
        // Her gun icin kayit olmali VE her kayitta bos oda bulunmali.
        if (range.size() < expectedDays) {
            return false; // envanter tanimlanmamis gunler var
        }
        return range.stream().allMatch(ra -> ra.getAvailableRooms() > 0);
    }

    /**
     * Odeme basarili olup rezervasyon CONFIRMED olurken cagrilir.
     * Her gece icin pessimistic lock ile satiri kilitleyip bookedRooms'u
     * artirir - ayni anda gelen iki istekte overbooking olmasin diye.
     */
    @Transactional
    public void reserveNights(Long roomTypeId, LocalDate checkIn, LocalDate checkOut) {
        LocalDate date = checkIn;
        while (date.isBefore(checkOut)) {
            LocalDate currentDate = date;
            RoomAvailability ra = availabilityRepository.findByRoomTypeIdAndDateForUpdate(roomTypeId, currentDate)
                    .orElseThrow(() -> RoomNotAvailableException.forDate("Oda tipi #" + roomTypeId, currentDate));

            if (ra.getAvailableRooms() <= 0) {
                throw RoomNotAvailableException.forDate("Oda tipi #" + roomTypeId, currentDate);
            }
            ra.setBookedRooms(ra.getBookedRooms() + 1);
            availabilityRepository.save(ra);

            date = date.plusDays(1);
        }
    }

    /** Rezervasyon iptal edildiginde stogu geri birakir. */
    @Transactional
    public void releaseNights(Long roomTypeId, LocalDate checkIn, LocalDate checkOut) {
        LocalDate date = checkIn;
        while (date.isBefore(checkOut)) {
            LocalDate currentDate = date;
            availabilityRepository.findByRoomTypeIdAndDateForUpdate(roomTypeId, currentDate)
                    .ifPresent(ra -> {
                        ra.setBookedRooms(Math.max(0, ra.getBookedRooms() - 1));
                        availabilityRepository.save(ra);
                    });

            date = date.plusDays(1);
        }
    }

    /**
     * ADMIN: bir oda tipi icin tarih araligindaki (startDate-endDate DAHIL)
     * her gune totalRooms degerini yazar. Kayit yoksa olusturur, varsa
     * totalRooms'u gunceller (bookedRooms dokunulmaz - mevcut rezervasyonlar korunur).
     */
    @Transactional
    public void bulkSetAvailability(AvailabilityBulkRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Bitis tarihi baslangic tarihinden once olamaz.");
        }
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Oda tipi bulunamadi: " + request.getRoomTypeId()));

        LocalDate date = request.getStartDate();
        while (!date.isAfter(request.getEndDate())) {
            LocalDate currentDate = date;
            RoomAvailability ra = availabilityRepository.findByRoomTypeIdAndDate(roomType.getId(), currentDate)
                    .orElseGet(() -> RoomAvailability.builder()
                            .roomType(roomType)
                            .date(currentDate)
                            .totalRooms(0)
                            .bookedRooms(0)
                            .build());
            ra.setTotalRooms(request.getTotalRooms());
            availabilityRepository.save(ra);

            date = date.plusDays(1);
        }
    }

    /** ADMIN: bir oda tipinin tarih araligindaki gunluk stok/doluluk tablosu. */
    @Transactional(readOnly = true)
    public List<AvailabilityDayResponse> viewRange(Long roomTypeId, LocalDate startDate, LocalDate endDate) {
        return availabilityMapper.toDayResponseList(
                availabilityRepository.findRangeForRoomType(roomTypeId, startDate, endDate.plusDays(1)));
    }
}