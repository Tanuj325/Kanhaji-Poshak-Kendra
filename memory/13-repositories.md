# REPOSITORIES - Complete Analysis

All repositories in `repository/` package extend `JpaRepository<Entity, Long>`.

| Repository | Entity | Custom Query Methods |
|---|---|---|
| UserRepository | User | findByEmail(), findByPhoneNumber(), existsByEmail(), existsByPhoneNumber() |
| AddressRepository | Address | findByUserId(), findByUserIdAndDefaultAddressTrue() |
| ProductRepository | Product | findBySlug(), findByCategoryId(), findByFeaturedTrue(), findByNewArrivalTrue(), findByActiveTrue(), searchByNameContaining() |
| ProductVariantRepository | ProductVariant | findByProductId(), findBySku(), findByProductIdAndActiveTrue() |
| ProductImageRepository | ProductImage | findByProductId(), findByProductIdAndThumbnailTrue() |
| CategoryRepository | Category | findBySlug(), findByNameContaining(), findByParentCategoryIsNull(), findByParentCategoryId() |
| CartRepository | Cart | findByUserId() (with join fetch cartItems) |
| CartItemRepository | CartItem | findByCartIdAndProductVariantId() |
| WishlistRepository | Wishlist | findByUserId() |
| WishlistItemRepository | WishlistItem | findByWishlistIdAndProductVariantId(), existsByWishlistIdAndProductVariantId() |
| OrderRepository | Order | findByUserId(), findByOrderNumber(), findByOrderStatus(), countByOrderStatus(), sumTotalAmountByOrderStatusAndCreatedAtBetween() |
| OrderItemRepository | OrderItem | findByOrderId() |
| PaymentRepository | Payment | findByOrderId(), findByRazorpayOrderId(), findByRazorpayPaymentId() |
| RefundRepository | Refund | findByPaymentId(), findByOrderId(), findByRazorpayRefundId() |
| CouponRepository | Coupon | findByCode(), findByActiveTrueAndValidFromBeforeAndValidUntilAfter() |
| CouponUsageRepository | CouponUsage | findByCouponIdAndUserId(), countByCouponIdAndUserId() |
| ReviewRepository | Review | findByProductId(), findByUserId(), findByStatus(), avgRatingByProductId() |
| BannerRepository | Banner | findByActiveTrueOrderByDisplayOrderAsc() |
| ContactMessageRepository | ContactMessage | findByResolvedFalse() |
| NotificationRepository | Notification | findByUserIdOrUserIdIsNull(), countByUserIdAndIsReadFalse() |
| EmailVerificationTokenRepository | EmailVerificationToken | findByToken(), deleteByUser() |
| PasswordResetTokenRepository | PasswordResetToken | findByToken() |
| RazorpayWebhookEventRepository | RazorpayWebhookEvent | findByEventId() |

