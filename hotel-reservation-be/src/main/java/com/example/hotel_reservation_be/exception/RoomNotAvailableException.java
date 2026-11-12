package com.example.hotel_reservation_be.exception;

import java.time.LocalDate;

public class RoomNotAvailableException extends RuntimeException{
    
     public RoomNotAvailableException(String message) {
        super(message);
    }

    public static RoomNotAvailableException forDate(String roomTypeName, LocalDate date) {
        return new RoomNotAvailableException(
                roomTypeName + " oda tipi " + date + " tarihinde musait degil."
        );
    }
}
