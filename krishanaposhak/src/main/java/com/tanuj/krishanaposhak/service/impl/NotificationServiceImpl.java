package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.notification.MarkNotificationRequest;
import com.tanuj.krishanaposhak.dto.notification.NotificationResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.entity.Notification;
import com.tanuj.krishanaposhak.exception.ForbiddenException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.NotificationMapper;
import com.tanuj.krishanaposhak.repository.NotificationRepository;
import com.tanuj.krishanaposhak.service.NotificationService;
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
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<NotificationResponse> getNotifications(
            Long userId,
            Boolean isRead,
            String sort,
            int page,
            int size) {

        Specification<Notification> specification =
                buildNotificationSpecification(userId, isRead);

        Pageable pageable = buildPageable(sort, page, size);

        Page<Notification> notificationPage =
                notificationRepository.findAll(specification, pageable);


        List<NotificationResponse> content =
                notificationPage.getContent()
                        .stream()
                        .map(notificationMapper::toResponse)
                        .toList();


        return toPaginationResponse(
                notificationPage,
                content
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public NotificationResponse markAsRead(Long userId, Long notificationId, MarkNotificationRequest request) {

        Notification notification = findOwnedNotificationOrThrow(userId, notificationId);
        notification.setIsRead(request.isRead());

        notification = notificationRepository.save(notification);
        return notificationMapper.toResponse(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    public void deleteNotification(Long userId, Long notificationId) {
        Notification notification = findOwnedNotificationOrThrow(userId, notificationId);
        notificationRepository.delete(notification);
    }

    private Notification findOwnedNotificationOrThrow(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with id: " + notificationId));

        // A null user on the notification means it's a global/broadcast notification,
        // which any authenticated user is allowed to mark as read / delete for themselves.
        if (notification.getUser() != null && !notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("This notification does not belong to you");
        }
        return notification;
    }

    private Specification<Notification> buildNotificationSpecification(Long userId, Boolean isRead) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user").get("id"), userId));
            if (isRead != null) {
                predicates.add(cb.equal(root.get("isRead"), isRead));
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

    private <T> PaginationResponse<T> toPaginationResponse(Page<?> page, List<T> content) {
        return PaginationResponse.<T>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}