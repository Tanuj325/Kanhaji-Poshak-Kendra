package com.tanuj.krishanaposhak.entity;

import com.tanuj.krishanaposhak.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "product_variants",
        indexes = {
                @Index(name = "idx_variant_sku", columnList = "sku")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_variant_sku", columnNames = "sku")
        }
)
public class ProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 30)
    private String size;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, length = 100)
    private String sku;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(
            mappedBy = "productVariant",
            cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();

    @OneToMany(
            mappedBy = "productVariant",
            cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<WishlistItem> wishlistItems = new ArrayList<>();

    @OneToMany(
            mappedBy = "productVariant"
    )
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

}