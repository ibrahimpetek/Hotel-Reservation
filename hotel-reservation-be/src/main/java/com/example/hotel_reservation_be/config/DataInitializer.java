package com.example.hotel_reservation_be.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.hotel_reservation_be.entity.Staff;
import com.example.hotel_reservation_be.enums.StaffRole;
import com.example.hotel_reservation_be.repository.StaffRepository;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;


@Component
@RequiredArgsConstructor 
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.email}")
    private String defaultAdminEmail;

    @Value("${app.default-admin.password}")
    private String defaultAdminPassword;

    @Value("${app.default-admin.full-name}")
    private String defaultAdminFullName;

    @Override
    public void run(String... args) {
        if (staffRepository.count() > 0) {
            return;
        }

        Staff admin = Staff.builder()
                .email(defaultAdminEmail)
                .password(passwordEncoder.encode(defaultAdminPassword))
                .fullName(defaultAdminFullName)
                .role(StaffRole.ADMIN)
                .active(true)
                .build();

        staffRepository.save(admin);

        log.info("Varsayilan admin hesabi olusturuldu -> email: {}. ILK GIRISTEN SONRA SIFREYI DEGISTIRIN.",
                defaultAdminEmail);
    }

    
}
