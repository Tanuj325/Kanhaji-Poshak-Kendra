package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.analytics.*;
import com.tanuj.krishanaposhak.repository.CategoryRepository;
import com.tanuj.krishanaposhak.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service implementation for product analytics.
 */
@Service
@RequiredArgsConstructor
public class ProductAnalyticsServiceImpl implements com.tanuj.krishanaposhak.service.ProductAnalyticsService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Get top selling products based on units sold and revenue.
     *
     * @param limit maximum number of results
     * @return list of top selling products
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductSalesDto> getTopSellingProducts(int limit) {
        Page<ProductSalesDto> page = productRepository.findTopSellingProducts(PageRequest.of(0, limit));
        return page.getContent();
    }

    /**
     * Get top rated products based on average rating and review count.
     *
     * @param limit maximum number of results
     * @return list of top rated products
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductRatingDto> getTopRatedProducts(int limit) {
        Page<ProductRatingDto> page = productRepository.findTopRatedProducts(PageRequest.of(0, limit));
        return page.getContent();
    }

    /**
     * Get most reviewed products based on review count.
     *
     * @param limit maximum number of results
     * @return list of most reviewed products
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductMostReviewedDto> getMostReviewedProducts(int limit) {
        Page<ProductMostReviewedDto> page = productRepository.findMostReviewedProducts(PageRequest.of(0, limit));
        return page.getContent();
    }

    /**
     * Get most wishlisted products based on wishlist count.
     *
     * @param limit maximum number of results
     * @return list of most wishlisted products
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductMostWishlistedDto> getMostWishlistedProducts(int limit) {
        Page<ProductMostWishlistedDto> page = productRepository.findMostWishlistedProducts(PageRequest.of(0, limit));
        return page.getContent();
    }

    /**
     * Get low stock products based on stock threshold.
     *
     * @param threshold stock threshold (default 10)
     * @return list of low stock products
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductStockAnalyticsDto> getLowStockProducts(Integer threshold) {
        if (threshold == null) {
            threshold = 10;
        }
        return productRepository.findLowStockProducts(threshold);
    }

    /**
     * Get out of stock products (stock = 0).
     *
     * @return list of out of stock products
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductStockAnalyticsDto> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts();
    }

    /**
     * Get top selling categories based on products sold and revenue.
     *
     * @param limit maximum number of results
     * @return list of top selling categories
     */
    @Override
    @Transactional(readOnly = true)
    public List<CategoryAnalyticsDto> getTopSellingCategories(int limit) {
        Page<CategoryAnalyticsDto> page = categoryRepository.findTopSellingCategories(PageRequest.of(0, limit));
        return page.getContent();
    }
}