package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCartId(Long cartId);

    List<CartItem> findByCartIdOrderByCreatedAtDesc(Long cartId);

    Optional<CartItem> findByCartIdAndProductVariantId(Long cartId, Long productVariantId);

    boolean existsByCartIdAndProductVariantId(Long cartId, Long productVariantId);

    long countByCartId(Long cartId);

    void deleteByCartId(Long cartId);

    void deleteByCartIdAndProductVariantId(Long cartId, Long productVariantId);

}