package com.example.hotel_reservation_be.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.hotel_reservation_be.entity.Payment;
import com.example.hotel_reservation_be.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository <Payment,Long> {

    List<Payment> findByReservationId(Long reservationId);

    //ödeme sağlayıcısı kendi sisteminde tutar(iade vs için)
    Optional<Payment> findByProviderPaymentId(String providerPaymentId);

    //Bizim iyzico ile kendi sistemimizde tuttuğumuz(eşleşme için)
    Optional<Payment> findByProviderConversationId(String providerConversationId);

    List<Payment> findByStatus(PaymentStatus status);  
} 