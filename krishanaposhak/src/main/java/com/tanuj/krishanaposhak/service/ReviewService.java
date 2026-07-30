package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.dto.review.ReviewRequest;
import com.tanuj.krishanaposhak.dto.review.ReviewResponse;

public interface ReviewService {

    PaginationResponse<ReviewResponse> getReviewsByProduct(Long productId, Integer rating, String sort, int page, int size);

    ReviewResponse addReview(Long userId, ReviewRequest request);

    ReviewResponse updateReview(Long userId, Long reviewId, ReviewRequest request);

    void deleteReview(Long userId, Long reviewId);

    Double getAverageRating(Long productId);

}