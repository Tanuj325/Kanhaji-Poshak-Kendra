package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.product.ProductVariantRequest;
import com.tanuj.krishanaposhak.dto.product.ProductVariantResponse;
import com.tanuj.krishanaposhak.entity.Product;
import com.tanuj.krishanaposhak.entity.ProductVariant;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.exception.DuplicateResourceException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.ProductVariantMapper;
import com.tanuj.krishanaposhak.repository.ProductRepository;
import com.tanuj.krishanaposhak.repository.ProductVariantRepository;
import com.tanuj.krishanaposhak.service.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;
    private final ProductVariantMapper productVariantMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductVariantResponse> getVariantsByProduct(Long productId) {
        return productVariantMapper.toResponseList(productVariantRepository.findByProductId(productId));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductVariantResponse getVariantById(Long variantId) {
        return productVariantMapper.toResponse(findVariantOrThrow(variantId));
    }

    @Override
    public ProductVariantResponse addVariant(Long productId, ProductVariantRequest request) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        String sku = (request.getSku() == null || request.getSku().isBlank())
                ? generateSku(product, request)
                : request.getSku();

        if (productVariantRepository.existsBySku(sku)) {
            throw new DuplicateResourceException("Variant SKU already exists: " + sku);
        }

        ProductVariant variant = productVariantMapper.toEntity(request);
        variant.setProduct(product);
        variant.setSku(sku);

        variant = productVariantRepository.save(variant);
        return productVariantMapper.toResponse(variant);
    }

    @Override
    public ProductVariantResponse updateVariant(Long productId, Long variantId, ProductVariantRequest request) {

        ProductVariant variant = findOwnedVariantOrThrow(productId, variantId);
        productVariantMapper.updateEntityFromRequest(request, variant);

        variant = productVariantRepository.save(variant);
        return productVariantMapper.toResponse(variant);
    }

    @Override
    public void deleteVariant(Long productId, Long variantId) {
        ProductVariant variant = findOwnedVariantOrThrow(productId, variantId);
        productVariantRepository.delete(variant);
    }

    @Override
    public void toggleVariantStatus(Long variantId) {
        ProductVariant variant = findVariantOrThrow(variantId);
        variant.setActive(!Boolean.TRUE.equals(variant.getActive()));
        productVariantRepository.save(variant);
    }

    @Override
    public void updateStock(Long variantId, Integer stock) {
        if (stock == null || stock < 0) {
            throw new BadRequestException("Stock cannot be negative");
        }
        ProductVariant variant = findVariantOrThrow(variantId);
        variant.setStock(stock);
        productVariantRepository.save(variant);
    }

    private ProductVariant findVariantOrThrow(Long variantId) {
        return productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found with id: " + variantId));
    }

    private ProductVariant findOwnedVariantOrThrow(Long productId, Long variantId) {
        ProductVariant variant = findVariantOrThrow(variantId);
        if (!variant.getProduct().getId().equals(productId)) {
            throw new BadRequestException("Variant does not belong to product: " + productId);
        }
        return variant;
    }

    private String generateSku(Product product, ProductVariantRequest request) {
        String slugPart = product.getSlug() == null ? "SKU" : product.getSlug().toUpperCase();
        return slugPart + "-" + request.getSize() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

}