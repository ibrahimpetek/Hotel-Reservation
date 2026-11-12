package com.example.hotel_reservation_be.dto.admin;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.hotel_reservation_be.enums.BoardType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/** Admin panalinde oda tipi veya pantiyon konsepti tanımlama */ 

@Getter 
@Setter 
public class PriceRuleRequest {

    @NotNull(message = "Oda tipi zorunludur.")
    private Long roomTypeId;

    @NotNull(message = "Pansiyon tipi zorunludur.")
    private BoardType boardType;

    @NotNull(message = "Başlangıç tarihi zorunludur.")
    private LocalDate startDate;

    @NotNull(message = "Bitiş tarihi zorunludur.")
    private LocalDate endDate;

    @NotNull 
    @DecimalMin(value = "0.0",inclusive = false, message = "Yetişkin fiyatı 0'dan büyük olmalıdır.")
    private BigDecimal adultPrice;

    @DecimalMin(value = "0.0", message = "Çocuk fiyatı negatif olamaz.")
    private BigDecimal childPrice;

    @DecimalMin (value = "0.0", message = "Bebek fiyatı negatif olamaz.")
    private BigDecimal infantPrice;


    
}
