package com.tanuj.krishanaposhak.mapper;

import com.tanuj.krishanaposhak.dto.coupon.CouponResponse;
import com.tanuj.krishanaposhak.entity.Coupon;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CouponMapper {

    @Mapping(target = "discountType",
            expression = "java(coupon.getDiscountType() != null ? coupon.getDiscountType().name() : null)")
    @Mapping(target = "discountValue",
            expression = "java(coupon.getDiscountValue() != null ? coupon.getDiscountValue().doubleValue() : null)")
    @Mapping(target = "minimumOrderAmount",
            expression = "java(coupon.getMinimumOrderAmount() != null ? coupon.getMinimumOrderAmount().doubleValue() : null)")
    @Mapping(target = "maximumDiscountAmount",
            expression = "java(coupon.getMaximumDiscountAmount() != null ? coupon.getMaximumDiscountAmount().doubleValue() : null)")
    @Mapping(target = "validFrom",
            expression = "java(coupon.getValidFrom() != null ? coupon.getValidFrom().toLocalDate() : null)")
    @Mapping(target = "validUntil",
            expression = "java(coupon.getValidUntil() != null ? coupon.getValidUntil().toLocalDate() : null)")
    @Mapping(target = "usedCount",
            expression = "java(calculateUsedCount(coupon))")
    @Mapping(target = "active", source = "active")
    CouponResponse toResponse(Coupon coupon);

    default Integer calculateUsedCount(Coupon coupon) {
        if (coupon == null) return 0;
        int count = coupon.getUsedCount() != null ? coupon.getUsedCount() : 0;
        int usageSize = coupon.getCouponUsages() != null ? coupon.getCouponUsages().size() : 0;
        return Math.max(count, usageSize);
    }

}
