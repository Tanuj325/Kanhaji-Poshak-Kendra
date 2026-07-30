package com.tanuj.krishanaposhak.dto.banner;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BannerRequest {

    @NotBlank(message = "Banner title is required")
    private String title;

    private String subtitle;

    private MultipartFile file;

    private String redirectUrl;

    private Integer displayOrder;

    private boolean active = true;

}