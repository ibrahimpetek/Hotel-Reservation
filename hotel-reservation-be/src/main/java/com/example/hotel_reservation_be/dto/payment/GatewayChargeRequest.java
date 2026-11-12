package com.example.hotel_reservation_be.dto.payment;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
public class GatewayChargeRequest {

    //işlem ve tutar bilgisi
    private String conversationId;
    private BigDecimal amount;
    private Integer installmentCount;

    //kredi kartı bilgileri
     private String cardHolderName;
    private String cardNumber;
    private String expireMonth;
    private String expireYear;
    private String cvc;

    //alıcı bilgileri
    private String buyerEmail;
    private String buyerFirstName;
    private String buyerLastName;
    private String buyerPhone;
    private String buyerIdentityNumber;

    //sepet bilgileri   
    private String basketItemName;
    private String basketItemId;

    
}
