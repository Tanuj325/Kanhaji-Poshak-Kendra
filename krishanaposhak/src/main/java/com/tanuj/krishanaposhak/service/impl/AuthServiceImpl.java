package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.auth.AuthResponse;
import com.tanuj.krishanaposhak.dto.auth.LoginRequest;
import com.tanuj.krishanaposhak.dto.auth.RefreshTokenRequest;
import com.tanuj.krishanaposhak.dto.auth.RegisterRequest;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.enums.Role;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.exception.DuplicateResourceException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.exception.UnauthorizedException;
import com.tanuj.krishanaposhak.mapper.AuthMapper;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.security.jwt.JwtService;
import com.tanuj.krishanaposhak.service.AuthService;
import com.tanuj.krishanaposhak.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final UserService userService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Phone number is already registered");
        }

        User user = new User();
        authMapper.registerDtoToUser(request, user);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        // Set enabled to false until email is verified
        user.setEnabled(true);

        user = userRepository.save(user);

        // Send verification email
        userService.sendVerificationEmail(user);

        // Generate JWT tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (Boolean.FALSE.equals(user.getEnabled()) || Boolean.FALSE.equals(user.getAccountNonLocked())) {
            throw new UnauthorizedException("Account is disabled. Please contact support.");
        }

        // Generate JWT tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        if (request.getRefreshToken() == null || request.getRefreshToken().isBlank()) {
            throw new BadRequestException("Refresh token is required");
        }

        if (!jwtService.isTokenValid(request.getRefreshToken())) {
            throw new UnauthorizedException("Refresh token is invalid or expired");
        }

        Long userId = jwtService.extractUserId(request.getRefreshToken());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate new JWT tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public void logout(Long userId) {
        // Tokens are stateless JWTs here, so there is nothing to invalidate server-side
        // unless a token blacklist / refresh-token store is introduced later.
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
