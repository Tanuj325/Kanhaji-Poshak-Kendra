package com.tanuj.krishanaposhak.controller;

import com.tanuj.krishanaposhak.dto.notification.MarkNotificationRequest;
import com.tanuj.krishanaposhak.dto.notification.NotificationResponse;
import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.service.NotificationService;
import com.tanuj.krishanaposhak.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management API")
@SecurityRequirement(name = "bearerScheme")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtService jwtService;

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return null;
        }
        return jwtService.extractUserId(token);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Operation(summary = "Get all notifications for the authenticated user with filtering and pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaginationResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<PaginationResponse<NotificationResponse>> getNotifications(
            @Parameter(description = "Filter by read status (true for read, false for unread)") @RequestParam(required = false) Boolean isRead,
            @Parameter(description = "Sort field and direction (e.g., 'createdAt,desc')") @RequestParam(required = false) String sort,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        PaginationResponse<NotificationResponse> response = notificationService.getNotifications(userId, isRead, sort, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get unread notifications for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unread notifications retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = NotificationResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @Operation(summary = "Get unread notification count for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unread count retrieved successfully",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @Operation(summary = "Mark a notification as read/unread (authenticated user must own the notification)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = NotificationResponse.class),
                            examples = @ExampleObject(value = "{\"id\":1,\"message\":\"You have a new order\",\"isRead\":true,\"createdAt\":\"2023-05-15T10:30:00\"}"))),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - You do not own this notification"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    @PutMapping("/{notificationId}")
    public ResponseEntity<NotificationResponse> markAsRead(
            @Parameter(description = "Notification ID", required = true) @PathVariable Long notificationId,
            @Valid @RequestBody MarkNotificationRequest markNotificationRequest,
            HttpServletRequest httpRequest) {

        Long userId = getUserIdFromRequest(httpRequest);

        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        NotificationResponse response = notificationService.markAsRead(
                userId,
                notificationId,
                markNotificationRequest
        );

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Mark all notifications as read for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "All notifications marked as read successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PutMapping("/mark-all-as-read")
    public ResponseEntity<Void> markAllAsRead(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete a notification (authenticated user must own the notification)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Notification deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - You do not own this notification"),
            @ApiResponse(responseCode = "404", description = "Notification not found")
    })
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@Parameter(description = "Notification ID", required = true) @PathVariable Long notificationId, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.deleteNotification(userId, notificationId);
        return ResponseEntity.noContent().build();
    }
}