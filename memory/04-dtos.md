# DTOS - Complete Analysis

## Common Response Wrappers

### ApiResponse<T> (`dto/common/ApiResponse.java`)
```java
class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
```
**Usage**: Standard wrapper for all API responses (though some controllers return data directly).

### PaginationResponse<T> (`dto/common/PaginationResponse.java`)
```java
class PaginationResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
}
```
**Usage**: Used consistently for paginated endpoints.

---

## Auth DTOs (`dto/auth/`)

### RegisterRequest
| Field | Type | Validation |
|---|---|---|
| firstName | String | @NotBlank |
| lastName | String | @NotBlank |
| email | String | @Email |
| phoneNumber | String | @NotBlank |
| password | String | @Size(min=8) |
| gender | Gender enum | Optional |
| dateOfBirth | LocalDate | Optional |

### LoginRequest
| Field | Type | Validation |
|---|---|---|
| email | String | @NotBlank |
| password | String | @NotBlank |

### AuthResponse
| Field | Type |
|---|---|
| accessToken | String |
| refreshToken | String |
| userId | Long |
| firstName | String |
| lastName | String |
| email | String |
| role | String |

### RefreshTokenRequest
| Field | Type |
|---|---|
| refreshToken | String |

### ForgotPasswordRequest
| Field | Type | Validation |
|---|---|---|
| email | String | @NotBlank, @Email |

### ResetPasswordRequest
| Field | Type | Validation |
|---|---|---|
| token | String | @NotBlank |
| password | String | @NotBlank |

---

## User DTOs (`dto/user/`)

### UpdateProfileRequest
| Field | Type | Notes |
|---|---|---|
| firstName | String | Optional |
| lastName | String | Optional |
| phoneNumber | String | Optional |
| gender | Gender | Optional |
| dateOfBirth | LocalDate | Optional |
| file | MultipartFile | Profile image upload |

### UserResponse
| Field | Type |
|---|---|
| id | Long |
| firstName, lastName | String |
| email | String |
| phoneNumber | String |
| gender | Gender |
| dateOfBirth | LocalDate |
| profileImageUrl | String |
| role | Role |
| enabled | boolean |
| emailVerified | boolean |

---

## Address DTOs (`dto/address/`)

### AddressRequest
| Field | Type | Validation |
|---|---|---|
| fullName | String | @NotBlank |
| phoneNumber | String | @NotBlank, @Pattern("^[6-9]\\d{9}$") |
| addressLine1 | String | @NotBlank |
| addressLine2 | String | Optional |
| city | String | @NotBlank |
| state | String | @NotBlank |
| country | String | @NotBlank |
| postalCode | String | @NotBlank |
| defaultAddress | boolean | Default: false |

### AddressResponse
Same fields minus validation. Includes `id` field.

---

## Product DTOs (`dto/product/`)

### ProductRequest
| Field | Type | Validation | Notes |
|---|---|---|---|
| name | String | @NotBlank | |
| slug | String | @NotBlank | URL-friendly |
| shortDescription | String | @NotBlank | |
| description | String | Optional | TEXT |
| categoryId | Long | @NotNull | |
| material | String | Optional | |
| careInstructions | String | Optional | |
| featured | boolean | Default: false | |
| newArrival | boolean | Default: false | |
| active | boolean | Default: true | |

### ProductResponse
| Field | Type |
|---|---|
| id | Long |
| name, slug | String |
| shortDescription, description | String |
| categoryId | Long |
| categoryName | String |
| material, careInstructions | String |
| featured, newArrival, active | boolean |
| variants | List<ProductVariantResponse> |
| images | List<ProductImageResponse> |

### ProductCardResponse (for public listing cards)
| Field | Type |
|---|---|
| id | Long |
| name, slug | String |
| imageUrl | String (thumbnail) |
| price | Double |
| discountPrice | Double |
| size | String |
| featured, newArrival | boolean |

### ProductDetailsResponse (for public detail page)
| Field | Type |
|---|---|
| id | Long |
| name, slug | String |
| shortDescription, description | String |
| category | String |
| material, careInstructions | String |
| variants | List<ProductVariantResponse> |
| images | List<ProductImageResponse> |

### ProductVariantRequest
| Field | Type | Validation |
|---|---|---|
| size | Size | @NotNull |
| price | Double | @NotNull |
| discountPrice | Double | Optional |
| stock | Integer | @NotNull |
| sku | String | Optional (auto?) |
| active | boolean | Default: true |

### ProductVariantResponse
| Field | Type |
|---|---|
| id | Long |
| size | Size (enum) |
| price, discountPrice | Double |
| stock | Integer |
| sku | String |
| active | boolean |

### ProductImageRequest
| Field | Type | Notes |
|---|---|---|
| file | MultipartFile | Upload file |
| altText | String | Optional |
| displayOrder | Integer | Optional |
| thumbnail | boolean | Default: false |
| active | boolean | Default: true |

