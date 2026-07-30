package com.tanuj.krishanaposhak.dto.user;

import com.tanuj.krishanaposhak.enums.Gender;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class UpdateProfileRequest {

    private String firstName;

    private String lastName;

    private String phoneNumber;

    private Gender gender;

    private LocalDate dateOfBirth;

    private MultipartFile file;
}