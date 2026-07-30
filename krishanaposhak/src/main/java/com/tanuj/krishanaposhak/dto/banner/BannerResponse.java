package com.tanuj.krishanaposhak.dto.banner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {

    private Long id;

    private String title;

    private String subtitle;

    private String imageUrl;

    private String redirectUrl;

    private Integer displayOrder;

    private boolean active;

}