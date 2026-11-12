package com.example.hotel_reservation_be.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class LoginRequest {

    @NotBlank(message = "E-posta zorunludur.")
    @Email(message = "Geçerli bir e-posta giriniz.")
    private String email;

    @NotBlank(message = "Şifre zorunludur.")
    private String password;
    
}
