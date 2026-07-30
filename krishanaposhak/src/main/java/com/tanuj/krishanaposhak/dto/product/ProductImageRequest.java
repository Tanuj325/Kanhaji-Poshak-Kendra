package com.tanuj.krishanaposhak.dto.product;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductImageRequest {

    private MultipartFile file;

    private String altText;

    private Integer displayOrder;

    private boolean thumbnail;

    private boolean active = true;

}