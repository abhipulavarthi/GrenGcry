package com.grengcry.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    
    // THE FIX: Changed the type from "Role" to "String"
    private String role; 

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}