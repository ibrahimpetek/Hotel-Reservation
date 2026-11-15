package com.example.hotel_reservation_be.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.admin.StaffCreateRequest;
import com.example.hotel_reservation_be.dto.admin.StaffResponse;
import com.example.hotel_reservation_be.service.StaffService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/** Yeni admin/resepsiyonist hesabi olusturma */

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<List<StaffResponse>> listAll() {
        return ResponseEntity.ok(staffService.listAll());
    }

    @PostMapping
    public ResponseEntity<StaffResponse> create(@Valid @RequestBody StaffCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        staffService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
    
}
