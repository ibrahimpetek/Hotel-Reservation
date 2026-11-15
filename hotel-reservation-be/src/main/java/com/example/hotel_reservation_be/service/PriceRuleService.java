package com.example.hotel_reservation_be.service;

import com.example.hotel_reservation_be.dto.admin.PriceRuleRequest;
import com.example.hotel_reservation_be.dto.admin.PriceRuleResponse;
import com.example.hotel_reservation_be.entity.PriceRule;
import com.example.hotel_reservation_be.exception.BadRequestException;
import com.example.hotel_reservation_be.exception.ResourceNotFoundException;
import com.example.hotel_reservation_be.mapper.PriceRuleMapper;
import com.example.hotel_reservation_be.repository.PriceRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PriceRuleService {

    private final PriceRuleRepository priceRuleRepository;
    private final RoomTypeService roomTypeService;
    private final PriceRuleMapper priceRuleMapper;

    public List<PriceRuleResponse> listByRoomType(Long roomTypeId) {
        return priceRuleMapper.toResponseList(priceRuleRepository.findByRoomTypeId(roomTypeId));
    }

    @Transactional
    public PriceRuleResponse create(PriceRuleRequest request) {
        validateDates(request);

        PriceRule rule = priceRuleMapper.toEntity(request);
        rule.setRoomType(roomTypeService.getEntityById(request.getRoomTypeId()));
        return priceRuleMapper.toResponse(priceRuleRepository.save(rule));
    }

    @Transactional
    public PriceRuleResponse update(Long id, PriceRuleRequest request) {
        PriceRule rule = priceRuleRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Fiyat kurali", id));
        validateDates(request);

        priceRuleMapper.updateEntityFromRequest(request, rule);
        rule.setRoomType(roomTypeService.getEntityById(request.getRoomTypeId()));
        return priceRuleMapper.toResponse(priceRuleRepository.save(rule));
    }

    @Transactional
    public void deactivate(Long id) {
        PriceRule rule = priceRuleRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Fiyat kurali", id));
        rule.setActive(false);
        priceRuleRepository.save(rule);
    }

    private void validateDates(PriceRuleRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Bitis tarihi baslangic tarihinden once olamaz.");
        }
    }
}