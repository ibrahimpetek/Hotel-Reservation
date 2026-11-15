package com.example.hotel_reservation_be.controller.admin;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.admin.AvailabilityBulkRequest;
import com.example.hotel_reservation_be.dto.admin.AvailabilityDayResponse;
import com.example.hotel_reservation_be.service.AvailabilityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/availability")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAvailabilityController {

    private final AvailabilityService availabilityService;

    /** Tarih araligindaki her gune toplam oda sayisini toplu olarak yazar. */
    @PostMapping("/bulk")
    public ResponseEntity<Void> bulkSet(@Valid @RequestBody AvailabilityBulkRequest request) {
        availabilityService.bulkSetAvailability(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<AvailabilityDayResponse>> view(
            @RequestParam Long roomTypeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(availabilityService.viewRange(roomTypeId, startDate, endDate));
    }
    
}
