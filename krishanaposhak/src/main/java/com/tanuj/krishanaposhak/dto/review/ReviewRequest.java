package com.tanuj.krishanaposhak.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    private Long productId;

    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank(message = "Review cannot be empty")
    private String comment;

}