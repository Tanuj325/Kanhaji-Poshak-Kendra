package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.auth.AuthResponse;
import com.tanuj.krishanaposhak.dto.auth.LoginRequest;
import com.tanuj.krishanaposhak.dto.auth.RefreshTokenRequest;
import com.tanuj.krishanaposhak.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(Long userId);

}