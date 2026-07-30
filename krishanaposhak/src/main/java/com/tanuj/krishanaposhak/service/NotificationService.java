package com.tanuj.krishanaposhak.service;

import com.tanuj.krishanaposhak.dto.notification.MarkNotificationRequest;
import com.tanuj.krishanaposhak.dto.notification.NotificationResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;

import java.util.List;

public interface NotificationService {

    PaginationResponse<NotificationResponse> getNotifications(Long userId, Boolean isRead, String sort, int page, int size);

    List<NotificationResponse> getUnreadNotifications(Long userId);

    long getUnreadCount(Long userId);

    NotificationResponse markAsRead(Long userId, Long notificationId, MarkNotificationRequest request);

    void markAllAsRead(Long userId);

    void deleteNotification(Long userId, Long notificationId);

}