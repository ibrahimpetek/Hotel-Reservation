package com.example.hotel_reservation_be.dto.reservation;
import java.time.LocalDate;
import java.util.List;

import com.example.hotel_reservation_be.enums.BoardType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class ReservationCreateRequest {

    @NotNull 
    private Long roomTypeId;

    @NotNull 
    @FutureOrPresent(message = "Giriş tarihi bugünden önce olamaz.")
    private LocalDate checkIn;

    @NotNull 
    private LocalDate checkOut;

    @NotNull 
    private BoardType boardType;

    @NotNull 
    @Min(value = 1, message = "En az 1 yetişkin olmalıdır.")
    private Integer adultCount;

    @Min(0)
    private Integer childCount=0;

    @NotNull 
    @Valid 
    private GuestInfoDto leadGuest;

    private List<ReservationGuestDto> guests;

    private String specialRequests;
    
}
