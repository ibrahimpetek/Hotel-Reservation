package com.example.hotel_reservation_be.dto.reservation;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class GuestInfoDto {

    @NotBlank(message = "Ad zorunludur.")
    private String firstName;

    @NotBlank(message = "Soyad zorunludur.")
    private String lastName;

    @NotBlank(message = "E-posta zorunludur.")
    @Email(message = "Geçerli bir e-posta giriniz.")
    private String email;

    @NotBlank(message = "Telefon zorunludur.")
    private String phone;

    private String identityNumber;

    private String nationality;
    
}
