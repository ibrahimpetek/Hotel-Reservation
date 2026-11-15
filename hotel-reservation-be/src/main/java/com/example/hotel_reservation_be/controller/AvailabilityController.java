package com.example.hotel_reservation_be.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.availability.AvailabilitySearchRequest;
import com.example.hotel_reservation_be.dto.availability.AvailabilitySearchResponse;
import com.example.hotel_reservation_be.service.AvailabilityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @PostMapping("/search")
    public ResponseEntity<List<AvailabilitySearchResponse>> search(
            @Valid @RequestBody AvailabilitySearchRequest request
    ) {
        return ResponseEntity.ok(availabilityService.search(request));
    }
    
}
