package com.grengcry.dto.request;

import com.grengcry.model.enums.Role;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private Role role;
}
