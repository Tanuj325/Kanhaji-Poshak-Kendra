package com.tanuj.krishanaposhak.service.impl;

import com.tanuj.krishanaposhak.dto.common.PaginationResponse;
import com.tanuj.krishanaposhak.dto.coupon.ApplyCouponRequest;
import com.tanuj.krishanaposhak.dto.coupon.CouponValidationResponse;
import com.tanuj.krishanaposhak.dto.order.OrderResponse;
import com.tanuj.krishanaposhak.dto.order.OrderSummaryResponse;
import com.tanuj.krishanaposhak.dto.order.PlaceOrderRequest;
import com.tanuj.krishanaposhak.entity.*;
import com.tanuj.krishanaposhak.enums.NotificationType;
import com.tanuj.krishanaposhak.enums.OrderStatus;
import com.tanuj.krishanaposhak.enums.PaymentMethod;
import com.tanuj.krishanaposhak.enums.PaymentStatus;
import com.tanuj.krishanaposhak.exception.BadRequestException;
import com.tanuj.krishanaposhak.exception.ForbiddenException;
import com.tanuj.krishanaposhak.exception.ResourceNotFoundException;
import com.tanuj.krishanaposhak.mapper.OrderMapper;
import com.tanuj.krishanaposhak.repository.AddressRepository;
import com.tanuj.krishanaposhak.repository.CartItemRepository;
import com.tanuj.krishanaposhak.repository.CartRepository;
import com.tanuj.krishanaposhak.repository.CouponRepository;
import com.tanuj.krishanaposhak.repository.CouponUsageRepository;
import com.tanuj.krishanaposhak.repository.OrderRepository;
import com.tanuj.krishanaposhak.repository.PaymentRepository;
import com.tanuj.krishanaposhak.repository.ProductVariantRepository;
import com.tanuj.krishanaposhak.repository.UserRepository;
import com.tanuj.krishanaposhak.service.CouponService;
import com.tanuj.krishanaposhak.service.EmailService;
import com.tanuj.krishanaposhak.service.NotificationService;
import com.tanuj.krishanaposhak.service.OrderService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.apache.commons.lang3.StringUtils;
import com.tanuj.krishanaposhak.util.ShippingCalculator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private static final Set<OrderStatus> CANCELLABLE_STATUSES =
            Set.of(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PACKING);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final CouponService couponService;
    private final OrderMapper orderMapper;
    private final EmailService emailService;
    private final com.tanuj.krishanaposhak.service.RefundService refundService;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Override
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        // Create the pending order object (not saved yet)
        Order order = createPendingOrder(userId, request);

        // Determine PaymentMethod (default to COD for direct placeOrder if not specified)
        PaymentMethod method = PaymentMethod.COD;
        if (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank()) {
            try {
                method = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
            } catch (IllegalArgumentException e) {
                method = PaymentMethod.COD;
            }
        }

        if (method == PaymentMethod.COD) {
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.PENDING);
            log.info("[COD] Order Status set to CONFIRMED for Order Number: {}", order.getOrderNumber());
        } else {
            order.setOrderStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.PENDING);
        }

        // Now save the order so we have an ID and it's in the database
        order = orderRepository.save(order);

        // Reduce stock for each variant in the order
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                ProductVariant variant = item.getProductVariant();
                if (variant != null) {
                    variant.setStock(variant.getStock() - item.getQuantity());
                    productVariantRepository.save(variant);
                }
            }
        }

        // Create and save Payment record for COD orders with NULL gateway fields
        if (method == PaymentMethod.COD) {
            Payment payment = Payment.builder()
                    .order(order)
                    .paymentMethod(PaymentMethod.COD)
                    .paymentStatus(PaymentStatus.PENDING)
                    .amount(order.getTotalAmount())
                    .transactionId(null)
                    .razorpayOrderId(null)
                    .razorpayPaymentId(null)
                    .razorpaySignature(null)
                    .build();
            payment = paymentRepository.save(payment);
            order.setPayment(payment);
            log.info("[COD] Order Created -> Order Number: {}, Payment Record ID: {}", order.getOrderNumber(), payment.getId());
        }

        Coupon coupon = null;

        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));

            int currentCount = coupon.getUsedCount() != null ? coupon.getUsedCount() : 0;
            coupon.setUsedCount(currentCount + 1);
            couponRepository.save(coupon);

            if (!couponUsageRepository.existsByOrderId(order.getId())) {
                couponUsageRepository.save(
                        CouponUsage.builder()
                                .coupon(coupon)
                                .user(userRepository.findById(userId)
                                        .orElseThrow(() -> new ResourceNotFoundException("User not found")))
                                .order(order)
                                .build()
                );
            }
        }

        cartRepository.findByUserId(userId).ifPresent(c -> cartItemRepository.deleteByCartId(c.getId()));

        // Create order placement notifications for Customer and Admin
        notificationService.createNotification(
                order.getUser(),
                "Order Placed Successfully",
                "Your order #" + order.getOrderNumber() + " has been placed successfully for ₹" + order.getTotalAmount() + ".",
                NotificationType.ORDER
        );
        notificationService.createAdminNotifications(
                "New Order Received",
                "New order #" + order.getOrderNumber() + " received from " + order.getCustomerName() + " for ₹" + order.getTotalAmount() + ".",
                NotificationType.ORDER
        );

        // Send order confirmation email asynchronously for COD orders
        if (method == PaymentMethod.COD) {
            try {
                sendOrderConfirmationEmail(order);
                log.info("[COD] Order Confirmation Email sent for Order Number: {}", order.getOrderNumber());
            } catch (Exception e) {
                log.error("[COD] Failed to send order confirmation email for order " + order.getOrderNumber() + ": " + e.getMessage());
            }
        }

        return orderMapper.toResponse(order);
    }

    /**
     * Creates a pending order (not saved) for the purpose of generating a Razorpay order.
     * Validates the cart, items, coupon, and calculates the total amount.
     * Does NOT save order items, update stock, clear cart, or send email.
     *
     * @param userId      the user ID
     * @param request     the place order request
     * @return the pending order object (not saved)
     */
    public Order createPendingOrder(Long userId, PlaceOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            ProductVariant variant = item.getProductVariant();
            if (variant == null || !Boolean.TRUE.equals(variant.getProduct().getActive())) {
                throw new BadRequestException("Product is not available: " + (variant != null ? variant.getProduct().getName() : "Unknown"));
            }
            if (variant.getStock() < item.getQuantity()) {
                throw new BadRequestException(
                        "Insufficient stock for " + variant.getProduct().getName() + " (" + variant.getSize() + ")");
            }
            BigDecimal unitPrice = variant.getDiscountPrice() != null ? variant.getDiscountPrice() : item.getPrice();
            subtotal = subtotal.add(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        Coupon coupon = null;
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            ApplyCouponRequest applyCouponRequest = new ApplyCouponRequest();
            applyCouponRequest.setCouponCode(request.getCouponCode());
            CouponValidationResponse validation = couponService.validateCoupon(userId, applyCouponRequest, subtotal.doubleValue());
            if (!validation.isValid()) {
                throw new BadRequestException(validation.getMessage());
            }
            coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
            discount = BigDecimal.valueOf(validation.getDiscount());
        }

        BigDecimal amountAfterDiscount = subtotal.subtract(discount);
        BigDecimal shippingCharge = ShippingCalculator.calculateShippingCharge(amountAfterDiscount);
        BigDecimal totalAmount = amountAfterDiscount.add(shippingCharge);

        // Generate order number
        String orderNumber = generateOrderNumber();

        Address shippingAddress = addressRepository.findById(request.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found with id: " + request.getShippingAddressId()));
        if (!shippingAddress.getUser().getId().equals(userId)) {
            throw new ForbiddenException("This address does not belong to you");
        }

        Order order = Order.builder()
                .user(user)
                .orderNumber(orderNumber)
                .orderStatus(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .subtotal(subtotal)
                .discount(discount)
                .shippingCharge(shippingCharge)
                .totalAmount(totalAmount)
                .couponCode(coupon != null ? coupon.getCode() : null)
                .customerName(shippingAddress.getFullName())
                .customerPhone(shippingAddress.getPhoneNumber())
                .customerEmail(user.getEmail())
                .addressLine1(shippingAddress.getAddressLine1())
                .addressLine2(shippingAddress.getAddressLine2())
                .city(shippingAddress.getCity())
                .state(shippingAddress.getState())
                .country(shippingAddress.getCountry())
                .postalCode(shippingAddress.getPostalCode())
                .notes(request.getOrderNotes())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem item : cartItems) {
            ProductVariant variant = item.getProductVariant();
            BigDecimal unitPrice = variant.getDiscountPrice() != null ? variant.getDiscountPrice() : item.getPrice();

            orderItems.add(OrderItem.builder()
                    .order(order)
                    .productVariant(variant)
                    .productName(variant.getProduct().getName())
                    .sku(variant.getSku())
                    .size(variant.getSize())
                    .color(item.getColor())
                    .productImage(pickThumbnail(variant))
                    .price(unitPrice)
                    .quantity(item.getQuantity())
                    .totalPrice(unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())))
                    .build());
        }
        order.setOrderItems(orderItems);

        return order;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long userId, Long orderId) {
        return orderMapper.toResponse(findOwnedOrderOrThrow(userId, orderId));
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<OrderSummaryResponse> getOrdersByUser(Long userId, OrderStatus orderStatus, PaymentStatus paymentStatus, String sort, int page, int size) {
        Specification<Order> spec = buildUserOrderSpecification(userId, orderStatus, paymentStatus);
        Pageable pageable = buildPageable(sort, page, size);
        Page<Order> orderPage = orderRepository.findAll(spec, pageable);
        List<OrderSummaryResponse> content = orderPage.getContent().stream()
                .map(order -> OrderSummaryResponse.builder()
                        .id(order.getId())
                        .orderNumber(order.getOrderNumber())
                        .totalAmount(order.getTotalAmount() == null ? null : order.getTotalAmount().doubleValue())
                        .orderStatus(order.getOrderStatus())
                        .paymentStatus(order.getPaymentStatus())
                        .orderDate(order.getCreatedAt())
                        .build())
                .toList();

        return PaginationResponse.<OrderSummaryResponse>builder()
                .content(content)
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .first(orderPage.isFirst())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PaginationResponse<OrderResponse> getAllOrders(OrderStatus orderStatus, PaymentStatus paymentStatus, String sort, int page, int size) {
        Specification<Order> spec = buildAdminOrderSpecification(orderStatus, paymentStatus);
        Pageable pageable = buildPageable(sort, page, size);
        Page<Order> orderPage = orderRepository.findAll(spec, pageable);
        List<OrderResponse> content = orderPage.getContent().stream()
                .map(orderMapper::toResponse)
                .toList();

        return PaginationResponse.<OrderResponse>builder()
                .content(content)
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .first(orderPage.isFirst())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    public OrderResponse cancelOrder(Long userId, Long orderId) {

        Order order = findOwnedOrderOrThrow(userId, orderId);

        if (!CANCELLABLE_STATUSES.contains(order.getOrderStatus())) {
            throw new BadRequestException("Order cannot be cancelled at this stage: " + order.getOrderStatus());
        }

        for (OrderItem item : order.getOrderItems()) {
            if (item.getProductVariant() != null) {
                ProductVariant variant = item.getProductVariant();
                variant.setStock(variant.getStock() + item.getQuantity());
                productVariantRepository.save(variant);
            }
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        notificationService.createNotification(
                order.getUser(),
                "Order Cancelled",
                "Your order #" + order.getOrderNumber() + " has been cancelled.",
                NotificationType.ORDER
        );

        // Process automatic Razorpay refund if eligible
        if (refundService.isEligibleForRefund(order)) {
            try {
                refundService.processAutomaticRefund(order, "Order cancelled by customer");
                // Update payment and order status to REFUNDED after successful refund
                if (order.getPayment() != null) {
                    order.getPayment().setPaymentStatus(com.tanuj.krishanaposhak.enums.PaymentStatus.REFUNDED);
                    order.setPaymentStatus(com.tanuj.krishanaposhak.enums.PaymentStatus.REFUNDED);
                    orderRepository.save(order);
                }
            } catch (Exception e) {
                log.error("Automatic Razorpay refund failed for cancelled Order ID {}: {}", orderId, e.getMessage());
            }
        }

        return orderMapper.toResponse(order);
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus previousStatus = order.getOrderStatus();
        order.setOrderStatus(status);

        // COD Payment Lifecycle: When admin marks a COD order as DELIVERED, automatically mark payment status as PAID
        if (status == OrderStatus.DELIVERED) {
            Payment payment = order.getPayment();
            if (payment == null) {
                payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
            }

            boolean isCod = (payment != null && payment.getPaymentMethod() == PaymentMethod.COD)
                    || (payment == null && order.getPaymentStatus() != PaymentStatus.PAID);

            if (isCod && order.getPaymentStatus() != PaymentStatus.PAID) {
                log.info("[COD] Order #{} marked as DELIVERED by admin. Automatically updating payment status from {} to PAID.",
                        order.getOrderNumber(), order.getPaymentStatus());

                order.setPaymentStatus(PaymentStatus.PAID);

                if (payment == null) {
                    payment = Payment.builder()
                            .order(order)
                            .paymentMethod(PaymentMethod.COD)
                            .paymentStatus(PaymentStatus.PAID)
                            .amount(order.getTotalAmount())
                            .paidAt(java.time.Instant.now())
                            .build();
                } else {
                    payment.setPaymentStatus(PaymentStatus.PAID);
                    if (payment.getPaidAt() == null) {
                        payment.setPaidAt(java.time.Instant.now());
                    }
                }
                paymentRepository.save(payment);
                order.setPayment(payment);
            }
        }

        order = orderRepository.save(order);

        if (previousStatus != status) {
            notificationService.createNotification(
                    order.getUser(),
                    "Order Status Updated",
                    "Your order #" + order.getOrderNumber() + " status has been updated to " + status + ".",
                    NotificationType.ORDER
            );
        }

        return orderMapper.toResponse(order);
    }

    private Order findOwnedOrderOrThrow(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        User requestingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!order.getUser().getId().equals(userId) && requestingUser.getRole() != com.tanuj.krishanaposhak.enums.Role.ADMIN) {
            throw new ForbiddenException("This order does not belong to you");
        }
        return order;
    }

    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private String pickThumbnail(ProductVariant variant) {
        if (variant.getProduct() == null || variant.getProduct().getImages() == null
                || variant.getProduct().getImages().isEmpty()) {
            return null;
        }
        return variant.getProduct().getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getThumbnail()))
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(variant.getProduct().getImages().getFirst().getImageUrl());
    }

    private Specification<Order> buildUserOrderSpecification(Long userId, OrderStatus orderStatus, PaymentStatus paymentStatus) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user").get("id"), userId));
            if (orderStatus != null) {
                predicates.add(cb.equal(root.get("orderStatus"), orderStatus));
            }
            if (paymentStatus != null) {
                predicates.add(cb.equal(root.get("paymentStatus"), paymentStatus));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Specification<Order> buildAdminOrderSpecification(OrderStatus orderStatus, PaymentStatus paymentStatus) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (orderStatus != null) {
                predicates.add(cb.equal(root.get("orderStatus"), orderStatus));
            }
            if (paymentStatus != null) {
                predicates.add(cb.equal(root.get("paymentStatus"), paymentStatus));
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

                Sort.Direction sortDirection =
                        "DESC".equalsIgnoreCase(direction)
                                ? Sort.Direction.DESC
                                : Sort.Direction.ASC;

                switch (property) {

                    case "orderNumber":
                        return PageRequest.of(
                                page, size,
                                Sort.by(sortDirection, "orderNumber")
                        );

                    case "totalAmount":
                        return PageRequest.of(
                                page, size,
                                Sort.by(sortDirection, "totalAmount")
                        );

                    case "customerName":
                        return PageRequest.of(
                                page, size,
                                Sort.by(sortDirection, "customerName")
                        );

                    case "orderDate":
                    case "createdAt":
                        return PageRequest.of(
                                page, size,
                                Sort.by(sortDirection, "createdAt")
                        );

                    case "paymentStatus":
                        return PageRequest.of(
                                page, size,
                                Sort.by(sortDirection, "paymentStatus")
                        );

                    case "orderStatus":
                        return PageRequest.of(
                                page, size,
                                Sort.by(sortDirection, "orderStatus")
                        );

                    default:
                        return PageRequest.of(
                                page,
                                size,
                                Sort.by(Sort.Direction.DESC, "createdAt")
                        );
                }
            }
        }

        return PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
    }

    private void sendOrderConfirmationEmail(Order order) {
        // Use a Thymeleaf template for the email
        String templateName = "order-confirmation"; // Assuming you have a template named order-confirmation.html in templates/email/
        String subject = "Order Confirmation - " + order.getOrderNumber();
        String to = order.getCustomerEmail();

        Map<String, Object> model = new HashMap<>();
        model.put("order", order);
        model.put("orderItems", order.getOrderItems());
        model.put("customerName", order.getCustomerName());
        model.put("orderNumber", order.getOrderNumber());
        model.put("orderDate", order.getCreatedAt());
        model.put("totalAmount", order.getTotalAmount());
        // Add any other data needed by the template

        emailService.sendTemplateEmail(to, subject, templateName, model);
    }
}