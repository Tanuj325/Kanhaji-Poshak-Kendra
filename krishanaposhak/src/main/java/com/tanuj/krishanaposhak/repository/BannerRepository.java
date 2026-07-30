package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long>, JpaSpecificationExecutor<Banner> {

    List<Banner> findByActiveTrueOrderByCreatedAtDesc();

    long countByActiveTrue();

    /**
     * Get the N most recent banners ordered by creation date descending.
     *
     * @param n the number of recent banners to retrieve
     * @return list of recent banners
     */
    List<Banner> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}