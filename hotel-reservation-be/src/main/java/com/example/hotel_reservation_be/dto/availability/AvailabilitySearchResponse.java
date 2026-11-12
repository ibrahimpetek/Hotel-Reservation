package com.example.hotel_reservation_be.dto.availability;

import java.time.LocalDate;
import java.util.List;

import com.example.hotel_reservation_be.dto.roomType.RoomTypeResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@Builder 
@AllArgsConstructor 
@NoArgsConstructor 
public class AvailabilitySearchResponse {

    private RoomTypeResponse roomType;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int nights;
    private boolean available;
    private List<BoardOptionPrice> boardOptions;
    
}
