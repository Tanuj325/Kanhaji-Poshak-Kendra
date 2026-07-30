package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.analytics.ActivityResponseDTO;
import com.tanuj.krishanaposhak.repository.*;
import com.tanuj.krishanaposhak.entity.*;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import com.tanuj.krishanaposhak.service.RecentActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecentActivityServiceImpl implements RecentActivityService {

    private static final int FETCH_LIMIT_PER_TYPE = 50;

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final CouponRepository couponRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;

    @Override
    public Page<ActivityResponseDTO> getRecentActivities(Pageable pageable, String type) {
        List<ActivityResponseDTO> activities = new ArrayList<>();

        try {
            if (type == null || type.isEmpty()) {
                fetchAllActivities(activities);
            } else {
                String t = type.toUpperCase();
                switch (t) {
                    case "ORDER_PLACED":
                        fetchOrders(activities);
                        break;
                    case "PAYMENT_SUCCESS":
                        fetchPaymentsByStatus(activities, PaymentStatus.PAID);
                        break;
                    case "PAYMENT_FAILED":
                        fetchPaymentsByStatus(activities, PaymentStatus.FAILED);
                        break;
                    case "USER_REGISTERED":
                        fetchUsers(activities);
                        break;
                    case "PRODUCT_CREATED":
                        fetchProducts(activities, true); // created
                        break;
                    case "PRODUCT_UPDATED":
                        fetchProducts(activities, false); // not created (treated as updated)
                        break;
                    case "REVIEW_ADDED":
                        fetchReviews(activities);
                        break;
                    case "CONTACT_MESSAGE_RECEIVED":
                        fetchContactMessages(activities);
                        break;
                    case "COUPON_CREATED":
                        fetchCoupons(activities);
                        break;
                    case "CATEGORY_CREATED":
                        fetchCategories(activities);
                        break;
                    case "BANNER_CREATED":
                        fetchBanners(activities);
                        break;
                    default:
                        // unknown type, return empty list
                        break;
                }
            }
        } catch (Exception e) {
            log.error("Error building recent activity feed: {}", e.getMessage(), e);
        }

        // Remove any null DTOs
        activities.removeIf(Objects::isNull);

        // Sort all activities by createdAt descending with null safety
        activities.sort((a, b) -> {
            if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
            if (a.getCreatedAt() == null) return 1;
            if (b.getCreatedAt() == null) return -1;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });

        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), activities.size());
        if (start > activities.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, activities.size());
        }
        List<ActivityResponseDTO> pageContent = activities.subList(start, end);

        return new PageImpl<>(pageContent, pageable, activities.size());
    }

    // Helper methods for fetching all types
    private void fetchAllActivities(List<ActivityResponseDTO> activities) {
        fetchOrders(activities);
        fetchPaymentsAll(activities);
        fetchUsers(activities);
        fetchProductsAll(activities);
        fetchReviews(activities);
        fetchContactMessages(activities);
        fetchCoupons(activities);
        fetchCategories(activities);
        fetchBanners(activities);
    }

    private void fetchOrders(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Order> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Order order : recentOrders) {
                ActivityResponseDTO dto = orderToDto(order);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent orders for activity feed: {}", e.getMessage());
        }
    }

    private void fetchPaymentsAll(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Payment> recentPayments = paymentRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Payment payment : recentPayments) {
                ActivityResponseDTO dto = paymentToDto(payment);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent payments for activity feed: {}", e.getMessage());
        }
    }

    private void fetchPaymentsByStatus(List<ActivityResponseDTO> activities, PaymentStatus status) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Payment> recentPayments = paymentRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Payment payment : recentPayments) {
                if (payment.getPaymentStatus() == status) {
                    ActivityResponseDTO dto = paymentToDto(payment);
                    if (dto != null) activities.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("Error fetching payments by status for activity feed: {}", e.getMessage());
        }
    }

    private void fetchUsers(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<User> recentUsers = userRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (User user : recentUsers) {
                ActivityResponseDTO dto = userToDto(user);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent users for activity feed: {}", e.getMessage());
        }
    }

    private void fetchProductsAll(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Product> recentProducts = productRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Product product : recentProducts) {
                ActivityResponseDTO dto = productToDto(product);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent products for activity feed: {}", e.getMessage());
        }
    }

    private void fetchProducts(List<ActivityResponseDTO> activities, boolean onlyCreated) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Product> recentProducts = productRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Product product : recentProducts) {
                boolean isCreated = false;
                if (product.getUpdatedAt() != null && product.getCreatedAt() != null) {
                    long diffSeconds = java.time.Duration.between(product.getCreatedAt(), product.getUpdatedAt()).getSeconds();
                    if (diffSeconds < 5) {
                        isCreated = true;
                    }
                }
                if (onlyCreated == isCreated) {
                    ActivityResponseDTO dto = productToDto(product);
                    if (dto != null) activities.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("Error fetching products for activity feed: {}", e.getMessage());
        }
    }

    private void fetchReviews(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Review> recentReviews = reviewRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Review review : recentReviews) {
                ActivityResponseDTO dto = reviewToDto(review);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent reviews for activity feed: {}", e.getMessage());
        }
    }

    private void fetchContactMessages(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<ContactMessage> recentContactMessages = contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (ContactMessage contactMessage : recentContactMessages) {
                ActivityResponseDTO dto = contactMessageToDto(contactMessage);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent contact messages for activity feed: {}", e.getMessage());
        }
    }

    private void fetchCoupons(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Coupon> recentCoupons = couponRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Coupon coupon : recentCoupons) {
                ActivityResponseDTO dto = couponToDto(coupon);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent coupons for activity feed: {}", e.getMessage());
        }
    }

    private void fetchCategories(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Category> recentCategories = categoryRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Category category : recentCategories) {
                ActivityResponseDTO dto = categoryToDto(category);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent categories for activity feed: {}", e.getMessage());
        }
    }

    private void fetchBanners(List<ActivityResponseDTO> activities) {
        try {
            Pageable pageable = PageRequest.of(0, FETCH_LIMIT_PER_TYPE);
            List<Banner> recentBanners = bannerRepository.findAllByOrderByCreatedAtDesc(pageable);
            for (Banner banner : recentBanners) {
                ActivityResponseDTO dto = bannerToDto(banner);
                if (dto != null) activities.add(dto);
            }
        } catch (Exception e) {
            log.error("Error fetching recent banners for activity feed: {}", e.getMessage());
        }
    }

    // Mapping methods

    private ActivityResponseDTO orderToDto(Order order) {
        if (order == null) return null;
        String orderNum = order.getOrderNumber() != null ? order.getOrderNumber() : "ORD-" + order.getId();
        return ActivityResponseDTO.builder()
                .id(order.getId())
                .type("ORDER_PLACED")
                .description("Order placed: " + orderNum)
                .createdAt(order.getCreatedAt() != null ? order.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("ORDER")
                .entityId(order.getId())
                .entityName(orderNum)
                .build();
    }

    private ActivityResponseDTO paymentToDto(Payment payment) {
        if (payment == null) return null;
        String orderNum = (payment.getOrder() != null && payment.getOrder().getOrderNumber() != null)
                ? payment.getOrder().getOrderNumber()
                : "Payment #" + payment.getId();
        PaymentStatus status = payment.getPaymentStatus() != null ? payment.getPaymentStatus() : PaymentStatus.PENDING;
        String type;
        String description;
        if (status == PaymentStatus.PAID) {
            type = "PAYMENT_SUCCESS";
            description = "Payment successful for order: " + orderNum;
        } else if (status == PaymentStatus.FAILED) {
            type = "PAYMENT_FAILED";
            description = "Payment failed for order: " + orderNum;
        } else {
            type = "PAYMENT_" + status;
            description = "Payment status update: " + status + " for order: " + orderNum;
        }
        return ActivityResponseDTO.builder()
                .id(payment.getId())
                .type(type)
                .description(description)
                .createdAt(payment.getCreatedAt() != null ? payment.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("PAYMENT")
                .entityId(payment.getId())
                .entityName(orderNum)
                .build();
    }

    private ActivityResponseDTO userToDto(User user) {
        if (user == null) return null;
        String email = user.getEmail() != null ? user.getEmail() : "User #" + user.getId();
        return ActivityResponseDTO.builder()
                .id(user.getId())
                .type("USER_REGISTERED")
                .description("New user registered: " + email)
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("USER")
                .entityId(user.getId())
                .entityName(email)
                .build();
    }

    private ActivityResponseDTO productToDto(Product product) {
        if (product == null) return null;
        String name = product.getName() != null ? product.getName() : "Product #" + product.getId();
        String type = "PRODUCT_UPDATED";
        String description = "Product updated: " + name;
        if (product.getUpdatedAt() != null && product.getCreatedAt() != null) {
            long diffSeconds = java.time.Duration.between(product.getCreatedAt(), product.getUpdatedAt()).getSeconds();
            if (diffSeconds < 5) {
                type = "PRODUCT_CREATED";
                description = "Product created: " + name;
            }
        }
        return ActivityResponseDTO.builder()
                .id(product.getId())
                .type(type)
                .description(description)
                .createdAt(product.getCreatedAt() != null ? product.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("PRODUCT")
                .entityId(product.getId())
                .entityName(name)
                .build();
    }

    private ActivityResponseDTO reviewToDto(Review review) {
        if (review == null) return null;
        String productName = (review.getProduct() != null && review.getProduct().getName() != null)
                ? review.getProduct().getName()
                : "Review #" + review.getId();
        return ActivityResponseDTO.builder()
                .id(review.getId())
                .type("REVIEW_ADDED")
                .description("New review added for product: " + productName)
                .createdAt(review.getCreatedAt() != null ? review.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("REVIEW")
                .entityId(review.getId())
                .entityName(productName)
                .build();
    }

    private ActivityResponseDTO contactMessageToDto(ContactMessage contactMessage) {
        if (contactMessage == null) return null;
        String email = contactMessage.getEmail() != null ? contactMessage.getEmail() : "Message #" + contactMessage.getId();
        String name = contactMessage.getName() != null ? contactMessage.getName() : email;
        return ActivityResponseDTO.builder()
                .id(contactMessage.getId())
                .type("CONTACT_MESSAGE_RECEIVED")
                .description("New contact message from: " + email)
                .createdAt(contactMessage.getCreatedAt() != null ? contactMessage.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("CONTACT_MESSAGE")
                .entityId(contactMessage.getId())
                .entityName(name)
                .build();
    }

    private ActivityResponseDTO couponToDto(Coupon coupon) {
        if (coupon == null) return null;
        String code = coupon.getCode() != null ? coupon.getCode() : "COUPON-" + coupon.getId();
        return ActivityResponseDTO.builder()
                .id(coupon.getId())
                .type("COUPON_CREATED")
                .description("New coupon created: " + code)
                .createdAt(coupon.getCreatedAt() != null ? coupon.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("COUPON")
                .entityId(coupon.getId())
                .entityName(code)
                .build();
    }

    private ActivityResponseDTO categoryToDto(Category category) {
        if (category == null) return null;
        String name = category.getName() != null ? category.getName() : "Category #" + category.getId();
        return ActivityResponseDTO.builder()
                .id(category.getId())
                .type("CATEGORY_CREATED")
                .description("New category created: " + name)
                .createdAt(category.getCreatedAt() != null ? category.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("CATEGORY")
                .entityId(category.getId())
                .entityName(name)
                .build();
    }

    private ActivityResponseDTO bannerToDto(Banner banner) {
        if (banner == null) return null;
        String title = banner.getTitle() != null ? banner.getTitle() : "Banner #" + banner.getId();
        return ActivityResponseDTO.builder()
                .id(banner.getId())
                .type("BANNER_CREATED")
                .description("New banner created: " + title)
                .createdAt(banner.getCreatedAt() != null ? banner.getCreatedAt() : java.time.LocalDateTime.now())
                .entityType("BANNER")
                .entityId(banner.getId())
                .entityName(title)
                .build();
    }
}