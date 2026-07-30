package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.analytics.*;
import java.util.List;

/**
 * Service for product analytics.
 */
public interface ProductAnalyticsService {

    /**
     * Get top selling products based on units sold and revenue.
     *
     * @param limit maximum number of results
     * @return list of top selling products
     */
    List<ProductSalesDto> getTopSellingProducts(int limit);

    /**
     * Get top rated products based on average rating and review count.
     *
     * @param limit maximum number of results
     * @return list of top rated products
     */
    List<ProductRatingDto> getTopRatedProducts(int limit);

    /**
     * Get most reviewed products based on review count.
     *
     * @param limit maximum number of results
     * @return list of most reviewed products
     */
    List<ProductMostReviewedDto> getMostReviewedProducts(int limit);

    /**
     * Get most wishlisted products based on wishlist count.
     *
     * @param limit maximum number of results
     * @return list of most wishlisted products
     */
    List<ProductMostWishlistedDto> getMostWishlistedProducts(int limit);

    /**
     * Get low stock products based on stock threshold.
     *
     * @param threshold stock threshold (default 10)
     * @return list of low stock products
     */
    List<ProductStockAnalyticsDto> getLowStockProducts(Integer threshold);

    /**
     * Get out of stock products (stock = 0).
     *
     * @return list of out of stock products
     */
    List<ProductStockAnalyticsDto> getOutOfStockProducts();

    /**
     * Get top selling categories based on products sold and revenue.
     *
     * @param limit maximum number of results
     * @return list of top selling categories
     */
    List<CategoryAnalyticsDto> getTopSellingCategories(int limit);
}