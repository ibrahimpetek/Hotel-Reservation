package com.example.hotel_reservation_be.dto.reservation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.example.hotel_reservation_be.enums.BoardType;
import com.example.hotel_reservation_be.enums.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Rezervasyon özeti 
 * ReservationResponse
 */
@Getter 
@Setter 
@AllArgsConstructor 
public class ReservationResponse {

    private Long id;
    private String reservationCode;
    private String roomTypeName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int nights;
    private BoardType boardType;
    private String boardTypeDisplayName;
    private Integer adultCount;
    private Integer childCount;
    private BigDecimal totalPrice;
    private ReservationStatus status;
    private String leadGuestFullName;
    private String leadGuestEmail;
    private List<ReservationGuestDto> guests;
    
}
