package com.grengcry.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // This annotation creates the constructor we need
public class AuthResponse {
    private String token;
    private String username;
    private String role;
}