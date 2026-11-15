package com.example.hotel_reservation_be.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.example.hotel_reservation_be.entity.PriceRule;
import com.example.hotel_reservation_be.enums.BoardType;
import com.example.hotel_reservation_be.exception.BadRequestException;
import com.example.hotel_reservation_be.repository.PriceRuleRepository;

import lombok.RequiredArgsConstructor;


/**
 * Bir konaklamanin toplam tutarini hesaplar. Her GECE icin ayri fiyat
 * kurali aranir (sezon gecisleri farkli fiyat verebilir), bulunamazsa
 * hata firlatilir - sistemde "fiyatsiz gece" olusmasi engellenir.
 */
@Service
@RequiredArgsConstructor
public class PricingService {

        private final PriceRuleRepository priceRuleRepository;

    /**
     * checkIn (dahil) - checkOut (haric) araligindaki her gece icin
     * yetiskin ve cocuk fiyatlarini toplar.
     */
    public BigDecimal calculateTotalPrice(
            Long roomTypeId,
            BoardType boardType,
            LocalDate checkIn,
            LocalDate checkOut,
            int adultCount,
            int childCount
    ) {
        if (!checkOut.isAfter(checkIn)) {
            throw new BadRequestException("Cikis tarihi giris tarihinden sonra olmalidir.");
        }

        BigDecimal total = BigDecimal.ZERO;
        LocalDate date = checkIn;

        while (date.isBefore(checkOut)) {
            // Lambda içinde kullanılabilmesi için effectively final bir kopyasını alıyoruz
            LocalDate currentDate = date;

            PriceRule rule = priceRuleRepository.findActiveRuleForDate(roomTypeId, boardType, currentDate)
                    .orElseThrow(() -> new BadRequestException(
                            currentDate + " tarihi icin secilen pansiyon tipinde fiyat tanimlanmamis."
                    ));

            BigDecimal nightTotal = rule.getAdultPrice().multiply(BigDecimal.valueOf(adultCount));
            if (childCount > 0 && rule.getChildPrice() != null) {
                nightTotal = nightTotal.add(rule.getChildPrice().multiply(BigDecimal.valueOf(childCount)));
            }
            total = total.add(nightTotal);

            date = date.plusDays(1);
        }

        return total;
    }
}
