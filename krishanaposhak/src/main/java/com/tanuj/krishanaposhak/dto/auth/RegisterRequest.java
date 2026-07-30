package com.tanuj.krishanaposhak.dto.auth;

import com.tanuj.krishanaposhak.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    private String email;

    @NotBlank
    private String phoneNumber;

    @Size(min = 8)
    private String password;

    private Gender gender;

    private LocalDate dateOfBirth;

}