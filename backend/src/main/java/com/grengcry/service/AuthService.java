package com.grengcry.service;

import com.grengcry.dto.request.LoginRequest;
import com.grengcry.dto.request.RegisterRequest;
import com.grengcry.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
