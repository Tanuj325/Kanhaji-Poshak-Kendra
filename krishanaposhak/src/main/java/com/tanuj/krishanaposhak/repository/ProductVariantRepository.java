package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.ProductVariant;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long>,
        JpaSpecificationExecutor<ProductVariant> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM ProductVariant v WHERE v.id = :id")
    Optional<ProductVariant> findByIdWithLock(@Param("id") Long id);

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);

    List<ProductVariant> findByProductId(Long productId);

    List<ProductVariant> findByProductIdAndActiveTrue(Long productId);

    List<ProductVariant> findByActiveTrue();

    List<ProductVariant> findByStockGreaterThan(Integer stock);

    List<ProductVariant> findByStockLessThanEqual(Integer stock);

    long countByActiveTrue();

}