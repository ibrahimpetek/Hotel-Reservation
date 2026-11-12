package com.example.hotel_reservation_be.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
public class GatewayChargeResult {
    
    private String success;
    private String providerConversationId;
    private String errorMessage;
    private String threeDsHtmlContent;
    
}
