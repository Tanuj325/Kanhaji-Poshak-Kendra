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
        name = "wishlist_items",
        indexes = {
                @Index(name = "idx_wishlist_item_wishlist", columnList = "wishlist_id"),
                @Index(name = "idx_wishlist_item_variant", columnList = "product_variant_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_wishlist_variant",
                        columnNames = {"wishlist_id", "product_variant_id"}
                )
        }
)
public class WishlistItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id", nullable = false)
    private Wishlist wishlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

}