package com.tanuj.krishanaposhak.repository;

import com.tanuj.krishanaposhak.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {

    @Query("SELECT n FROM Notification n WHERE (n.user.id = :userId OR n.user IS NULL) ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdOrGlobalOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE (n.user.id = :userId OR n.user IS NULL) AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserIdOrGlobal(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE (n.user.id = :userId OR n.user IS NULL) AND n.isRead = false")
    long countUnreadByUserIdOrGlobal(@Param("userId") Long userId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);
}