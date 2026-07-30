package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.dto.analytics.*;
import com.tanuj.krishanaposhak.entity.User;
import com.tanuj.krishanaposhak.enums.Role;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<User> findByRole(Role role);

    long countByRole(Role role);

    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    long countByCreatedAtAfter(LocalDateTime startDate);

    long countByCreatedAtBefore(LocalDateTime endDate);

    long countByEmailVerified(boolean emailVerified);

    @Query("""
    SELECT COUNT(DISTINCT u)
    FROM User u
    JOIN u.orders o
    """)
    long countUsersWithAtLeastOneOrder();

@Query(value = """
    SELECT COUNT(*)
    FROM (
        SELECT u.id
        FROM users u
        JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        HAVING COUNT(o.id) > 1
    ) AS repeat_users
    """, nativeQuery = true)
    long countUsersWithMoreThanOneOrder();

    @Query("""
    SELECT COALESCE(AVG(SIZE(u.orders)),0)
    FROM User u
    """)
    Double averageOrdersPerUser();

    @Query("""
    SELECT COALESCE(AVG(
        (SELECT COALESCE(SUM(o.totalAmount),0)
         FROM Order o
         WHERE o.user = u)
    ),0)
    FROM User u
    """)
    Double averageTotalSpentPerUser();

    /**
     * Get new users (created in the last 7 days) with pagination and basic info.
     */
    @Query("""
    SELECT new com.tanuj.krishanaposhak.dto.analytics.UserSummaryDTO(
        u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt,
        MAX(o.createdAt), COUNT(o), COALESCE(SUM(o.totalAmount), 0)
    )
    FROM User u
    LEFT JOIN u.orders o
    WHERE u.createdAt >= :sevenDaysAgo
    GROUP BY u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt
    ORDER BY u.createdAt DESC
    """)
    Page<UserSummaryDTO> findNewUsers(Pageable pageable);

    /**
     * Get repeat users (more than one order) with pagination and basic info.
     */
    @Query("""
    SELECT new com.tanuj.krishanaposhak.dto.analytics.UserSummaryDTO(
        u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt,
        MAX(o.createdAt), COUNT(o), COALESCE(SUM(o.totalAmount), 0)
    )
    FROM User u
    JOIN u.orders o
    GROUP BY u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt
    HAVING COUNT(o) > 1
    ORDER BY COUNT(o) DESC
    """)
    Page<UserSummaryDTO> findRepeatUsers(Pageable pageable);

    /**
     * Get inactive users (no orders in the last 30 days) with pagination and basic info.
     */
    @Query("""
    SELECT new com.tanuj.krishanaposhak.dto.analytics.UserSummaryDTO(
        u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt,
        MAX(o.createdAt), COUNT(o), COALESCE(SUM(o.totalAmount), 0)
    )
    FROM User u
    LEFT JOIN u.orders o
    GROUP BY u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt
    HAVING MAX(o.createdAt) IS NULL OR MAX(o.createdAt) < :thirtyDaysAgo
    ORDER BY u.createdAt DESC
    """)
    Page<UserSummaryDTO> findInactiveUsers(Pageable pageable);

    /**
     * Get recent users (latest registered) with pagination and basic info.
     */
    @Query("""
    SELECT new com.tanuj.krishanaposhak.dto.analytics.UserSummaryDTO(
        u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt,
        MAX(o.createdAt), COUNT(o), COALESCE(SUM(o.totalAmount), 0)
    )
    FROM User u LEFT JOIN u.orders o
    GROUP BY u.id, u.firstName, u.lastName, u.email, u.phoneNumber, u.createdAt
    ORDER BY u.createdAt DESC
    """)
    Page<UserSummaryDTO> findRecentUsers(Pageable pageable);

    /**
     * Get the N most recent users ordered by creation date descending.
     */
    List<User> findAllByOrderByCreatedAtDesc(Pageable pageable);
}