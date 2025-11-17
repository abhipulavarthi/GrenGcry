package com.grengcry.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// This annotation tells Spring Boot to return a 404 Not Found status when this exception is thrown
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        // This creates a nice, readable error message, e.g., "User not found with id : '1'"
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }

    // You can keep this constructor if some parts of your code use it
    public ResourceNotFoundException(String message) {
        super(message);
    }
}