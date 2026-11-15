package com.example.hotel_reservation_be.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.roomType.RoomTypeCreateRequest;
import com.example.hotel_reservation_be.dto.roomType.RoomTypeResponse;
import com.example.hotel_reservation_be.service.RoomTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/room-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRoomTypeController {

    private final RoomTypeService roomTypeService;

    @PostMapping
    public ResponseEntity<RoomTypeResponse> create(@Valid @RequestBody RoomTypeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomTypeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomTypeResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody RoomTypeCreateRequest request
    ) {
        return ResponseEntity.ok(roomTypeService.update(id, request));
    }

    /** Fiziksel silme degil, soft-delete (gecmis rezervasyonlarin butunlugu icin). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        roomTypeService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
    
}
