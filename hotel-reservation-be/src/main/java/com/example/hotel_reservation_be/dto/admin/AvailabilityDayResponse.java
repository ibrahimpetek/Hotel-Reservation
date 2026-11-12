package com.example.hotel_reservation_be.dto.admin;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Admin panaelinde belirli bir gündeki stok detayları
 * AvailabilityDayResponse
 */

@Getter 
@Setter 
@Builder 
@AllArgsConstructor 
@NoArgsConstructor 
public class AvailabilityDayResponse {

    private LocalDate date;
    private Integer totalRooms;
    private Integer bookedRooms;
    private Integer availableRooms;
    
}
