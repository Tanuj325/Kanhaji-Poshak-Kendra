# ENTITIES - Complete Analysis

## BaseEntity (common/BaseEntity.java)
All entities except (Refund, EmailVerificationToken, PasswordResetToken, RazorpayWebhookEvent) extend BaseEntity.

| Field | Type | Notes |
|---|---|---|
| id | Long (auto-generated, IDENTITY) | Primary key |
| createdAt | LocalDateTime | Auto-set via JPA Auditing |
| updatedAt | LocalDateTime | Auto-set via JPA Auditing |

---

## User (entity/User.java)
**Table**: `users` | **Indexes**: email, phone_number | **UniqueConstraints**: email, phone_number

| Field | Type | Constraints |
|---|---|---|
| firstName | String(50) | NOT NULL |
| lastName | String(50) | NOT NULL |
| email | String(100) | NOT NULL, UNIQUE |
| phoneNumber | String(15) | NOT NULL, UNIQUE |
| password | String | NOT NULL (BCrypt hashed) |
| gender | Gender (enum) | NOT NULL - MALE/FEMALE/KIDS/UNISEX |
| dateOfBirth | LocalDate | Nullable |
| profileImageUrl | String | Nullable |
| profileImagePublicId | String(255) | Nullable (Cloudinary) |
| role | Role (enum) | NOT NULL - ADMIN/CUSTOMER |
| enabled | Boolean | Default: true |
| emailVerified | Boolean | Default: false |
| accountNonLocked | Boolean | Default: true |

**Relationships**:
- `@OneToMany` → Address (cascade ALL, orphanRemoval)
- `@OneToOne` → Cart (cascade ALL, orphanRemoval)
- `@OneToOne` → Wishlist (cascade ALL, orphanRemoval)
- `@OneToMany` → Order
- `@OneToMany` → CouponUsage

**Business Purpose**: Core user entity for both CUSTOMER and ADMIN roles. Supports profile image upload to Cloudinary. Tracks email verification status separately from enabled status.

---

## Address (entity/Address.java)
**Table**: `addresses` | **Index**: user_id

| Field | Type | Constraints |
|---|---|---|
| user | User (ManyToOne) | NOT NULL, LAZY |
| fullName | String(100) | NOT NULL |
| phoneNumber | String(15) | NOT NULL |
| addressLine1 | String(255) | NOT NULL |
| addressLine2 | String(255) | Nullable |
| city | String(100) | NOT NULL |
| state | String(100) | NOT NULL |
| country | String(100) | NOT NULL |
| postalCode | String(10) | NOT NULL |
| defaultAddress | Boolean | Default: false |

**Business Purpose**: Customer shipping/billing addresses. Each user can have multiple addresses, one marked as default. Not referenced directly by Orders (Order snapshots address data).

---

## Product (entity/Product.java)
**Table**: `products` | **Indexes**: name, slug | **Unique**: slug

| Field | Type | Constraints |
|---|---|---|
| name | String(150) | NOT NULL |
| slug | String(180) | NOT NULL, UNIQUE |
| shortDescription | String(300) | Nullable |
| description | TEXT | Nullable |
| category | Category (ManyToOne) | NOT NULL, LAZY |
| material | String(100) | Nullable |
| careInstructions | String(500) | Nullable |
| featured | Boolean | Default: false |
| newArrival | Boolean | Default: false |
| active | Boolean | Default: true |

**Relationships**:
- `@ManyToOne` → Category (NOT NULL)
- `@OneToMany` → ProductVariant (cascade ALL, orphanRemoval)
- `@OneToMany` → ProductImage (cascade ALL, orphanRemoval)

**Business Purpose**: Catalog product with categorization, material info, and care instructions. Supports featured/new-arrival flags for homepage display.

---

## Category (entity/Category.java)
**Table**: `categories` | **Indexes**: name, slug

| Field | Type | Constraints |
|---|---|---|
| name | String(100) | NOT NULL |
| slug | String(100) | NOT NULL |
| shortDescription | String(300) | Nullable |
| description | TEXT | Nullable |
| imageUrl | String(500) | Nullable |
| parentCategory | Category (ManyToOne self) | Nullable (self-referencing) |
| active | Boolean | Default: true |
| displayOrder | Integer | Default: 1 |

**Relationships**:
- `@ManyToOne` (self) → parentCategory (nullable)
- `@OneToMany` → Product

**Business Purpose**: Hierarchical category system (parent-child). Used for navigation and product filtering.

---

## ProductVariant (entity/ProductVariant.java)
**Table**: `product_variants` | **Index**: sku | **Unique**: sku

| Field | Type | Constraints |
|---|---|---|
| product | Product (ManyToOne) | NOT NULL, LAZY |
| size | String(30) | NOT NULL |
| price | BigDecimal(10,2) | NOT NULL |
| discountPrice | BigDecimal(10,2) | Nullable |
| stock | Integer | NOT NULL |
| sku | String(100) | NOT NULL, UNIQUE |
| active | Boolean | Default: true |

