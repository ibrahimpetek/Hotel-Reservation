package com.example.hotel_reservation_be.dto.admin;

import com.example.hotel_reservation_be.enums.StaffRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class StaffCreateRequest {

    @NotBlank 
    @Email(message = "Geçerli bir e-posta giriniz.")
    private String email;

    @NotBlank 
    @Size(min = 8, message = "Şifre en az 8 karakter olmalıdır.")
    private String password;

    @NotBlank 
    private String fullName;

    private String phone;

    @NotNull(message = "Rol zorunludur.")
    private StaffRole role;
    
}
