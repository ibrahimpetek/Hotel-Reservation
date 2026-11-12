package com.example.hotel_reservation_be.mapper;

import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.example.hotel_reservation_be.dto.roomType.RoomTypeCreateRequest;
import com.example.hotel_reservation_be.dto.roomType.RoomTypeResponse;
import com.example.hotel_reservation_be.entity.RoomType;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RoomTypeMapper {

   RoomTypeResponse toResponse(RoomType entity);

   RoomType toEntity(RoomTypeCreateRequest request);

   void updateEntityFromRequest(RoomTypeCreateRequest request, @MappingTarget RoomType entity);

    
} 
