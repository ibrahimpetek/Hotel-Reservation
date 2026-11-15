package com.example.hotel_reservation_be.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_reservation_be.dto.auth.LoginRequest;
import com.example.hotel_reservation_be.dto.auth.LoginResponse;
import com.example.hotel_reservation_be.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * 
 * Sadece admin/resepsiyonist girişi için
 */


@RestController 
@RequestMapping 
@RequiredArgsConstructor 
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));

    }
    
}
