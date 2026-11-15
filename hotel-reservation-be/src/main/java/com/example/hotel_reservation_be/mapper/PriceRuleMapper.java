
package com.example.hotel_reservation_be.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.example.hotel_reservation_be.dto.admin.PriceRuleRequest;
import com.example.hotel_reservation_be.dto.admin.PriceRuleResponse;
import com.example.hotel_reservation_be.entity.PriceRule;

@Mapper(componentModel = "spring")
public interface PriceRuleMapper {

    @Mapping(target = "roomTypeId", source = "roomType.id")
    @Mapping(target = "roomTypeName", source = "roomType.name")
    PriceRuleResponse toResponse(PriceRule rule);

    List<PriceRuleResponse> toResponseList(List<PriceRule> rules);

    @Mapping(target = "roomType", ignore = true)          // true görmezden gel 
    @Mapping(target = "active", constant = "true")        // doğrudan true yaz 
    @Mapping(target = "childPrice", source = "childPrice", defaultValue = "0")
    @Mapping(target = "infantPrice", source = "infantPrice", defaultValue = "0")
    PriceRule toEntity(PriceRuleRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "roomType", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "childPrice", source = "childPrice", defaultValue = "0")
    @Mapping(target = "infantPrice", source = "infantPrice", defaultValue = "0")
    void updateEntityFromRequest(PriceRuleRequest request, @MappingTarget PriceRule rule);
}