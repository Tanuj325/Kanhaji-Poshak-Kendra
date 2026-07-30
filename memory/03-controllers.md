# CONTROLLERS - Complete Analysis

## 1. AuthController
**Base URL**: `/api/auth`
**Authentication**: PUBLIC (no JWT required)
**Swagger Tag**: "Authentication"

| Endpoint | Method | Auth | Description | Request | Response | Errors |
|---|---|---|---|---|---|---|
| `/api/auth/register` | POST | Public | Register new user | `RegisterRequest` (validated) | `AuthResponse` (201) | 400 invalid, 409 duplicate |
| `/api/auth/login` | POST | Public | Login | `LoginRequest` (validated) | `AuthResponse` (200) | 401 invalid creds |
| `/api/auth/refresh-token` | POST | Public | Refresh access token | `RefreshTokenRequest` | `AuthResponse` (200) | 400/401 |
| `/api/auth/logout/{userId}` | POST | Public | Logout user | Path variable userId | 204 No Content | 404 |
| `/api/auth/verify-email` | GET | Public | Verify email | QueryParam: token | String (200/400) | 400 invalid/expired |
| `/api/auth/forgot-password` | POST | Public | Request password reset | `ForgotPasswordRequest` | String (200 - always) | N/A (silent on failure) |
| `/api/auth/reset-password` | POST | Public | Reset password | `ResetPasswordRequest` | String (200/400) | 400 invalid/expired |

---

## 2. UserController
**Base URL**: `/api/users`
**Authentication**: JWT Required
**Swagger Tag**: "Users"

| Endpoint | Method | Auth | Role | Description |
|---|---|---|---|---|
| `/api/users/me` | GET | JWT | Any | Get current user profile |
| `/api/users/{userId}` | GET | JWT | OWNER/ADMIN | Get user by ID |
| `/api/users/{userId}` | PUT | JWT | OWNER/ADMIN | Update profile (multipart) |
| `/api/users/{userId}/status` | PATCH | JWT | ADMIN | Toggle user status |
| `/api/users/{userId}` | DELETE | JWT | OWNER/ADMIN | Delete user |
| `/api/users` | GET | JWT | ADMIN | Get all users |

**Ownership**: `@PreAuthorize("#userId == principal.userId or hasRole('ADMIN')")`

---

## 3. AddressController
**Base URL**: `/api/addresses`
**Authentication**: JWT Required (manual userId extraction)
**Swagger Tag**: "Addresses"

| Endpoint | Method | Description |
|---|---|---|
| `/api/addresses` | GET | Get all addresses for user |
| `/api/addresses/{addressId}` | GET | Get address by ID |
| `/api/addresses` | POST | Add new address |
| `/api/addresses/{addressId}` | PUT | Update address |
| `/api/addresses/{addressId}` | DELETE | Delete address |
| `/api/addresses/{addressId}/set-default` | PUT | Set address as default |

---

## 4. ProductController
**Base URL**: `/api/products`
**Authentication**: Public GET, Admin for write operations
**Swagger Tag**: "Products"

### Public Endpoints:
| Endpoint | Method | Description | Query Params |
|---|---|---|---|
| `/api/products` | GET | Get all products (paginated) | categoryId, search, featured, active, minPrice, maxPrice, inStock, sort, page, size |
| `/api/products/{id}` | GET | Get product by ID | - |
| `/api/products/slug/{slug}` | GET | Get product by slug | - |
| `/api/products/featured` | GET | Get featured products | - |
| `/api/products/new-arrivals` | GET | Get new arrivals | - |

### Admin Endpoints (`@PreAuthorize("hasRole('ADMIN')")`):
| Endpoint | Method | Description |
|---|---|---|
| `/api/products/admin` | GET | Get all products for admin (with full details) |
| `/api/products/admin` | POST | Create product |
| `/api/products/admin/{id}` | PUT | Update product |
| `/api/products/admin/{id}` | DELETE | Delete product |
| `/api/products/admin/{id}/toggle-status` | PATCH | Toggle active status |

---

## 5. CategoryController
**Base URL**: `/api/categories`
**Authentication**: Public GET, Admin for write operations
**Swagger Tag**: "Categories"

### Public Endpoints:
| Endpoint | Method | Description |
|---|---|---|
| `/api/categories` | GET | Get all categories (paginated, filterable) |
| `/api/categories/dropdown` | GET | Get category dropdown (id, name, slug) |
| `/api/categories/root` | GET | Get root categories (no parent) |
| `/api/categories/{parentId}/subcategories` | GET | Get subcategories |
| `/api/categories/{id}` | GET | Get category by ID |
| `/api/categories/slug/{slug}` | GET | Get category by slug |

### Admin Endpoints:
| Endpoint | Method | Description |
|---|---|---|
| `/api/categories` | POST | Create category |
| `/api/categories/{id}` | PUT | Update category |
| `/api/categories/{id}` | DELETE | Delete category |
| `/api/categories/{id}/toggle-status` | PATCH | Toggle active status |

---

## 6. BannerController
**Base URL**: `/api/banners`
**Swagger Tag**: "Banners"

