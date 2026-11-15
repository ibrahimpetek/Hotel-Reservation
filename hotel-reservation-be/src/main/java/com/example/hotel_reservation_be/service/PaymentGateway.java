package com.example.hotel_reservation_be.service;

import com.example.hotel_reservation_be.dto.payment.GatewayChargeRequest;
import com.example.hotel_reservation_be.dto.payment.GatewayChargeResult;

/**
 * Odeme saglayicisini (iyzico) soyutlayan arayuz. Ileride baska bir
 * saglayiciya (PayTR vb.) gecilmek istenirse sadece bu arayuzun yeni
 * bir implementasyonu yazilir, PaymentService degismez.
 */
public interface PaymentGateway {
    
    GatewayChargeResult charge(GatewayChargeRequest request);
    
} 
