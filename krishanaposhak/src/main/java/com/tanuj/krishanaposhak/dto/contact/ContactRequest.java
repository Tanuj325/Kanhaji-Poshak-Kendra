package com.tanuj.krishanaposhak.dto.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactRequest {

    @NotBlank
    private String name;

    @Email
    private String email;

    private String phoneNumber;

    @NotBlank
    private String subject;

    @NotBlank
    private String message;

}