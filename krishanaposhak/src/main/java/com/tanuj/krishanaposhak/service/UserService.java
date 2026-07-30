package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.user.UpdateProfileRequest;
import com.tanuj.krishanaposhak.dto.user.UserResponse;
import com.tanuj.krishanaposhak.entity.User;

import java.util.List;

public interface UserService {

    UserResponse getCurrentUser(Long userId);

    UserResponse getUserById(Long userId);

    UserResponse updateProfile(Long userId, UpdateProfileRequest request);

    List<UserResponse> getAllUsers();

    void toggleUserStatus(Long userId);

    void deleteUser(Long userId);

    void sendVerificationEmail(User user);

    void resendVerificationEmail(String email);

    boolean verifyEmail(String token);

    void initiatePasswordReset(String email);

    void resetPassword(String token, String password);
}