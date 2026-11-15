package com.example.hotel_reservation_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HotelReservationBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotelReservationBeApplication.class, args);
	}

}