**Relationships**:
- `@ManyToOne` → Product (NOT NULL)
- `@OneToMany` → CartItem
- `@OneToMany` → WishlistItem
- `@OneToMany` → OrderItem

**Business Purpose**: Size-based variants within a product. Each variant has its own price, discount, stock, and SKU. Cart, Wishlist, and Orders reference variants, not products directly.

---

## ProductImage (entity/ProductImage.java)
**Table**: `product_images` | **Index**: product_id

| Field | Type | Constraints |
|---|---|---|
| product | Product (ManyToOne) | NOT NULL, LAZY |
| imageUrl | String(500) | NOT NULL |
| publicId | String(255) | Nullable (Cloudinary) |
| altText | String(255) | Nullable |
| displayOrder | Integer | Default: 1 |
| thumbnail | Boolean | Default: false |
| active | Boolean | Default: true |

**Business Purpose**: Gallery images for products. One image can be the thumbnail. Images stored on Cloudinary with public_id for management.

---

## Cart (entity/Cart.java)
**Table**: `carts` | **Index**: user_id | **Unique**: user_id

| Field | Type |
|---|---|
| user | User (OneToOne) - NOT NULL |
| cartItems | List<CartItem> (OneToMany, cascade ALL, orphanRemoval) |

**Business Purpose**: One cart per user. Contains multiple CartItems.

---

## CartItem (entity/CartItem.java)
**Table**: `cart_items` | **Indexes**: cart_id, product_variant_id | **Unique**: (cart_id, product_variant_id)

| Field | Type | Constraints |
|---|---|---|
| cart | Cart (ManyToOne) | NOT NULL |
| productVariant | ProductVariant (ManyToOne) | NOT NULL |
| quantity | Integer | NOT NULL |
| price | BigDecimal(10,2) | NOT NULL (snapshot of variant price at add time) |

**Business Purpose**: Individual item in cart. Unique constraint prevents duplicate variants in same cart. Price is snapshot.

---

## Wishlist (entity/Wishlist.java)
**Table**: `wishlists` | **Index**: user_id | **Unique**: user_id

| Field | Type |
|---|---|
| user | User (OneToOne) - NOT NULL |
| wishlistItems | List<WishlistItem> (OneToMany, cascade ALL, orphanRemoval) |

---

## WishlistItem (entity/WishlistItem.java)
**Table**: `wishlist_items` | **Indexes**: wishlist_id, product_variant_id | **Unique**: (wishlist_id, product_variant_id)

| Field | Type |
|---|---|
| wishlist | Wishlist (ManyToOne) - NOT NULL |
| productVariant | ProductVariant (ManyToOne) - NOT NULL |

---

## Order (entity/Order.java)
**Table**: `orders` | **Indexes**: user_id, order_number | **Unique**: order_number

| Field | Type | Constraints |
|---|---|---|
| user | User (ManyToOne) | NOT NULL, LAZY |
| orderNumber | String(30) | NOT NULL, UNIQUE |
| orderStatus | OrderStatus (enum) | NOT NULL |
| paymentStatus | PaymentStatus (enum) | NOT NULL |
| subtotal | BigDecimal(10,2) | NOT NULL |
| discount | BigDecimal(10,2) | NOT NULL |
| shippingCharge | BigDecimal(10,2) | NOT NULL |
| totalAmount | BigDecimal(10,2) | NOT NULL |
| couponCode | String(100) | Nullable |
| customerName | String(100) | NOT NULL (snapshot) |
| customerPhone | String(15) | NOT NULL (snapshot) |
| customerEmail | String(100) | NOT NULL (snapshot) |
| addressLine1 | String | NOT NULL (snapshot) |
| addressLine2 | String | Nullable (snapshot) |
| city | String | NOT NULL (snapshot) |
| state | String | NOT NULL (snapshot) |
| country | String | NOT NULL (snapshot) |
| postalCode | String | NOT NULL (snapshot) |
| notes | String(500) | Nullable |

**Relationships**:
- `@ManyToOne` → User
- `@OneToMany` → OrderItem (cascade ALL, orphanRemoval)
- `@OneToOne` → Payment
- `@OneToOne` → CouponUsage

**Business Purpose**: Complete order record with snapshot of all customer/shipping data. Not linked to Address entity after creation.

---

## OrderItem (entity/OrderItem.java)
**Table**: `order_items` | **Indexes**: order_id, product_variant_id

| Field | Type | Notes |
|---|---|---|
| order | Order (ManyToOne) | NOT NULL |
| productVariant | ProductVariant (ManyToOne) | Nullable (optional ref) |
| productName | String(150) | NOT NULL (snapshot) |
| sku | String(100) | Nullable (snapshot) |
| size | String(30) | Nullable (snapshot) |
| productImage | String(500) | Nullable (snapshot) |
| price | BigDecimal(10,2) | NOT NULL (snapshot) |
| quantity | Integer | NOT NULL |
| totalPrice | BigDecimal(10,2) | NOT NULL |

**Business Purpose**: Snapshot of product variant at time of order. Allows product/variant deletion without breaking order history.

---

## Payment (entity/Payment.java)
**Table**: `payments` | **Indexes**: order_id, transaction_id, razorpay_payment_id | **Unique**: order_id

