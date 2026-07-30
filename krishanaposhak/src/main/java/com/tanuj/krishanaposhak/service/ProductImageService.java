package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.product.ProductImageRequest;
import com.tanuj.krishanaposhak.dto.product.ProductImageResponse;

import java.util.List;

public interface ProductImageService {

    List<ProductImageResponse> getImagesByProduct(Long productId);

    ProductImageResponse addImage(Long productId, ProductImageRequest request);

    ProductImageResponse updateImage(Long productId, Long imageId, ProductImageRequest request);

    void deleteImage(Long productId, Long imageId);

    ProductImageResponse setThumbnail(Long productId, Long imageId);

}