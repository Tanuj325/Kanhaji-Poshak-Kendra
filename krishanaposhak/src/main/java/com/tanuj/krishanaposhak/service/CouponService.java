package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.coupon.ApplyCouponRequest;
import com.tanuj.krishanaposhak.dto.coupon.CouponRequest;
import com.tanuj.krishanaposhak.dto.coupon.CouponResponse;
import com.tanuj.krishanaposhak.dto.coupon.CouponValidationResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;

import java.util.List;

public interface CouponService {

    PaginationResponse<CouponResponse> getCoupons(String code, Boolean active, Boolean expired, String sort, int page, int size);

    List<CouponResponse> getActiveCoupons();

    CouponResponse getCouponById(Long id);

    CouponResponse getCouponByCode(String code);

    CouponValidationResponse validateCoupon(Long userId, ApplyCouponRequest request, Double orderAmount);

    CouponResponse createCoupon(CouponRequest request);

    CouponResponse updateCoupon(Long id, CouponRequest request);

    void deleteCoupon(Long id);

    void toggleCouponStatus(Long id);

}
