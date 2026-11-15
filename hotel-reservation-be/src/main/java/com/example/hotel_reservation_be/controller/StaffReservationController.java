package com.example.hotel_reservation_be.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.reservation.ReservationResponse;
import com.example.hotel_reservation_be.enums.ReservationStatus;
import com.example.hotel_reservation_be.service.ReservationService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/staff/reservations")
@RequiredArgsConstructor 
@PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
public class StaffReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> listByStatus(
            @RequestParam(defaultValue = "CONFIRMED") ReservationStatus status
    ) {
        return ResponseEntity.ok(reservationService.listByStatus(status));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        reservationService.cancel(id);
        return ResponseEntity.noContent().build();
    }
    
}
