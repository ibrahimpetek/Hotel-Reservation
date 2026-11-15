package com.example.hotel_reservation_be.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@Builder 
@AllArgsConstructor 
public class GatewayChargeResult {
    
    private boolean success;
    private String providerPaymentId;
    private String providerConversationId;
    private String errorMessage;
    private String threeDsHtmlContent;
    
}
