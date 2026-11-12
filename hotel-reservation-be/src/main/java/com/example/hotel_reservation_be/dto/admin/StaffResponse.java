package com.example.hotel_reservation_be.dto.admin;

import com.example.hotel_reservation_be.enums.StaffRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
@Builder 
public class StaffResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private StaffRole role;
    private boolean active;
    
}
