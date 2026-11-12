package com.example.hotel_reservation_be.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder 
@Getter 
@Setter 
@AllArgsConstructor 
public class LoginResponse {
    
    private String token;
    private String tokenType; //bearer
    private String email;
    private String fullName;
    private String role; 
}
