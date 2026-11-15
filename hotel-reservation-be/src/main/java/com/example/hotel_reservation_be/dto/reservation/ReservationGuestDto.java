package com.example.hotel_reservation_be.dto.reservation;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Odada konaklayacak diğer misafirler
 * ReservationGuestDto
 */

@Getter 
@Setter 
public class ReservationGuestDto {

    @NotBlank(message = "Ad zorunludur.")
    private String firstName;

    @NotBlank(message = "Soyad zorunludur.")
    private String lastName;

    private Integer age;

    private boolean child;
    
}
