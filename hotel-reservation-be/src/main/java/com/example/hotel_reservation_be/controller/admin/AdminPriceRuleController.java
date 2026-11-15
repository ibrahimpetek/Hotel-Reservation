package com.example.hotel_reservation_be.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.admin.PriceRuleRequest;
import com.example.hotel_reservation_be.dto.admin.PriceRuleResponse;
import com.example.hotel_reservation_be.service.PriceRuleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/price-rules")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPriceRuleController {

     private final PriceRuleService priceRuleService;

    @GetMapping
    public ResponseEntity<List<PriceRuleResponse>> listByRoomType(@RequestParam Long roomTypeId) {
        return ResponseEntity.ok(priceRuleService.listByRoomType(roomTypeId));
    }

    @PostMapping
    public ResponseEntity<PriceRuleResponse> create(@Valid @RequestBody PriceRuleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(priceRuleService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PriceRuleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody PriceRuleRequest request
    ) {
        return ResponseEntity.ok(priceRuleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        priceRuleService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
    
}