| Field | Type | Notes |
|---|---|---|
| order | Order (OneToOne) | NOT NULL |
| paymentMethod | PaymentMethod (enum) | NOT NULL |
| paymentStatus | PaymentStatus (enum) | NOT NULL |
| amount | BigDecimal(10,2) | NOT NULL |
| transactionId | String(150) | Nullable |
| razorpayOrderId | String(150) | Nullable |
| razorpayPaymentId | String(150) | Nullable |
| razorpaySignature | String(255) | Nullable |
| paidAt | Instant | Nullable |
| remarks | String(500) | Nullable |

---

## Refund (entity/Refund.java)
**Table**: `refunds` | **Indexes**: payment_id, order_id, razorpay_refund_id

| Field | Type |
|---|---|
| razorpayRefundId | String(100) |
| payment | Payment (ManyToOne) - NOT NULL |
| order | Order (ManyToOne) - NOT NULL |
| amount | Integer (in paise) |
| status | RefundStatus (enum) - PROCESSED/FAILED |
| reason | String(500) |
| createdAt | Instant |

---

## Coupon (entity/Coupon.java)
**Table**: `coupons` | **Index**: code | **Unique**: code

| Field | Type | Notes |
|---|---|---|
| code | String(50) | NOT NULL, UNIQUE |
| description | String(255) | Nullable |
| discountType | DiscountType (enum) | PERCENTAGE/FLAT |
| discountValue | BigDecimal(10,2) | NOT NULL |
| minimumOrderAmount | BigDecimal(10,2) | Nullable |
| maximumDiscountAmount | BigDecimal(10,2) | Nullable (for PERCENTAGE) |
| usageLimit | Integer | NOT NULL (global) |
| usedCount | Integer | Default: 0 |
| perUserLimit | Integer | NOT NULL |
| validFrom | LocalDateTime | NOT NULL |
| validUntil | LocalDateTime | NOT NULL |
| active | Boolean | Default: true |

---

## CouponUsage (entity/CouponUsage.java)
**Table**: `coupon_usages` | **Unique**: order_id

| Field | Type |
|---|---|
| coupon | Coupon (ManyToOne) - NOT NULL |
| user | User (ManyToOne) - NOT NULL |
| order | Order (OneToOne) - NOT NULL |

---

## Review (entity/Review.java)
**Table**: `reviews`

| Field | Type | Notes |
|---|---|---|
| user | User (ManyToOne) | NOT NULL |
| product | Product (ManyToOne) | NOT NULL |
| rating | Integer | NOT NULL (1-5) |
| comment | String(1000) | Nullable |
| status | ReviewStatus | APPROVED/PENDING/REJECTED |

---

## Banner (entity/Banner.java)
**Table**: `banners`

| Field | Type |
|---|---|
| title | String(200) - NOT NULL |
| subtitle | String(500) |
| imageUrl | String(500) - NOT NULL |
| publicId | String(255) - Cloudinary |
| redirectUrl | String(500) |
| active | Boolean - Default: true |
| displayOrder | Integer - Default: 0 |

---

## ContactMessage (entity/ContactMessage.java)
**Table**: `contact_messages`

| Field | Type |
|---|---|
| name | String(100) - NOT NULL |
| email | String(100) - NOT NULL |
| phone | String(15) - NOT NULL |
| subject | String(100) - NOT NULL |
| message | String(1000) - NOT NULL |
| resolved | Boolean - Default: false |
| reply | String(2000) |
| replied | Boolean - Default: false |

---

## Notification (entity/Notification.java)
**Table**: `notifications`

| Field | Type | Notes |
|---|---|---|
| user | User (ManyToOne) | Nullable (null = global) |
| title | String(150) | NOT NULL |
| message | String(500) | NOT NULL |
| type | NotificationType | ORDER/PAYMENT/COUPON/SYSTEM/PROMOTION |
| isRead | Boolean | Default: false |

---

## EmailVerificationToken (entity/EmailVerificationToken.java)
**Table**: `email_verification_tokens` | **Unique**: token

| Field | Type |
|---|---|
| token | String - NOT NULL, UNIQUE |
| user | User (OneToOne) - NOT NULL |
| expiryDate | LocalDateTime - NOT NULL |
| isExpired() | Method - checks if now > expiryDate |

---

## PasswordResetToken (entity/PasswordResetToken.java)
**Table**: `password_reset_tokens` | **Unique**: token

| Field | Type |
|---|---|
| token | String - NOT NULL, UNIQUE |
| user | User (ManyToOne) - NOT NULL |
| expiryDate | LocalDateTime - NOT NULL |
| used | boolean |
| isExpired() | Method - checks if now > expiryDate |

---

## RazorpayWebhookEvent (entity/RazorpayWebhookEvent.java)
**Table**: `razorpay_webhook_events` | **Index**: event_id | **Unique**: event_id

| Field | Type |
|---|---|
| eventId | String(100) - NOT NULL, UNIQUE |
| eventType | String(50) - NOT NULL |
| processedAt | Instant |

