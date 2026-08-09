package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.user.UpdateProfileRequest;
import com.tanuj.krishanaposhak.dto.user.UserResponse;
import com.tanuj.krishanaposhak.entity.EmailVerificationToken;
import com.tanuj.krishanaposhak.entity.PasswordResetToken;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.exception.FileStorageException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.UserMapper;
import com.tanuj.krishanaposhak.repository.EmailVerificationTokenRepository;
import com.tanuj.krishanaposhak.repository.PasswordResetTokenRepository;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.service.CloudinaryService;
import com.tanuj.krishanaposhak.service.EmailService;
import com.tanuj.krishanaposhak.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.tanuj.krishanaposhak.util.UrlUtils;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.email.verification-token-expiry-minutes:60}")
    private int verificationTokenExpiryMinutes;

    @Value("${app.email.reset-token-expiry-minutes:30}")
    private int resetTokenExpiryMinutes;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        return userMapper.toResponse(findUserOrThrow(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        return userMapper.toResponse(findUserOrThrow(userId));
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUserOrThrow(userId);
        userMapper.updateEntityFromRequest(request, user);

        MultipartFile file = request.getFile();
        if (file != null && !file.isEmpty()) {
            try {
                // Delete old image if exists
                if (user.getProfileImagePublicId() != null) {
                    cloudinaryService.delete(user.getProfileImagePublicId());
                }

                // Upload new image
                Map<String, Object> uploadResult = cloudinaryService.upload(file, "krishana-poshak/profiles");
                String imageUrl = UrlUtils.ensureHttps(uploadResult.containsKey("secure_url") ? (String) uploadResult.get("secure_url") : (String) uploadResult.get("url"));
                String publicId = uploadResult.containsKey("public_id") ? (String) uploadResult.get("public_id") : (String) uploadResult.get("publicId");

                user.setProfileImageUrl(imageUrl);
                user.setProfileImagePublicId(publicId);
            } catch (Exception e) {
                throw new FileStorageException("Error uploading profile image to Cloudinary", e);
            }
        }

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userMapper.toResponseList(userRepository.findAll());
    }

    @Override
    public void toggleUserStatus(Long userId) {
        User user = findUserOrThrow(userId);
        user.setEnabled(!Boolean.TRUE.equals(user.getEnabled()));
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = findUserOrThrow(userId);
        // Delete profile image from Cloudinary if exists
        if (user.getProfileImagePublicId() != null) {
            try {
                cloudinaryService.delete(user.getProfileImagePublicId());
            } catch (Exception e) {
                // Log error but continue with deletion
                log.error("Failed to delete profile image from Cloudinary: {}", e.getMessage(), e);
            }
        }
        // Delete associated tokens
        emailVerificationTokenRepository.deleteByUser(user);
        passwordResetTokenRepository.deleteByUser(user);

        try {
            userRepository.delete(user);
            userRepository.flush();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            log.warn("Cannot delete user ID {} due to existing referenced records/orders: {}", userId, e.getMessage());
            throw new BadRequestException("Cannot delete user with existing order or transaction history. Please disable the account instead.");
        }
    }

    /**
     * Sends a verification email to the user.
     * <p>
     * This method is called after a user registers to verify their email address.
     * It generates a verification token, saves it, and sends an email with a
     * verification link.
     *
     * @param user the user to send the verification email to
     */
    public void sendVerificationEmail(User user) {

        String token = UUID.randomUUID().toString();

        EmailVerificationToken verificationToken = emailVerificationTokenRepository
                .findByUser(user)
                .orElse(new EmailVerificationToken());

        verificationToken.setUser(user);
        verificationToken.setToken(token);
        verificationToken.setExpiryDate(
                LocalDateTime.now().plusMinutes(verificationTokenExpiryMinutes));

        emailVerificationTokenRepository.save(verificationToken);

        String verificationUrl = "https://kanhaji-poshak-kendra.onrender.com/api/auth/verify-email?token=" + token;

        Map<String, Object> model = new HashMap<>();
        model.put("user", user);
        model.put("verificationUrl", verificationUrl);

        emailService.sendTemplateEmail(
                user.getEmail(),
                "Verify your email address",
                "verify-email",
                model);
    }

    @Override
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new RuntimeException("Email is already verified");
        }
        sendVerificationEmail(user);
    }

    /**
     * Verifies the user's email address using the provided token.
     * <p>
     * If the token is valid and not expired, the user's account is enabled.
     * The token is then removed from the database.
     *
     * @param token the verification token
     * @return true if the verification was successful, false otherwise
     */
    public boolean verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.isExpired()) {
            emailVerificationTokenRepository.delete(verificationToken);
            throw new RuntimeException("Verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        user.setEmailVerified(true);
        userRepository.save(user);
        emailVerificationTokenRepository.delete(verificationToken);

        // Send welcome email
        sendWelcomeEmail(user);

        return true;
    }

    /**
     * Sends a welcome email to the user after their email is verified.
     *
     * @param user the user to send the welcome email to
     */
    private void sendWelcomeEmail(User user) {
        Map<String, Object> model = new HashMap<>();
        model.put("user", user);
        emailService.sendTemplateEmail(user.getEmail(), "Welcome to Krishna Poshak!", "welcome", model);
    }

    /**
     * Initiates a password reset process for the user with the given email.
     * <p>
     * If the user exists, a password reset token is generated and saved, and an
     * email with a reset link is sent.
     *
     * @param email the email address of the user requesting a password reset
     */
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No user found with email: " + email));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(
                LocalDateTime.now()
                        .plusMinutes(resetTokenExpiryMinutes));
        passwordResetTokenRepository.save(resetToken);

        // Send password reset email
        String resetUrl = "https://kanhajiposhak.vercel.app/auth/reset-password?token=" + token;
        Map<String, Object> model = new HashMap<>();
        model.put("user", user);
        model.put("resetUrl", resetUrl);
        emailService.sendTemplateEmail(user.getEmail(), "Reset your password", "reset-password", model);
    }

    /**
     * Resets the user's password using the provided token and new password.
     * <p>
     * If the token is valid and not expired, the user's password is updated and the
     * token is removed.
     *
     * @param token       the password reset token
     * @param newPassword the new password for the user
     */
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid password reset token"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("Password reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}