package com.example.hotel_reservation_be.dto.admin;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 
 * AvailabilityBulkRequest
 * Admin panelinde tarih aralığında oda sayıları
*/

@Getter 
@Setter 
public class AvailabilityBulkRequest {

    @NotNull(message = "Oda tipi zorunludur.")
    private Long roomTypeId;

    @NotNull(message = "Başlangıç tarihi zorunludur.")
    private LocalDate startDate;

    @NotNull(message = "Bitiş tarihi zorunludur.")
    private LocalDate endDate;

    @NotNull 
    @Min(value = 0, message = "Toplam oda sayısı negatif olamaz.")
    private Integer totalRooms;

}
