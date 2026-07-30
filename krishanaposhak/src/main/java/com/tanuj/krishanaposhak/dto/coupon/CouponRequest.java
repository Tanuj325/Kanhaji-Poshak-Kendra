package com.tanuj.krishanaposhak.dto.coupon;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CouponRequest {

    @NotBlank(message = "Coupon code is required")
    @Size(max = 50, message = "Code must be at most 50 characters")
    private String code;

    @Size(max = 255, message = "Description must be at most 255 characters")
    private String description;

    @NotBlank(message = "Discount type is required")
    private String discountType;

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be positive")
    private Double discountValue;

    private Double minimumOrderAmount;

    private Double maximumDiscountAmount;

    @NotNull(message = "Usage limit is required")
    @Positive(message = "Usage limit must be positive")
    private Integer usageLimit;

    @NotNull(message = "Per user limit is required")
    @Positive(message = "Per user limit must be positive")
    private Integer perUserLimit;

    @NotNull(message = "Valid from date is required")
    private LocalDateTime validFrom;

    @NotNull(message = "Valid until date is required")
    private LocalDateTime validUntil;

    private Boolean active = true;
}

