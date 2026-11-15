package com.example.hotel_reservation_be.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.hotel_reservation_be.dto.admin.StaffCreateRequest;
import com.example.hotel_reservation_be.dto.admin.StaffResponse;
import com.example.hotel_reservation_be.entity.Staff;

@Mapper(componentModel = "spring")
public interface StaffMapper {

    StaffResponse toResponse(Staff staff);

    List<StaffResponse> toResponseList(List<Staff> staffList);

    @Mapping(target = "password", ignore = true)          // BCrypt ile serviste set edilecek
    @Mapping(target = "active", constant = "true")
    Staff toEntity(StaffCreateRequest request);
}