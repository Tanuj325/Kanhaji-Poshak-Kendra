package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review> {

    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<Review> findByUserId(Long userId);

    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    long countByProductId(Long productId);

    /**
     * Get the N most recent reviews ordered by creation date descending.
     *
     * @param n the number of recent reviews to retrieve
     * @return list of recent reviews
     */
    List<Review> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}