### ProductImageResponse
| Field | Type |
|---|---|
| id | Long |
| imageUrl | String |
| altText | String |
| displayOrder | Integer |
| thumbnail | boolean |

---

## Category DTOs (`dto/category/`)

### CategoryRequest
| Field | Type | Validation |
|---|---|---|
| name | String | @NotBlank |
| slug | String | @NotBlank |
| description | String | Optional |
| imageUrl | String | Optional |
| parentCategoryId | Long | Optional |
| displayOrder | Integer | Optional |
| active | boolean | Default: true |

### CategoryResponse
| Field | Type |
|---|---|
| id | Long |
| name, slug | String |
| description | String |
| imageUrl | String |
| parentCategoryId | Long |
| parentCategoryName | String |
| displayOrder | Integer |
| active | boolean |

### CategoryDropdownResponse
| Field | Type |
|---|---|
| id | Long |
| name | String |
| slug | String |

---

## Cart DTOs (`dto/cart/`)

### AddToCartRequest
| Field | Type | Validation |
|---|---|---|
| productVariantId | Long | @NotNull |
| quantity | Integer | @NotNull, @Min(1) |

### UpdateCartRequest
| Field | Type | Validation |
|---|---|---|
| quantity | Integer | @NotNull |

### CartItemResponse
| Field | Type |
|---|---|
| cartItemId | Long |
| productId | Long |
| variantId | Long |
| productName | String |
| slug | String |
| imageUrl | String |
| size | String |
| price, discountPrice | Double |
| quantity | Integer |
| totalPrice | Double |
| stock | Integer |

### CartResponse
| Field | Type |
|---|---|
| items | List<CartItemResponse> |
| totalItems | Integer |
| subTotal | Double |
| discount | Double |
| shippingCharge | Double |
| grandTotal | Double |

---

## Order DTOs (`dto/order/`)

### PlaceOrderRequest
| Field | Type | Validation |
|---|---|---|
| shippingAddressId | Long | @NotNull |
| billingAddressId | Long | Optional |
| couponCode | String | Optional |
| paymentMethod | String | Optional |
| orderNotes | String | Optional |

### OrderItemResponse
| Field | Type |
|---|---|
| id | Long |
| productId | Long |
| variantId | Long |
| productName | String |
| imageUrl | String |
| size | String |
| price | Double |
| quantity | Integer |
| totalPrice | Double |

### OrderResponse
| Field | Type |
|---|---|
| id | Long |
| orderNumber | String |
| orderStatus | OrderStatus |
| paymentStatus | PaymentStatus |
| subTotal | Double |
| discount | Double |
| shippingCharge | Double |
| totalAmount | Double |
| orderDate | LocalDateTime |
| items | List<OrderItemResponse> |

### OrderSummaryResponse
| Field | Type |
|---|---|
| id | Long |
| orderNumber | String |
| totalAmount | Double |
| orderStatus | OrderStatus |
| orderDate | LocalDateTime |

---

## Payment DTOs (`dto/payment/`)

### CreateRazorpayOrderRequest
| Field | Type |
|---|---|
| amount | int (paise) |
| currency | String (e.g., INR) |
| receipt | String |
| notes | Map<String,String> |

### CreateRazorpayOrderResponse
| Field | Type |
|---|---|
| id | String (Razorpay order ID) |
| currency | String |
| amount | int |
| key | String (Razorpay API key for frontend) |

### RazorpayOrderResponse
| Field | Type |
|---|---|
| id | String |
| currency | String |
| amount | Integer |
| key | String |

### PaymentRequest
| Field | Type |
|---|---|
| orderId | Long |
| paymentMethod | String |

### PaymentResponse
| Field | Type |
|---|---|
| paymentId | Long |
| orderId | Long |
| transactionId | String |
| razorpayOrderId | String |
| razorpayPaymentId | String |
| paymentStatus | PaymentStatus |
| amount | Double |

### PaymentVerificationRequest
| Field | Type |
|---|---|
| razorpayOrderId | String |
| razorpayPaymentId | String |
| razorpaySignature | String |

### RefundRequest
| Field | Type |
|---|---|
| paymentId | Long |
| amount | Integer (INR) |
| reason | String |

### RefundResponse
| Field | Type |
|---|---|
| id | Long |
| razorpayRefundId | String |
| amount | Integer |
| currency | String |
| status | String |
| reason | String |
| paymentId | Long |
| orderId | Long |

---

## Coupon DTOs (`dto/coupon/`)

### ApplyCouponRequest
| Field | Type |
|---|---|
| couponCode | String |

### CouponResponse
| Field | Type |
|---|---|
| id | Long |
| code | String |
| description | String |
| discountValue | Double |
| minimumOrderAmount | Double |
| validFrom | LocalDate |
| validUntil | LocalDate |
| active | boolean |

