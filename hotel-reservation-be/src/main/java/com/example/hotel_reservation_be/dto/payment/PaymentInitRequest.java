package com.example.hotel_reservation_be.dto.payment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class PaymentInitRequest {

    @NotNull(message = "Rezervasyon id zorunludur.")
    private Long reservationId;

    @NotNull 
    @Min(value = 1, message = "Taksit sayısı en az 1 olmalıdır.")
    private Integer installmentCount;

    @NotBlank(message = "Kart üzerindeki isim zorunludur.")
    private String cardHolderName;

    @NotBlank(message = "Kart numarası zorunludur.")
    @Pattern(regexp = "\\d{16}", message = "Kart numarası 16 haneli olmalıdır")
    private String cardNumber;

    @NotBlank
    @Pattern(regexp = "(0[1-9]|1[0-2])", message = "Ay 01-12 arasinda olmalidir")
    private String expireMonth;

    @NotBlank
    @Pattern(regexp = "\\d{4}", message = "Yil YYYY formatinda olmalidir")
    private String expireYear;

    @NotBlank
    @Pattern(regexp = "\\d{3,4}", message = "CVC 3 veya 4 haneli olmalidir")
    private String cvc;
    
}
