package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long>,
        JpaSpecificationExecutor<ProductVariant> {

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);

    List<ProductVariant> findByProductId(Long productId);

    List<ProductVariant> findByProductIdAndActiveTrue(Long productId);

    List<ProductVariant> findByActiveTrue();

    List<ProductVariant> findByStockGreaterThan(Integer stock);

    List<ProductVariant> findByStockLessThanEqual(Integer stock);

    long countByActiveTrue();

}