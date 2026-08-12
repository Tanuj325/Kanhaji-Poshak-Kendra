package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.coupon.ApplyCouponRequest;
import com.tanuj.krishanaposhak.dto.coupon.CouponRequest;
import com.tanuj.krishanaposhak.dto.coupon.CouponResponse;
import com.tanuj.krishanaposhak.dto.coupon.CouponValidationResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.entity.Coupon;
import com.tanuj.krishanaposhak.enums.DiscountType;
import com.tanuj.krishanaposhak.enums.NotificationType;
import com.tanuj.krishanaposhak.exception.DuplicateResourceException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.CouponMapper;
import com.tanuj.krishanaposhak.repository.CouponRepository;
import com.tanuj.krishanaposhak.repository.CouponUsageRepository;
import com.tanuj.krishanaposhak.service.CouponService;
import com.tanuj.krishanaposhak.service.NotificationService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import java.math.RoundingMode;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final CouponMapper couponMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<CouponResponse> getCoupons(
            String code,
            Boolean active,
            Boolean expired,
            String sort,
            int page,
            int size) {
        Specification<Coupon> specification = buildCouponSpecification(code, active, expired);
        Pageable pageable = buildPageable(sort, page, size);
        Page<Coupon> couponPage =couponRepository.findAll(specification, pageable);

        return toPaginationResponse(
                couponPage,
                couponPage.getContent()
                        .stream()
                        .map(couponMapper::toResponse)
                        .toList()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponResponse> getActiveCoupons() {
        return couponRepository
                .findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(couponMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        return couponMapper.toResponse(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponResponse getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with code: " + code));
        return couponMapper.toResponse(coupon);
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(
            Long userId,
            ApplyCouponRequest request,
            Double orderAmount) {

        if (orderAmount == null || orderAmount <= 0.0) {
            log.warn("[COUPON_VALIDATION] Rejected coupon application for zero/invalid order amount: {}", orderAmount);
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Cart is empty or order amount is invalid")
                    .discount(0.0)
                    .build();
        }

        if (request == null || StringUtils.isBlank(request.getCouponCode())) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Coupon code is required")
                    .discount(0.0)
                    .build();
        }

        String searchCode = request.getCouponCode().trim();
        Coupon coupon = couponRepository.findByCode(searchCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coupon not found with code: " + searchCode
                        )
                );

        // Check active
        if (!Boolean.TRUE.equals(coupon.getActive())) {
            log.warn("[COUPON_VALIDATION] Coupon {} rejected: inactive", coupon.getCode());
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Coupon is inactive")
                    .discount(0.0)
                    .build();
        }

        // Check expiry
        LocalDateTime now = LocalDateTime.now();
        if ((coupon.getValidFrom() != null && coupon.getValidFrom().isAfter(now))
                || (coupon.getValidUntil() != null && coupon.getValidUntil().isBefore(now))) {
            log.warn("[COUPON_VALIDATION] Coupon {} rejected: expired or not started", coupon.getCode());
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Coupon is expired or not started yet")
                    .discount(0.0)
                    .build();
        }

        BigDecimal eligibleSubtotal = BigDecimal.valueOf(orderAmount).setScale(2, RoundingMode.HALF_UP);

        // Minimum order amount check
        if (coupon.getMinimumOrderAmount() != null
                && eligibleSubtotal.compareTo(coupon.getMinimumOrderAmount()) < 0) {
            log.warn("[COUPON_VALIDATION] Coupon {} rejected: eligible subtotal {} is less than minimum order amount {}",
                    coupon.getCode(), eligibleSubtotal, coupon.getMinimumOrderAmount());
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Minimum order amount should be " + coupon.getMinimumOrderAmount())
                    .discount(0.0)
                    .build();
        }

        // Check total usage limit
        int currentTotalUsed = coupon.getUsedCount() != null ? coupon.getUsedCount() : (int) couponUsageRepository.countByCouponId(coupon.getId());
        if (coupon.getUsageLimit() != null && currentTotalUsed >= coupon.getUsageLimit()) {
            log.warn("[COUPON_VALIDATION] Coupon {} rejected: total usage limit {} reached", coupon.getCode(), coupon.getUsageLimit());
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Coupon usage limit has been reached")
                    .discount(0.0)
                    .build();
        }

        // Check per-user usage limit
        if (userId != null && coupon.getPerUserLimit() != null) {
            long userUsages = couponUsageRepository.countByCouponIdAndUserId(coupon.getId(), userId);
            if (userUsages >= coupon.getPerUserLimit()) {
                log.warn("[COUPON_VALIDATION] Coupon {} rejected for user {}: per-user limit {} reached",
                        coupon.getCode(), userId, coupon.getPerUserLimit());
                return CouponValidationResponse.builder()
                        .valid(false)
                        .message("You have reached the maximum allowed usage limit for this coupon")
                        .discount(0.0)
                        .build();
            }
        }

        BigDecimal calculatedDiscount;

        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            BigDecimal percentage = coupon.getDiscountValue();
            calculatedDiscount = eligibleSubtotal.multiply(percentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            // Maximum discount limit
            if (coupon.getMaximumDiscountAmount() != null) {
                calculatedDiscount = calculatedDiscount.min(coupon.getMaximumDiscountAmount());
            }
            // Percentage discount cannot exceed eligible subtotal
            calculatedDiscount = calculatedDiscount.min(eligibleSubtotal);
        } else {
            // FIXED / FLAT amount discount
            BigDecimal fixedDiscount = coupon.getDiscountValue();
            if (fixedDiscount.compareTo(eligibleSubtotal) > 0) {
                log.warn("[COUPON_VALIDATION] Coupon {} rejected: eligible subtotal {} is less than fixed discount {}",
                        coupon.getCode(), eligibleSubtotal, fixedDiscount);
                return CouponValidationResponse.builder()
                        .valid(false)
                        .message("Coupon discount cannot exceed the eligible order amount.")
                        .discount(0.0)
                        .build();
            }
            calculatedDiscount = fixedDiscount;
        }

        // Defensive checks: discount cannot be negative or exceed eligibleSubtotal
        if (calculatedDiscount.compareTo(BigDecimal.ZERO) < 0) {
            calculatedDiscount = BigDecimal.ZERO;
        }
        if (calculatedDiscount.compareTo(eligibleSubtotal) > 0) {
            calculatedDiscount = eligibleSubtotal;
        }

        log.info("[COUPON_APPLIED] Coupon {} applied successfully. Eligible subtotal: {}, Discount: {}",
                coupon.getCode(), eligibleSubtotal, calculatedDiscount);

        return CouponValidationResponse.builder()
                .valid(true)
                .message("Coupon applied successfully")
                .discount(calculatedDiscount.doubleValue())
                .build();
    }

    @Override
    public CouponResponse createCoupon(CouponRequest request) {
        if (couponRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Coupon code already exists: " + request.getCode());
        }

        DiscountType discountType;
        try {
            discountType = DiscountType.valueOf(request.getDiscountType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid discount type: " + request.getDiscountType()
                    + ". Must be PERCENTAGE or FLAT");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .discountType(discountType)
                .discountValue(BigDecimal.valueOf(request.getDiscountValue()))
                .minimumOrderAmount(request.getMinimumOrderAmount() != null
                        ? BigDecimal.valueOf(request.getMinimumOrderAmount()) : null)
                .maximumDiscountAmount(request.getMaximumDiscountAmount() != null
                        ? BigDecimal.valueOf(request.getMaximumDiscountAmount()) : null)
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .perUserLimit(request.getPerUserLimit())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        Coupon saved = couponRepository.save(coupon);

        if (Boolean.TRUE.equals(saved.getActive())) {
            notificationService.createGlobalNotification(
                    "New Coupon Available!",
                    "Use coupon code '" + saved.getCode() + "' to get special discounts on your orders.",
                    NotificationType.COUPON
            );
        }

        return couponMapper.toResponse(saved);
    }

    @Override
    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));

        // If code is being changed, check uniqueness
        if (!coupon.getCode().equalsIgnoreCase(request.getCode())
                && couponRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Coupon code already exists: " + request.getCode());
        }

        DiscountType discountType;
        try {
            discountType = DiscountType.valueOf(request.getDiscountType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid discount type: " + request.getDiscountType()
                    + ". Must be PERCENTAGE or FLAT");
        }

        coupon.setCode(request.getCode().toUpperCase());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(discountType);
        coupon.setDiscountValue(BigDecimal.valueOf(request.getDiscountValue()));
        coupon.setMinimumOrderAmount(request.getMinimumOrderAmount() != null
                ? BigDecimal.valueOf(request.getMinimumOrderAmount()) : null);
        coupon.setMaximumDiscountAmount(request.getMaximumDiscountAmount() != null
                ? BigDecimal.valueOf(request.getMaximumDiscountAmount()) : null);
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setPerUserLimit(request.getPerUserLimit());
        coupon.setValidFrom(request.getValidFrom());
        coupon.setValidUntil(request.getValidUntil());
        coupon.setActive(request.getActive() != null ? request.getActive() : coupon.getActive());

        Coupon saved = couponRepository.save(coupon);
        return couponMapper.toResponse(saved);
    }

    @Override
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        couponRepository.delete(coupon);
    }

    @Override
    public void toggleCouponStatus(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
        coupon.setActive(!Boolean.TRUE.equals(coupon.getActive()));
        couponRepository.save(coupon);
    }

    private Specification<Coupon> buildCouponSpecification(String code, Boolean active, Boolean expired) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.isNotBlank(code)) {
                String likePattern = "%" + code.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("code")), likePattern));
            }
            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }
            if (expired != null) {
                LocalDateTime now = LocalDateTime.now();
                if (expired) {
                    // Expired: validUntil is before now
                    predicates.add(cb.lessThan(root.get("validUntil"), now));
                } else {
                    // Not expired: validUntil is after now
                    predicates.add(cb.greaterThanOrEqualTo(root.get("validUntil"), now));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Pageable buildPageable(String sort, int page, int size) {
        if (StringUtils.isNotBlank(sort)) {
            String[] parts = StringUtils.split(sort, ',');
            if (parts.length == 2) {
                String property = parts[0].trim();
                String direction = parts[1].trim().toUpperCase();
                Sort.Direction sortDirection = "DESC".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
                return PageRequest.of(page, size, Sort.by(sortDirection, property));
            }
        }
        // Default sort by createdAt descending
        return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    private <T> PaginationResponse<T> toPaginationResponse(Page<?> page, List<T> content) {
        return PaginationResponse.<T>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}