### Public:
| Endpoint | Method | Description |
|---|---|---|
| `/api/banners` | GET | Get active banners |

### Admin:
| Endpoint | Method | Description | Content Type |
|---|---|---|---|
| `/api/banners/all` | GET | Get all banners (paginated) | - |
| `/api/banners` | POST | Create banner | multipart/form-data |
| `/api/banners/{id}` | PUT | Update banner | multipart/form-data |
| `/api/banners/{id}` | DELETE | Delete banner | - |
| `/api/banners/{id}/toggle-status` | PATCH | Toggle status | - |

---

## 7. CartController
**Base URL**: `/api/cart`
**Authentication**: JWT (manual userId extraction)
**Swagger Tag**: "Cart"

| Endpoint | Method | Description |
|---|---|---|
| `/api/cart` | GET | Get user's cart |
| `/api/cart/items` | POST | Add item to cart (`AddToCartRequest`) |
| `/api/cart/items/{cartItemId}` | PUT | Update cart item quantity (`UpdateCartRequest`) |
| `/api/cart/items/{cartItemId}` | DELETE | Remove item from cart |
| `/api/cart` | DELETE | Clear cart |

---

## 8. WishlistController
**Base URL**: `/api/wishlist`
**Authentication**: JWT (manual userId extraction)
**Swagger Tag**: "Wishlist"

| Endpoint | Method | Description |
|---|---|---|
| `/api/wishlist` | GET | Get user's wishlist |
| `/api/wishlist` | POST | Add item to wishlist (`WishlistRequest`) |
| `/api/wishlist/{productVariantId}` | DELETE | Remove item from wishlist |
| `/api/wishlist/{productVariantId}/check` | GET | Check if variant is in wishlist |

---

## 9. OrderController
**Base URL**: `/api/orders`
**Authentication**: JWT (manual userId extraction)
**Swagger Tag**: "Orders"

### Customer Endpoints:
| Endpoint | Method | Description |
|---|---|---|
| `/api/orders` | POST | Place order (`PlaceOrderRequest`) |
| `/api/orders/razorpay` | POST | Create Razorpay order from cart (`PlaceOrderRequest`) |
| `/api/orders/{orderId}` | GET | Get order by ID |
| `/api/orders/number/{orderNumber}` | GET | Get order by order number |
| `/api/orders` | GET | Get user's orders (paginated, filterable) |
| `/api/orders/{orderId}/cancel` | POST | Cancel order |

### Admin Endpoints (`@PreAuthorize("hasRole('ADMIN')")`):
| Endpoint | Method | Description |
|---|---|---|
| `/api/orders/admin` | GET | Get all orders (paginated, filterable) |
| `/api/orders/admin/{orderId}/status` | PUT | Update order status |

---

## 10. PaymentController
**Base URL**: `/api/payments`
**Authentication**: JWT (manual userId extraction)
**Swagger Tag**: "Payments"

| Endpoint | Method | Description |
|---|---|---|
| `/api/payments/razorpay/order/{orderId}` | POST | Create Razorpay order for existing order |
| `/api/payments/initiate` | POST | Initiate payment (`PaymentRequest`) |
| `/api/payments/razorpay/verify` | POST | Verify Razorpay payment (query params) |
| `/api/payments/order/{orderId}` | GET | Get payment by order ID |
| `/api/payments/{paymentId}` | GET | Get payment by ID |
| `/api/payments/{paymentId}` | PUT | Update payment status |

---

## 11. RazorpayWebhookController
**Base URL**: `/api/payment/webhook`
**Authentication**: PUBLIC
**Swagger Tag**: "Webhooks"

| Endpoint | Method | Description |
|---|---|---|
| `/api/payment/webhook/razorpay` | POST | Handle Razorpay webhook events |

**Flow**: Reads request body → verifies signature via `X-Razorpay-Signature` header → parses JSON for event id/type → processes via `paymentService.processWebhookEvent()`.

---

## 12. ReviewController
**Base URL**: `/api/reviews`
**Swagger Tag**: "Reviews"

### Public Endpoints:
| Endpoint | Method | Description |
|---|---|---|
| `/api/reviews/product/{productId}` | GET | Get reviews for product (paginated) |
| `/api/reviews/product/{productId}/average-rating` | GET | Get average rating |

### Authenticated Endpoints:
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/reviews` | POST | JWT | Add review (`ReviewRequest`) |
| `/api/reviews/{reviewId}` | PUT | JWT | Update review (owner only) |
| `/api/reviews/{reviewId}` | DELETE | JWT | Delete review (owner only) |

---

## 13. ProductImageController
**Base URL**: `/api/products/{productId}/images`
**Authentication**: Admin for write, public for read
**Swagger Tag**: "Product Images"

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/products/{productId}/images` | GET | Public | Get all images for product |
| `/api/products/{productId}/images` | POST | ADMIN | Add image (multipart) |
| `/api/products/{productId}/images/{imageId}` | PUT | ADMIN | Update image (multipart) |
| `/api/products/{productId}/images/{imageId}` | DELETE | ADMIN | Delete image |
| `/api/products/{productId}/images/{imageId}/thumbnail` | POST | ADMIN | Set image as thumbnail |

