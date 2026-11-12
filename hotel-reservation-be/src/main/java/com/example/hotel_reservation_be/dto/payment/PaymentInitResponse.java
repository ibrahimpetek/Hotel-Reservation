package com.example.hotel_reservation_be.dto.payment;

import com.example.hotel_reservation_be.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@Builder 
@AllArgsConstructor 
public class PaymentInitResponse {
    
    private Long paymentId;
    private PaymentStatus status;
    private String reservationCode;
    private String message;
    private String threeDsHtmlContent;   //3D secure iyzico döner
    
}