### CouponValidationResponse
| Field | Type |
|---|---|
| valid | boolean |
| message | String |
| discount | Double |

---

## Review DTOs (`dto/review/`)

### ReviewRequest
| Field | Type | Validation |
|---|---|---|
| productId | Long | Optional |
| rating | Integer | @Min(1) @Max(5) |
| comment | String | @NotBlank |

### ReviewResponse
| Field | Type |
|---|---|
| id | Long |
| productId | Long |
| userId | Long |
| customerName | String |
| rating | Integer |
| comment | String |
| createdAt | LocalDateTime |

---

## Banner DTOs (`dto/banner/`)

### BannerRequest
| Field | Type | Validation |
|---|---|---|
| title | String | @NotBlank |
| subtitle | String | Optional |
| file | MultipartFile | Image upload |
| redirectUrl | String | Optional |
| displayOrder | Integer | Optional |
| active | boolean | Default: true |

### BannerResponse
| Field | Type |
|---|---|
| id | Long |
| title, subtitle | String |
| imageUrl | String |
| redirectUrl | String |
| displayOrder | Integer |
| active | boolean |

---

## Contact DTOs (`dto/contact/`)

### ContactRequest
| Field | Type | Validation |
|---|---|---|
| name | String | @NotBlank |
| email | String | @Email |
| phoneNumber | String | Optional |
| subject | String | @NotBlank |
| message | String | @NotBlank |

### ReplyRequest
| Field | Type | Validation |
|---|---|---|
| reply | String | @NotBlank, @Size(max=2000) |

### ContactResponse
| Field | Type |
|---|---|
| id | Long |
| name, email, phoneNumber | String |
| subject, message | String |
| resolved | boolean |
| createdAt | LocalDateTime |

---

## Notification DTOs (`dto/notification/`)

### MarkNotificationRequest
| Field | Type |
|---|---|
| read | boolean |

### NotificationResponse
| Field | Type |
|---|---|
| id | Long |
| title, message | String |
| read | boolean |
| createdAt | LocalDateTime |

---

## Wishlist DTOs (`dto/wishlist/`)

### WishlistRequest
| Field | Type | Validation |
|---|---|---|
| productId | Long | @NotNull |

### WishlistItemResponse
| Field | Type |
|---|---|
| id | Long |
| productName | String |
| slug | String |
| imageUrl | String |
| price, discountPrice | Double |
| featured, newArrival | boolean |

### WishlistResponse
| Field | Type |
|---|---|
| wishlistId | Long |
| productId | Long |
| productName | String |
| slug | String |
| imageUrl | String |
| price, discountPrice | Double |
| inStock | boolean |

---

## Admin / Analytics DTOs

### DashboardResponse
**27 fields** covering: totalUsers, activeUsers, totalProducts, activeProducts, outOfStockProducts, lowStockProducts, totalCategories, totalOrders, pendingOrders, confirmedOrders, shippedOrders, deliveredOrders, cancelledOrders, returnedOrders, totalRevenue, todayRevenue, monthlyRevenue, yearlyRevenue, averageOrderValue, totalReviews, averageRating, totalCoupons, activeCoupons, totalContactMessages, unreadContactMessages

### SalesDataDto
| Field | Type |
|---|---|
| label | String |
| revenue | Double |
| orders | Long |

### ProductAnalyticsDto
| Field | Type |
|---|---|
| id, name, imageUrl | String |
| unitsSold, reviewCount, wishlistCount, stock | Long |
| revenue, averageRating | Double |
| categoryName | String |

### ProductSalesDto, ProductRatingDto, ProductMostReviewedDto, ProductMostWishlistedDto, ProductStockAnalyticsDto
Various analytics response DTOs for product analytics graphs.

### CategoryAnalyticsDto
| Field | Type |
|---|---|
| id, name, slug | String/Varies |
| productsSold, quantitySold | Long |
| revenue | BigDecimal |

### CustomerOverviewDTO (record)
totalCustomers, activeCustomers, newCustomersToday/Week/Month, verified/unverified, with/without orders, repeatCustomers, averageOrdersPerCustomer, averageCustomerSpend

### UserSummaryDTO (record)
id, firstName, lastName, email, phoneNumber, createdAt, lastOrderDate, orderCount, totalSpent

### TopSpenderDTO (record)
id, firstName, lastName, email, totalOrders, totalSpent, lastOrderDate

### ActivityResponseDTO
| Field | Type |
|---|---|
| id | Long |
| type, description | String |
| createdAt | LocalDateTime |
| entityType, entityName | String |
| entityId | Long |

### OverviewResponseDTO (record)
totalUsers, activeUsers, verifiedCustomers, unverifiedCustomers, todayRegisteredUsers, thisWeekRegisteredUsers, thisMonthRegisteredUsers

