package com.example.hotel_reservation_be.dto.availability;

import java.math.BigDecimal;

import com.example.hotel_reservation_be.enums.BoardType;

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
public class BoardOptionPrice {

    private BoardType boardType;
    private String displayName;
    private BigDecimal totalPrice;
    private BigDecimal pricePerNight;
    
}
