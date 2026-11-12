package com.example.hotel_reservation_be.dto.admin;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.hotel_reservation_be.enums.BoardType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
public class PriceRuleResponse {

    private Long id;
    private Long roomTypeId;
    private String roomRoomTypeName;
    private BoardType boardType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal adultPrice;
    private BigDecimal childPrice;
    private BigDecimal infantPrice;
    private boolean active;
    
}
