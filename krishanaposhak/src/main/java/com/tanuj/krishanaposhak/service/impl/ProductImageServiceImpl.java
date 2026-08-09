package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.product.ProductImageRequest;
import com.tanuj.krishanaposhak.dto.product.ProductImageResponse;
import com.tanuj.krishanaposhak.entity.Product;
import com.tanuj.krishanaposhak.entity.ProductImage;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.ProductImageMapper;
import com.tanuj.krishanaposhak.repository.ProductImageRepository;
import com.tanuj.krishanaposhak.repository.ProductRepository;
import com.tanuj.krishanaposhak.service.CloudinaryService;
import com.tanuj.krishanaposhak.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import com.tanuj.krishanaposhak.util.UrlUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final ProductImageMapper productImageMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public List<ProductImageResponse> getImagesByProduct(Long productId) {
        return productImageMapper.toResponseList(
                productImageRepository.findByProductIdOrderByDisplayOrderAsc(productId));
    }

    @Override
    public ProductImageResponse addImage(Long productId, ProductImageRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Upload file to Cloudinary
        MultipartFile file = request.getFile();
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }

        Map<String, Object> uploadResult = cloudinaryService.upload(file, "krishana-poshak/products");
        String imageUrl = UrlUtils.ensureHttps(uploadResult.containsKey("secure_url") ? (String) uploadResult.get("secure_url") : (String) uploadResult.get("url"));
        String publicId = (String) uploadResult.get("public_id");

        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImageUrl(imageUrl);
        image.setPublicId(publicId);
        image.setAltText(request.getAltText());
        image.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 1);
        image.setThumbnail(request.isThumbnail());
        image.setActive(request.isActive());

        if (Boolean.TRUE.equals(image.getThumbnail())) {
            clearExistingThumbnail(productId);
        }

        image = productImageRepository.save(image);
        return productImageMapper.toResponse(image);
    }

    @Override
    public ProductImageResponse updateImage(Long productId, Long imageId, ProductImageRequest request) {
        ProductImage image = findOwnedImageOrThrow(productId, imageId);

        MultipartFile file = request.getFile();
        if (file != null && !file.isEmpty()) {
            // Upload new file and delete old one
            Map<String, Object> uploadResult = cloudinaryService.upload(file, "krishana-poshak/products");
            String newImageUrl = UrlUtils.ensureHttps(uploadResult.containsKey("secure_url") ? (String) uploadResult.get("secure_url") : (String) uploadResult.get("url"));
            String newPublicId = (String) uploadResult.get("public_id");

            // Delete old image from Cloudinary
            if (image.getPublicId() != null) {
                cloudinaryService.delete(image.getPublicId());
            }

            image.setImageUrl(newImageUrl);
            image.setPublicId(newPublicId);
        }

        // Update other fields
        image.setAltText(request.getAltText());
        image.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : image.getDisplayOrder());
        image.setThumbnail(request.isThumbnail());
        image.setActive(request.isActive());

        if (Boolean.TRUE.equals(image.getThumbnail())) {
            clearExistingThumbnail(productId);
        }

        image = productImageRepository.save(image);
        return productImageMapper.toResponse(image);
    }

    @Override
    public void deleteImage(Long productId, Long imageId) {
        ProductImage image = findOwnedImageOrThrow(productId, imageId);
        // Delete from Cloudinary
        if (image.getPublicId() != null) {
            cloudinaryService.delete(image.getPublicId());
        }
        productImageRepository.delete(image);
    }

    @Override
    public ProductImageResponse setThumbnail(Long productId, Long imageId) {
        ProductImage image = findOwnedImageOrThrow(productId, imageId);
        clearExistingThumbnail(productId);
        image.setThumbnail(true);
        image = productImageRepository.save(image);
        return productImageMapper.toResponse(image);
    }

    private ProductImage findOwnedImageOrThrow(Long productId, Long imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));
        if (!image.getProduct().getId().equals(productId)) {
            throw new BadRequestException("Image does not belong to product: " + productId);
        }
        return image;
    }

    private void clearExistingThumbnail(Long productId) {
        productImageRepository.findByProductIdAndThumbnailTrue(productId)
                .ifPresent(existingThumbnail -> {
                    existingThumbnail.setThumbnail(false);
                    productImageRepository.save(existingThumbnail);
                });
    }

}