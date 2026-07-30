package com.tanuj.krishanaposhak.dto.user;

import com.tanuj.krishanaposhak.enums.Gender;
import com.tanuj.krishanaposhak.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class UserResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private Gender gender;

    private LocalDate dateOfBirth;

    private String profileImageUrl;

    private Role role;

    private boolean enabled;

    private boolean emailVerified;

}