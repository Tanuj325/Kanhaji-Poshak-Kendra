package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    List<ProductImage> findByProductIdOrderByDisplayOrderAsc(Long productId);

    List<ProductImage> findByProductIdAndActiveTrueOrderByDisplayOrderAsc(Long productId);

    Optional<ProductImage> findByProductIdAndThumbnailTrue(Long productId);

    long countByProductId(Long productId);

    void deleteByProductId(Long productId);

}