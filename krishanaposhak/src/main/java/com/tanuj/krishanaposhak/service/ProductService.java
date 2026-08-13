package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.dto.product.ProductCardResponse;
import com.tanuj.krishanaposhak.dto.product.ProductDetailsResponse;
import com.tanuj.krishanaposhak.dto.product.ProductRequest;
import com.tanuj.krishanaposhak.dto.product.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    PaginationResponse<ProductCardResponse> getAllProducts(String categoryId,
                                                           String search,
                                                           Boolean featured,
                                                           Boolean active,
                                                           BigDecimal minPrice,
                                                           BigDecimal maxPrice,
                                                           Boolean inStock,
                                                           Double minRating,
                                                           String sort,
                                                           int page,
                                                           int size);

    ProductDetailsResponse getProductBySlug(String slug);

    ProductResponse getProductById(Long id);

    List<ProductCardResponse> getFeaturedProducts();

    List<ProductCardResponse> getNewArrivals();

    PaginationResponse<ProductResponse> getAllProductsForAdmin(Long categoryId,
                                                               String search,
                                                               Boolean featured,
                                                               Boolean active,
                                                               BigDecimal minPrice,
                                                               BigDecimal maxPrice,
                                                               Boolean inStock,
                                                               Double minRating,
                                                               String sort,
                                                               int page,
                                                               int size);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    void toggleProductStatus(Long id);

}