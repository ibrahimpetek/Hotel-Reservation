package com.example.hotel_reservation_be.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.payment.PaymentInitRequest;
import com.example.hotel_reservation_be.dto.payment.PaymentInitResponse;
import com.example.hotel_reservation_be.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/init")
    public ResponseEntity<PaymentInitResponse> init(@Valid @RequestBody PaymentInitRequest request) {
        return ResponseEntity.ok(paymentService.initPayment(request));
    }
    
}
