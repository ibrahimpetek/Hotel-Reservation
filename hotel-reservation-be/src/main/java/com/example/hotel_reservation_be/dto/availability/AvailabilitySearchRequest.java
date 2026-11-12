package com.example.hotel_reservation_be.dto.availability;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@Builder 
@NoArgsConstructor 
@AllArgsConstructor 
public class AvailabilitySearchRequest {

    @NotNull(message = "Giriş tarihi zorunludur.")
    @FutureOrPresent(message = "Giriş tarihi bugünden önce olamaz.")
    private LocalDate checkIn;

    @NotNull(message = "Çıkış tarihi zorunludur.")
    private LocalDate checkOut;

    @NotNull(message = "Yetişkin sayısı zorunludur.")
    @Min(value = 1L, message = "En az bir yetişkin olmalıdır.")
    private Integer adultCount;

    @Builder.Default
    @PositiveOrZero(message = "Çocuk sayısı 0'dan küçük olamaz.")
    private int childCount=0;

    private Long roomTypeId;
    
}
