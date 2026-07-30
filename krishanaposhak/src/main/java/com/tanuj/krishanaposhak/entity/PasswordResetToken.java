package com.tanuj.krishanaposhak.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Password reset token for resetting user passwords.
 */
@Entity
@Table(name = "password_reset_tokens",
        uniqueConstraints = @UniqueConstraint(columnNames = "token"))
@Getter
@Setter
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private com.tanuj.krishanaposhak.entity.User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    private boolean used;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}