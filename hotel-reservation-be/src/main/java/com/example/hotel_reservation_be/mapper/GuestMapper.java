package com.example.hotel_reservation_be.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.hotel_reservation_be.dto.reservation.GuestInfoDto;
import com.example.hotel_reservation_be.entity.Guest;

@Mapper(componentModel = "spring")
public interface GuestMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateGuest(GuestInfoDto dto, @MappingTarget Guest guest);
}