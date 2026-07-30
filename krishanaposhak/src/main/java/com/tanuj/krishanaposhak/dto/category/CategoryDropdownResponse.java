package com.tanuj.krishanaposhak.dto.category;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryDropdownResponse {

    private Long id;

    private String name;

    private String slug;

}