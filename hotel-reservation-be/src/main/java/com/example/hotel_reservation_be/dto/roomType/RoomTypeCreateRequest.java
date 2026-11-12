package com.example.hotel_reservation_be.dto.roomType;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class RoomTypeCreateRequest {

    @NotBlank(message = "Oda tipi zorunludur.")
    private String name;

    private String description;

    @Min(value = 1, message = "Metrekare pozitif olmalıdır.")
    private Integer sizeM2;

    @NotNull 
    @Min(value = 1, message = "Maksimum yetişkin sayısı en az 1 olmalıdır.")
    private Integer maxAdult;

    @NotNull 
    @Min(value = 0, message = "Maksimum çocuk sayısı negatif olamaz.")
    private Integer maxChild;

    @NotNull 
    @DecimalMin(value = "0.0", inclusive = false, message = "Fiyat 0'dan büyük olmalıdır.")
    private BigDecimal basePrice;

    private List<String> images;

    private List<String> amenities;

}
