package com.example.hotel_reservation_be.dto.roomType;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@Builder 
@AllArgsConstructor 
public class RoomTypeResponse {

    private Long id;
    private String name;
    private String description;
    private Integer sizeM2;
    private Integer maxAdult;
    private Integer maxChild;
    private BigDecimal basePrice;
    private List<String> images;
    private List<String> amenities;
    
}
