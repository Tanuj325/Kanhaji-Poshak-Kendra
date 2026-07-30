package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long>,
        JpaSpecificationExecutor<Coupon> {

    Optional<Coupon> findByCode(String code);

    boolean existsByCode(String code);

    List<Coupon> findByActiveTrue();

    List<Coupon> findByActiveTrueOrderByCreatedAtDesc();

    List<Coupon> findByActiveTrueAndValidUntilAfter(LocalDate date);

    long countByActiveTrue();

    /**
     * Get the N most recent coupons ordered by creation date descending.
     *
     * @param n the number of recent coupons to retrieve
     * @return list of recent coupons
     */
    List<Coupon> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}