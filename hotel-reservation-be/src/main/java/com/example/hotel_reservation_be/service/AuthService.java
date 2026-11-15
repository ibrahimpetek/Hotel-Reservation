package com.example.hotel_reservation_be.service;

import com.example.hotel_reservation_be.dto.auth.LoginRequest;
import com.example.hotel_reservation_be.dto.auth.LoginResponse;
import com.example.hotel_reservation_be.entity.Staff;
import com.example.hotel_reservation_be.repository.StaffRepository;
import com.example.hotel_reservation_be.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final StaffRepository staffRepository;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Staff staff = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("Beklenmeyen durum: staff bulunamadı"));

        String token = jwtUtil.generateToken(staff.getEmail(), staff.getRole().name(), staff.getId());

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(staff.getEmail())
                .fullName(staff.getFullName())
                .role(staff.getRole().name())
                .build();
    }
}


