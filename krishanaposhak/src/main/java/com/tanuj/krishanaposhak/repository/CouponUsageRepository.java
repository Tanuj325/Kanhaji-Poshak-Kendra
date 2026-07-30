package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    long countByCouponId(Long couponId);

    long countByCouponIdAndUserId(Long couponId, Long userId);

    boolean existsByOrderId(Long orderId);

}