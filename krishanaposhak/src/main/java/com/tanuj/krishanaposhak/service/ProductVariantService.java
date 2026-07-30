package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.product.ProductVariantRequest;
import com.tanuj.krishanaposhak.dto.product.ProductVariantResponse;

import java.util.List;

public interface ProductVariantService {

    List<ProductVariantResponse> getVariantsByProduct(Long productId);

    ProductVariantResponse getVariantById(Long variantId);

    ProductVariantResponse addVariant(Long productId, ProductVariantRequest request);

    ProductVariantResponse updateVariant(Long productId, Long variantId, ProductVariantRequest request);

    void deleteVariant(Long productId, Long variantId);

    void toggleVariantStatus(Long variantId);

    void updateStock(Long variantId, Integer stock);

}