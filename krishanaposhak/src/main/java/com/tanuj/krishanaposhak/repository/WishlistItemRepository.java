package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByWishlistId(Long wishlistId);

    List<WishlistItem> findByWishlistIdOrderByCreatedAtDesc(Long wishlistId);

    Optional<WishlistItem> findByWishlistIdAndProductVariantId(Long wishlistId, Long productVariantId);

    boolean existsByWishlistIdAndProductVariantId(Long wishlistId, Long productVariantId);

    long countByWishlistId(Long wishlistId);

    void deleteByWishlistId(Long wishlistId);

    void deleteByWishlistIdAndProductVariantId(Long wishlistId, Long productVariantId);

}