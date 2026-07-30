package com.tanuj.krishanaposhak.entity;

import com.tanuj.krishanaposhak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "coupon_usages",
        indexes = {
                @Index(name = "idx_coupon_usage_coupon", columnList = "coupon_id"),
                @Index(name = "idx_coupon_usage_user", columnList = "user_id"),
                @Index(name = "idx_coupon_usage_order", columnList = "order_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_coupon_order",
                        columnNames = "order_id"
                )
        }
)
public class CouponUsage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

}