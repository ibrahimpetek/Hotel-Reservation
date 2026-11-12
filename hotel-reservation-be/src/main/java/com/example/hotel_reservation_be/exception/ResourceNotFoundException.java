package com.example.hotel_reservation_be.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException of(String entityName, Object identifier) {
        return new ResourceNotFoundException(entityName + " bulunamadi: " + identifier);
    }
    
}
