
package com.example.hotel_reservation_be.service;

import com.example.hotel_reservation_be.dto.admin.StaffCreateRequest;
import com.example.hotel_reservation_be.dto.admin.StaffResponse;
import com.example.hotel_reservation_be.entity.Staff;
import com.example.hotel_reservation_be.exception.BadRequestException;
import com.example.hotel_reservation_be.exception.ResourceNotFoundException;
import com.example.hotel_reservation_be.mapper.StaffMapper;
import com.example.hotel_reservation_be.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Sadece ADMIN rolunun erisebildigi personel (admin/resepsiyonist) yonetimi. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final StaffMapper staffMapper;

    public List<StaffResponse> listAll() {
        return staffMapper.toResponseList(staffRepository.findAll());
    }

    @Transactional
    public StaffResponse create(StaffCreateRequest request) {
        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Bu e-posta ile kayitli bir personel zaten var.");
        }

        Staff staff = staffMapper.toEntity(request);
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        return staffMapper.toResponse(staffRepository.save(staff));
    }

    @Transactional
    public void deactivate(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Personel", id));
        staff.setActive(false);
        staffRepository.save(staff);
    }
}