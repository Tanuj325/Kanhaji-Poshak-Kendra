package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.review.ReviewRequest;
import com.tanuj.krishanaposhak.dto.review.ReviewResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.entity.Product;
import com.tanuj.krishanaposhak.entity.Review;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.enums.NotificationType;
import com.tanuj.krishanaposhak.exception.DuplicateResourceException;
import com.tanuj.krishanaposhak.exception.ForbiddenException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.ReviewMapper;
import com.tanuj.krishanaposhak.repository.ProductRepository;
import com.tanuj.krishanaposhak.repository.ReviewRepository;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.service.NotificationService;
import com.tanuj.krishanaposhak.service.ReviewService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<ReviewResponse> getReviewsByProduct(Long productId, Integer rating, String sort, int page, int size) {
        Specification<Review> spec = buildReviewSpecification(productId, rating);
        Pageable pageable = buildPageable(sort, page, size);
        Page<Review> reviewPage = reviewRepository.findAll(spec, pageable);
        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(reviewMapper::toResponse)
                .toList();

        return PaginationResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .first(reviewPage.isFirst())
                .last(reviewPage.isLast())
                .build();
    }

    @Override
    public ReviewResponse addReview(Long userId, ReviewRequest request) {

        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new DuplicateResourceException("You have already reviewed this product");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + request.getProductId()));

        Review review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setProduct(product);

        review = reviewRepository.save(review);

        notificationService.createAdminNotifications(
                "New Review Submitted",
                "New " + review.getRating() + "-star review submitted for product '" + product.getName() + "' by " + user.getFirstName() + " " + user.getLastName() + ".",
                NotificationType.SYSTEM
        );

        return reviewMapper.toResponse(review);
    }

    @Override
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewRequest request) {

        Review review = findOwnedReviewOrThrow(userId, reviewId);
        reviewMapper.updateEntity(request, review);

        review = reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Override
    public void deleteReview(Long userId, Long reviewId) {
        Review review = findOwnedReviewOrThrow(userId, reviewId);
        reviewRepository.delete(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }

    private Review findOwnedReviewOrThrow(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        if (!review.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You can only modify your own review");
        }
        return review;
    }

    private Specification<Review> buildReviewSpecification(Long productId, Integer rating) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("product").get("id"), productId));
            if (rating != null) {
                predicates.add(cb.equal(root.get("rating"), rating));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Pageable buildPageable(String sort, int page, int size) {
        if (StringUtils.isNotBlank(sort)) {
            String[] parts = StringUtils.split(sort, ',');
            if (parts.length == 2) {
                String property = parts[0].trim();
                String direction = parts[1].trim().toUpperCase();
                Sort.Direction sortDirection = "DESC".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
                return PageRequest.of(page, size, Sort.by(sortDirection, property));
            }
        }
        // Default sort by createdAt descending
        return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}