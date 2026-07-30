package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.dto.analytics.CategoryAnalyticsDto;
import com.tanuj.krishanaposhak.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long>,
        JpaSpecificationExecutor<Category> {

    Optional<Category> findBySlug(String slug);

    Optional<Category> findByName(String name);

    boolean existsBySlug(String slug);

    boolean existsByName(String name);

    List<Category> findByActiveTrueOrderByDisplayOrderAsc();

    List<Category> findByParentCategoryIsNullAndActiveTrueOrderByDisplayOrderAsc();

    List<Category> findByParentCategoryId(Long parentCategoryId);

    List<Category> findByParentCategoryIdAndActiveTrue(Long parentCategoryId);

    /**
     * Get top selling categories based on products sold and revenue.
     *
     * @param pageable pagination information
     * @return page of category analytics dtos
     */
    @Query("SELECT new com.tanuj.krishanaposhak.dto.analytics.CategoryAnalyticsDto(c.id, c.name, c.slug, COUNT(p), SUM(oi.quantity), SUM(oi.totalPrice)) " +
            "FROM Category c " +
            "JOIN c.products p " +
            "JOIN p.variants v " +
            "JOIN v.orderItems oi " +
            "JOIN oi.order o " +
            "WHERE o.orderStatus = com.tanuj.krishanaposhak.enums.OrderStatus.DELIVERED " +
            "GROUP BY c.id, c.name, c.slug " +
            "ORDER BY SUM(oi.quantity) DESC")
    Page<CategoryAnalyticsDto> findTopSellingCategories(Pageable pageable);

    /**
     * Get the N most recent categories ordered by creation date descending.
     *
     * @param n the number of recent categories to retrieve
     * @return list of recent categories
     */
    List<Category> findAllByOrderByCreatedAtDesc(Pageable pageable);
}