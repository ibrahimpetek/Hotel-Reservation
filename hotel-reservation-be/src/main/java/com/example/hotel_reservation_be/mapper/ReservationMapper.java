package com.example.hotel_reservation_be.mapper;

import java.util.List;

import com.example.hotel_reservation_be.dto.reservation.ReservationGuestDto;
import com.example.hotel_reservation_be.dto.reservation.ReservationResponse;
import com.example.hotel_reservation_be.entity.Reservation;
import com.example.hotel_reservation_be.entity.ReservationGuest;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target="roomTypeName", source="roomType.name")
    @Mapping(target = "boardTypeDisplayName", expression = "java(reservation.getBoardType().getDisplayName())")
    @Mapping(target = "nights", expression = "java((int) java.time.temporal.ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut()))")
    @Mapping(target = "leadGuestFullName", expression = "java(reservation.getLeadGuest().getFirstName() + \" \" + reservation.getLeadGuest().getLastName())")
    @Mapping(target = "leadGuestEmail", source = "leadGuest.email")
    @Mapping(target = "guests", source = "guests")
    
    ReservationResponse toResponse(Reservation reservation);

    ReservationGuestDto toGuestDto(ReservationGuest guest);

    List<ReservationGuestDto> toGuestDtoList(List<ReservationGuest> guests);
    
} 