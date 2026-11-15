package com.example.hotel_reservation_be.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.roomType.RoomTypeResponse;
import com.example.hotel_reservation_be.service.RoomTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

     private final RoomTypeService roomTypeService;

    @GetMapping
    public ResponseEntity<List<RoomTypeResponse>> listActive() {
        return ResponseEntity.ok(roomTypeService.listActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomTypeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(roomTypeService.getById(id));
    }
    
}
