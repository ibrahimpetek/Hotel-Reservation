
package com.example.hotel_reservation_be.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.example.hotel_reservation_be.dto.admin.AvailabilityDayResponse;
import com.example.hotel_reservation_be.entity.RoomAvailability;

@Mapper(componentModel = "spring")
public interface AvailabilityMapper {

    AvailabilityDayResponse toDayResponse(RoomAvailability availability);

    List<AvailabilityDayResponse> toDayResponseList(List<RoomAvailability> list);
}