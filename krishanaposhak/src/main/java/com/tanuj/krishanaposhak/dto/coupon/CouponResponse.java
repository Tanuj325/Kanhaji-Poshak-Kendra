package com.tanuj.krishanaposhak.dto.coupon;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CouponResponse {

    private Long id;

    private String code;

    private String description;

    private String discountType;

    private Double discountValue;

    private Double minimumOrderAmount;

    private Double maximumDiscountAmount;

    private Integer usageLimit;

    private Integer usedCount;

    private Integer perUserLimit;

    private LocalDate validFrom;

    private LocalDate validUntil;

    private boolean active;

}
