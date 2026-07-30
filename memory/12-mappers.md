# MAPPERS - Complete Analysis

All mappers are located in `mapper/` package. They use manual mapping methods (no MapStruct).

| Mapper | Source → Target | Key Methods |
|---|---|---|
| AddressMapper | Address ↔ AddressResponse, AddressRequest → Address | toResponse(), toEntity(), updateEntity() |
| AuthMapper | User → AuthResponse | toAuthResponse() |
| BannerMapper | Banner ↔ BannerResponse, BannerRequest → Banner | toResponse(), toEntity(), updateEntity() |
| CartItemMapper | CartItem → CartItemResponse | toResponse() |
| CartMapper | Cart → CartResponse | toResponse() |
| CategoryMapper | Category ↔ CategoryResponse, CategoryRequest → Category, Category → CategoryDropdownResponse | toResponse(), toEntity(), toDropdown(), updateEntity() |
| ContactMessageMapper | ContactMessage ↔ ContactResponse, ContactRequest → ContactMessage | toResponse(), toEntity() |
| CouponMapper | Coupon ↔ CouponResponse | toResponse(), toEntity() |
| NotificationMapper | Notification → NotificationResponse | toResponse() |
| OrderItemMapper | OrderItem → OrderItemResponse | toResponse() |
| OrderMapper | Order → OrderResponse, Order → OrderSummaryResponse | toResponse(), toSummary() |
| PaymentMapper | Payment → PaymentResponse | toResponse() |
| ProductImageMapper | ProductImage ↔ ProductImageResponse, ProductImageRequest → ProductImage | toResponse(), toEntity(), updateEntity() |
| ProductMapper | Product ↔ ProductResponse, Product → ProductCardResponse, Product → ProductDetailsResponse | toResponse(), toCard(), toDetails(), toEntity() |
| ProductVariantMapper | ProductVariant ↔ ProductVariantResponse, ProductVariantRequest → ProductVariant | toResponse(), toEntity(), updateEntity() |
| ReviewMapper | Review → ReviewResponse | toResponse() |
| UserMapper | User → UserResponse | toResponse() |
| WishlistItemMapper | WishlistItem → WishlistItemResponse | toResponse() |
| WishlistMapper | Wishlist → WishlistResponse | toResponse() |

### Mapping Patterns
- **toResponse()**: Entity → Response DTO (always)
- **toEntity()**: Request DTO → Entity (for create operations)
- **updateEntity()**: Request DTO → Existing Entity (for update operations)
- **toSummary()**: Entity → Summary DTO (for list views)
- **toCard()/toDetails()**: Product-specific mapping for different detail levels

