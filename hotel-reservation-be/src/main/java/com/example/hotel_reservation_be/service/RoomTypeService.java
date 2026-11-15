package com.example.hotel_reservation_be.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotel_reservation_be.dto.roomType.RoomTypeCreateRequest;
import com.example.hotel_reservation_be.dto.roomType.RoomTypeResponse;
import com.example.hotel_reservation_be.entity.RoomType;
import com.example.hotel_reservation_be.exception.ResourceNotFoundException;
import com.example.hotel_reservation_be.mapper.RoomTypeMapper;
import com.example.hotel_reservation_be.repository.RoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTypeService {
    
    private final RoomTypeRepository roomTypeRepository;
    private final RoomTypeMapper roomTypeMapper;

    /** Musteri tarafinda gosterilecek aktif oda tipleri (ana sayfa, oda listesi). */
    public List<RoomTypeResponse> listActive() {
        return roomTypeRepository.findByActiveTrueAndDeletedFalse().stream()
                .map(roomTypeMapper::toResponse)
                .toList();
    }

    public RoomTypeResponse getById(Long id) {
        return roomTypeMapper.toResponse(getEntityById(id));
    }

    /** Diger servislerin (pricing, availability, reservation) entity'ye ihtiyaci oldugunda kullanilir. */
    public RoomType getEntityById(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Oda tipi", id));
    }

    @Transactional
    public RoomTypeResponse create(RoomTypeCreateRequest request) {
        RoomType entity = roomTypeMapper.toEntity(request);
        entity.setActive(true);
        return roomTypeMapper.toResponse(roomTypeRepository.save(entity));
    }

    @Transactional
    public RoomTypeResponse update(Long id, RoomTypeCreateRequest request) {
        RoomType entity = getEntityById(id);
        roomTypeMapper.updateEntityFromRequest(request, entity);
        return roomTypeMapper.toResponse(roomTypeRepository.save(entity));
    }

    /** Fiziksel silme yerine soft-delete: gecmis rezervasyonlarin bagi kopmasin diye. */
    @Transactional
    public void deactivate(Long id) {
        RoomType entity = getEntityById(id);
        entity.setActive(false);
        roomTypeRepository.save(entity);
    }
}