---

## 14. ProductVariantController
**Base URL**: `/api/products/{productId}/variants`
**Swagger Tag**: "Product Variants"

### Public:
| Endpoint | Method | Description |
|---|---|---|
| `/api/products/{productId}/variants` | GET | Get all variants for product |
| `/api/products/{productId}/variants/{variantId}` | GET | Get variant by ID |

### Admin:
| Endpoint | Method | Description |
|---|---|---|
| `/api/products/{productId}/variants` | POST | Add variant |
| `/api/products/{productId}/variants/{variantId}` | PUT | Update variant |
| `/api/products/{productId}/variants/{variantId}` | DELETE | Delete variant |
| `/api/products/{productId}/variants/{variantId}/toggle-status` | PATCH | Toggle active status |
| `/api/products/{productId}/variants/{variantId}/stock` | PATCH | Update stock |

---

## 15. CouponController
**Base URL**: `/api/coupons`
**Authentication**: JWT
**Swagger Tag**: "Coupons"

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/coupons` | GET | ADMIN | Get all coupons (paginated) |
| `/api/coupons/active` | GET | CUSTOMER | Get active coupons |
| `/api/coupons/{id}` | GET | CUSTOMER | Get coupon by ID |
| `/api/coupons/code/{code}` | GET | CUSTOMER | Get coupon by code |
| `/api/coupons/{id}` | DELETE | ADMIN | Delete coupon |
| `/api/coupons/{id}/toggle-status` | PATCH | ADMIN | Toggle coupon status |
| `/api/coupons/validate` | POST | CUSTOMER | Validate coupon with order amount |

---

## 16. ContactMessageController
**Base URL**: `/api/contact`
**Swagger Tag**: "Contact"

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/contact` | POST | PUBLIC | Submit contact message |
| `/api/contact` | GET | ADMIN | Get all messages |
| `/api/contact/unresolved` | GET | ADMIN | Get unresolved messages |
| `/api/contact/{id}/resolve` | PUT | ADMIN | Mark message as resolved |
| `/api/contact/{id}` | DELETE | ADMIN | Delete message |
| `/api/contact/{id}/reply` | POST | ADMIN | Add reply (sends email) |

---

## 17. NotificationController
**Base URL**: `/api/notifications`
**Authentication**: JWT
**Swagger Tag**: "Notifications"

| Endpoint | Method | Description |
|---|---|---|
| `/api/notifications` | GET | Get notifications (paginated, filterable) |
| `/api/notifications/unread` | GET | Get unread notifications |
| `/api/notifications/unread/count` | GET | Get unread count |
| `/api/notifications/{notificationId}` | PUT | Mark as read/unread |
| `/api/notifications/mark-all-as-read` | PUT | Mark all as read |
| `/api/notifications/{notificationId}` | DELETE | Delete notification |

---

## 18. AdminProductAnalyticsController
**Base URL**: `/api/admin/analytics/products`
**Authentication**: JWT, ADMIN role
**Swagger Tag**: "Analytics"

| Endpoint | Description |
|---|---|
| `/api/admin/analytics/products/top-selling` | Top selling products |
| `/api/admin/analytics/products/top-rated` | Top rated products |
| `/api/admin/analytics/products/most-reviewed` | Most reviewed products |
| `/api/admin/analytics/products/most-wishlisted` | Most wishlisted products |
| `/api/admin/analytics/products/low-stock` | Low stock products |
| `/api/admin/analytics/products/out-of-stock` | Out of stock products |
| `/api/admin/analytics/categories/top-selling` | Top selling categories |

---

## 19. AdminSalesAnalyticsController
**Base URL**: `/api/admin/analytics/sales`
**Authentication**: JWT, ADMIN role
**Swagger Tag**: "Analytics"

| Endpoint | Description |
|---|---|
| `/api/admin/analytics/sales/daily` | Daily sales data |
| `/api/admin/analytics/sales/weekly` | Weekly sales data |
| `/api/admin/analytics/sales/monthly` | Monthly sales data |
| `/api/admin/analytics/sales/yearly` | Yearly sales data |
| `/api/admin/analytics/sales/custom` | Custom date range sales data |

---

## 20. AdminCustomerAnalyticsController
**Base URL**: `/api/admin/analytics/customers`
**Authentication**: JWT, ADMIN role
**Swagger Tag**: "Analytics"

| Endpoint | Description |
|---|---|
| `/api/admin/analytics/customers/overview` | Customer overview stats |
| `/api/admin/analytics/customers/new` | New users (last 7 days) |
| `/api/admin/analytics/customers/repeat` | Repeat customers (>1 order) |
| `/api/admin/analytics/customers/inactive` | Inactive users (no orders in 30 days) |
| `/api/admin/analytics/customers/recent` | Recent users |
| `/api/admin/analytics/customers/top-spenders` | Top spending customers |

---

## 21. RecentActivityAdminController
**Base URL**: `/api/admin/analytics/activity`
**Authentication**: JWT, ADMIN role
**Swagger Tag**: "Analytics"

| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/analytics/activity` | GET | Get recent activities (paginated, filterable by type) |

