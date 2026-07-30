package com.tanuj.krishanaposhak.dto.contact;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String subject;

    private String message;

    private boolean resolved;

    private LocalDateTime createdAt;

}