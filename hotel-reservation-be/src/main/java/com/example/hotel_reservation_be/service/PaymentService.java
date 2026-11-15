package com.example.hotel_reservation_be.service;

import com.example.hotel_reservation_be.dto.payment.GatewayChargeRequest;
import com.example.hotel_reservation_be.dto.payment.GatewayChargeResult;
import com.example.hotel_reservation_be.dto.payment.PaymentInitRequest;
import com.example.hotel_reservation_be.dto.payment.PaymentInitResponse;


import com.example.hotel_reservation_be.entity.Payment;
import com.example.hotel_reservation_be.entity.Reservation;
import com.example.hotel_reservation_be.enums.PaymentStatus;
import com.example.hotel_reservation_be.enums.ReservationStatus;
import com.example.hotel_reservation_be.exception.BadRequestException;
import com.example.hotel_reservation_be.exception.PaymentFailedException;
import com.example.hotel_reservation_be.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Rezervasyon son ekranindaki "Rezervasyonu Onayla ve Ode" akisini yonetir.
 *
 * Akis:
 *  1. Rezervasyon PENDING_PAYMENT durumunda mi kontrol edilir
 *  2. iyzico'ya odeme istegi gonderilir (kart verisi SADECE burada gecici kullanilir)
 *  3. Sonuc Payment tablosuna yazilir (kart verisi OLMADAN)
 *  4. Basariliysa ReservationService.confirmAfterPayment cagrilir (stok dusurulur + CONFIRMED)
 *  5. Basarisizsa PaymentFailedException firlatilir, rezervasyon PENDING_PAYMENT'ta kalir
 *     (kullanici farkli bir kartla tekrar deneyebilir)
 */

@Service 
@RequiredArgsConstructor 
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final ReservationService reservationService;
    private final PaymentGateway paymentGateway;

    @Transactional
    public PaymentInitResponse initPayment(PaymentInitRequest request) {
        Reservation reservation = reservationService.getEntityById(request.getReservationId());

        if (reservation.getStatus() != ReservationStatus.PENDING_PAYMENT) {
            throw new BadRequestException(
                    "Bu rezervasyon icin odeme yapilamaz, mevcut durum: " + reservation.getStatus()
            );
        }

        String conversationId = UUID.randomUUID().toString();

        GatewayChargeRequest chargeRequest = GatewayChargeRequest.builder()
                .conversationId(conversationId)
                .amount(reservation.getTotalPrice())
                .installmentCount(request.getInstallmentCount())
                .cardHolderName(request.getCardHolderName())
                .cardNumber(request.getCardNumber())
                .expireMonth(request.getExpireMonth())
                .expireYear(request.getExpireYear())
                .cvc(request.getCvc())
                .buyerEmail(reservation.getLeadGuest().getEmail())
                .buyerFirstName(reservation.getLeadGuest().getFirstName())
                .buyerLastName(reservation.getLeadGuest().getLastName())
                .buyerPhone(reservation.getLeadGuest().getPhone())
                .buyerIdentityNumber(reservation.getLeadGuest().getIdentityNumber())
                .basketItemName(reservation.getRoomType().getName() + " Rezervasyonu")
                .basketItemId(reservation.getReservationCode())
                .build();

        GatewayChargeResult result = paymentGateway.charge(chargeRequest);

        Payment payment = Payment.builder()
                .reservation(reservation)
                .amount(reservation.getTotalPrice())
                .installmentCount(request.getInstallmentCount())
                .provider("IYZICO")
                .providerConversationId(result.getProviderConversationId())
                .providerPaymentId(result.getProviderPaymentId())
                .status(result.isSuccess() ? PaymentStatus.SUCCESS : PaymentStatus.FAILED)
                .paidAt(result.isSuccess() ? LocalDateTime.now() : null)
                .failureReason(result.getErrorMessage())
                .build();
        payment = paymentRepository.save(payment);

        if (!result.isSuccess()) {
            throw new PaymentFailedException(
                    result.getErrorMessage() != null ? result.getErrorMessage() : "Ödeme başarısız oldu."
            );
        }

        // Odeme basarili -> stok dusur + rezervasyonu onayla.
        // Bu asamada RoomNotAvailableException firlarsa (nadir race condition),
        // gercek projede burada OTOMATIK IADE (refund) tetiklenmelidir.
        reservationService.confirmAfterPayment(reservation.getId());

        return PaymentInitResponse.builder()
                .paymentId(payment.getId())
                .status(payment.getStatus())
                .reservationCode(reservation.getReservationCode())
                .message("Ödeme basarılı, rezervasyonunuz onaylandı.")
                .threeDsHtmlContent(null)
                .build();
    }
}

