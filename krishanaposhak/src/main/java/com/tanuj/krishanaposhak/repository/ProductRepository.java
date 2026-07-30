package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.dto.analytics.*;
import com.tanuj.krishanaposhak.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    List<Product> findByFeaturedTrueAndActiveTrue();

    List<Product> findByNewArrivalTrueAndActiveTrue();

    /**
     * Get top selling products based on units sold and revenue.
     *
     * @param pageable pagination information
     * @return page of product sales dtos
     */
    @Query("SELECT new com.tanuj.krishanaposhak.dto.analytics.ProductSalesDto(p.id, p.name, p.slug, SUM(oi.quantity), SUM(oi.totalPrice)) " +
            "FROM Product p " +
            "JOIN p.variants pv " +
            "JOIN pv.orderItems oi " +
            "JOIN oi.order o " +
            "WHERE o.orderStatus = com.tanuj.krishanaposhak.enums.OrderStatus.DELIVERED " +
            "GROUP BY p.id, p.name, p.slug " +
            "ORDER BY SUM(oi.quantity) DESC")
    Page<ProductSalesDto> findTopSellingProducts(Pageable pageable);

    /**
     * Get top rated products based on average rating and review count.
     *
     * @param pageable pagination information
     * @return page of product rating dtos
     */
    @Query("SELECT new com.tanuj.krishanaposhak.dto.analytics.ProductRatingDto(r.product.id, r.product.name, r.product.slug, AVG(r.rating), COUNT(r)) " +
            "FROM Review r " +
            "WHERE r.status = com.tanuj.krishanaposhak.enums.ReviewStatus.APPROVED " +
            "GROUP BY r.product.id, r.product.name, r.product.slug " +
            "ORDER BY AVG(r.rating) DESC, COUNT(r) DESC")
    Page<ProductRatingDto> findTopRatedProducts(Pageable pageable);

    /**
     * Get most reviewed products based on review count.
     *
     * @param pageable pagination information
     * @return page of product most reviewed dtos
     */
    @Query("SELECT new com.tanuj.krishanaposhak.dto.analytics.ProductMostReviewedDto(r.product.id, r.product.name, r.product.slug, COUNT(r)) " +
            "FROM Review r " +
            "WHERE r.status = com.tanuj.krishanaposhak.enums.ReviewStatus.APPROVED " +
            "GROUP BY r.product.id, r.product.name, r.product.slug " +
            "ORDER BY COUNT(r) DESC")
    Page<ProductMostReviewedDto> findMostReviewedProducts(Pageable pageable);

    /**
     * Get most wishlisted products based on watchlist count.
     *
     * @param pageable pagination information
     * @return page of product most wishlisted dtos
     */
    @Query("SELECT new com.tanuj.krishanaposhak.dto.analytics.ProductMostWishlistedDto(p.id, p.name, p.slug, COUNT(wi)) " +
            "FROM Product p " +
            "JOIN p.variants pv " +
            "JOIN pv.wishlistItems wi " +
            "GROUP BY p.id, p.name, p.slug " +
            "ORDER BY COUNT(wi) DESC")
    Page<ProductMostWishlistedDto> findMostWishlistedProducts(Pageable pageable);

    /**
     * Get low stock products based on stock threshold.
     *
     * @param threshold stock threshold
     * @return list of product stock analytics dtos
     */
    @Query("SELECT new com.tanuj.krishanaposhak.dto.analytics.ProductStockAnalyticsDto(p.id, p.name, p.slug, SUM(pv.stock)) " +
            "FROM Product p " +
            "JOIN p.variants pv " +
            "GROUP BY p.id, p.name, p.slug " +
            "HAVING SUM(pv.stock) <= :threshold")
    List<ProductStockAnalyticsDto> findLowStockProducts(Integer threshold);

    /**
     * Get out of stock products (stock = 0).
     *
     * @return list of product stock analytics dtos
     */
    @Query("SELECT new com.tanuj.krishanaposhak.dto.analytics.ProductStockAnalyticsDto(p.id, p.name, p.slug, SUM(pv.stock)) " +
            "FROM Product p " +
            "JOIN p.variants pv " +
            "GROUP BY p.id, p.name, p.slug " +
            "HAVING SUM(pv.stock) = 0")
    List<ProductStockAnalyticsDto> findOutOfStockProducts();

    /**
     * Get the N most recent products ordered by creation date descending.
     *
     * @param n the number of recent products to retrieve
     * @return list of recent products
     */
    List<Product> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}