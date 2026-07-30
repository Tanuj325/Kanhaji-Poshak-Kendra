# OVERALL BUSINESS FLOW & ARCHITECTURE

## Platform: Krishana Poshak (Traditional Wear E-Commerce)

A full-featured e-commerce platform for traditional Indian clothing with dual-role (CUSTOMER/ADMIN) support.

---

## Entity Relationship Summary

```
                    ┌─────────────┐
                    │   CATEGORY  │◄─── self (parent)
                    └──────┬──────┘
                           │ one-to-many
                           ▼
                    ┌─────────────┐     ┌──────────────────┐
                    │   PRODUCT   │◄────│     REVIEW       │
                    └──────┬──────┘     │ (user, product,  │
                           │            │  rating 1-5)     │
              ┌────────────┼────────────┴──────────────────┘
              │            │
              ▼            ▼
     ┌────────────┐  ┌────────────┐
     │  VARIANT   │  │   IMAGE    │
     │ (size,sku, │  │ (url,      │
     │  price,    │  │  thumbnail)│
     │  stock)    │  └────────────┘
     └──────┬─────┘
            │
     ┌──────┼──────────────────────────┐
     │      │                          │
     ▼      ▼                          ▼
 ┌──────────┐  ┌──────────┐  ┌──────────────────┐
 │ CART_ITEM│  │WISHLIST  │  │   ORDER_ITEM     │
 │          │  │  _ITEM   │  │  (snapshot: name, │
 │(qty,price│  │          │  │   price, qty,     │
 │snapshot) │  │          │  │   image, size)    │
 └─────┬────┘  └─────┬────┘  └────────┬─────────┘
       │             │                │
       ▼             ▼                ▼
   ┌────────┐   ┌────────┐     ┌──────────┐
   │  CART  │   │WISHLIST│     │  ORDER   │
   │(1/user)│   │(1/user)│     │(number,  │
   └────────┘   └────────┘     │ status,  │
                               │ address  │
                               │ snapshot)│
                               └─────┬────┘
                                     │
                               ┌─────┴────┐
                               │  PAYMENT │
                               │(razorpay)│
                               └─────┬────┘
                                     │
                               ┌─────┴────┐
                               │  REFUND  │
                               └──────────┘

  ┌──────────┐    ┌──────────────┐
  │   USER   │    │    COUPON    │
  │(email,   │    │(code, type,  │
  │ phone,   │    │ value,       │
  │ password)│    │ limits,      │
  └────┬─────┘    │ validity)    │
       │          └──────┬───────┘
       │                 │
       ▼                 ▼
  ┌────────────┐   ┌──────────────┐
  │  ADDRESS   │   │ COUPON_USAGE │
  │(shipping)  │   │(user,coupon, │
  └────────────┘   │ order)       │
                   └──────────────┘

  ┌─────────────────────┐
  │    NOTIFICATION     │
  │(user nullable=global│
  └─────────────────────┘

  ┌─────────────────────┐
  │  CONTACT_MESSAGE    │
  │(public inquiry)     │
  └─────────────────────┘

  ┌─────────────────────┐
  │      BANNER         │
  │(homepage slider)    │
  └─────────────────────┘

  ┌─────────────────────────────┐
  │ EMAIL_VERIFICATION_TOKEN   │
  │ PASSWORD_RESET_TOKEN       │
  │ RAZORPAY_WEBHOOK_EVENT     │
  └─────────────────────────────┘
```

---

## Customer Flow

### 1. Registration & Onboarding
```
Register → AuthService → Create User (BCrypt password) 
→ Create EmailVerificationToken → Send verification email
→ Return JWT tokens (access + refresh)
→ User verifies email via link (optional, allows immediate login)
```

### 2. Browse Products
```
Public GET /api/products (paginated, filterable)
Public GET /api/products/slug/{slug} (detail page)
Public GET /api/products/featured
Public GET /api/products/new-arrivals
Public GET /api/categories (filter by category)
Public GET /api/reviews/product/{id} (reviews and ratings)
```

### 3. Shopping Cart
```
Authenticated:
- POST /api/cart/items → Add variant to cart
- GET /api/cart → View cart (with calculated totals)
- PUT /api/cart/items/{id} → Update quantity
- DELETE /api/cart/items/{id} → Remove item
- DELETE /api/cart → Clear cart

Cart calculates: subtotal, discount (from applied coupon), shipping, grand total
```

### 4. Wishlist
```
Authenticated:
- POST /api/wishlist → Add variant
- GET /api/wishlist → View all
- DELETE /api/wishlist/{variantId} → Remove
- GET /api/wishlist/{variantId}/check → Check if in wishlist
```

### 5. Place Order
```
Authenticated:
1. Validate coupon via POST /api/coupons/validate (optional)
2. POST /api/orders → PlaceOrderRequest (shippingAddressId, couponCode, etc.)
   - Creates Order with PENDING status
   - Copies address snapshot from Address entity
   - Creates OrderItem snapshots from CartItem data
   - Clears the cart
   - Creates CouponUsage record if coupon applied
   - Decrements variant stock
   
3. If PAYMENT_METHOD = RAZORPAY:
   a. POST /api/orders/razorpay → Creates Razorpay order
   b. Client SDK handles payment
   c. POST /api/payments/razorpay/verify → Verify and finalize
   
4. If PAYMENT_METHOD = COD:
   - Order created with PENDING payment status
```

### 6. Track Orders
```
Authenticated:
- GET /api/orders → List orders (paginated, filterable by status)
- GET /api/orders/{id} → Order detail
- POST /api/orders/{id}/cancel → Cancel (if status allows)
```

### 7. Reviews
```
Authenticated:
- POST /api/reviews → Add review (PENDING status - admin approval)
- PUT /api/reviews/{id} → Update own review
- DELETE /api/reviews/{id} → Delete own review
```

### 8. Profile Management
```
Authenticated:
- GET /api/users/me → View profile
- PUT /api/users/{id} → Update profile (multipart for image)
- CRUD on addresses
- View notifications
```

---

## Admin Flow

### Dashboard
```
GET /api/users (all users)
GET /api/admin/analytics/customers/overview
GET /api/admin/analytics/sales/daily|weekly|monthly|yearly|custom
GET /api/admin/analytics/products/top-selling|top-rated|most-reviewed|most-wishlisted
GET /api/admin/analytics/products/low-stock|out-of-stock
GET /api/admin/analytics/categories/top-selling
GET /api/admin/analytics/activity
```

### Product Management
```
CRUD /api/products/admin/**
CRUD /api/products/{id}/variants/**
CRUD /api/products/{id}/images/**
```

### Order Management
```
GET /api/orders/admin → All orders
PUT /api/orders/admin/{id}/status → Update order status (fulfillment pipeline)
```

### Content Management
```
CRUD /api/categories/**
CRUD /api/banners/**
CRUD /api/coupons/**
```

### Customer Support
```
GET /api/contact → Messages
PUT /api/contact/{id}/resolve → Mark resolved
POST /api/contact/{id}/reply → Reply (sends email)
```

---

## Key Business Rules

### Order Lifecycle
```
PENDING → CONFIRMED → PACKING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
  ↘ CANCELLED (anytime before delivery)
                                                    DELIVERED → RETURNED
```

### Stock Management
- Adding to cart: checks stock availability
- Placing order: decrements variant stock
- Cancelling order: restores stock
- Low stock threshold: configurable (default: 10)

### Coupon Rules
- Usage limit (global): max times coupon can be used
- Per-user limit: max times a single user can use coupon
- Minimum order amount: coupon only applies above threshold
- Maximum discount: caps discount for PERCENTAGE type
- Validity period: validFrom to validUntil
- Expired/inactive coupons rejected
- Unique constraint: one coupon usage per order

### Review Moderation
- New reviews have PENDING status
- Admin must approve via database
- Approved reviews shown publicly
- Average rating calculated across all APPROVED reviews

### Address Snapshotting
- Address data is copied to Order at placement time
- Later changes to Address don't affect existing orders
- Both shipping and billing addresses can be specified

### Security
- JWT tokens with short-lived access (15min) and longer refresh (7 days)
- Ownership checks: manual userId extraction from token
- Admin routes protected by @PreAuthorize
- Public routes limited to read-only where appropriate
- Email enumeration prevented on forgot-password

### Payment
- Razorpay for online payments
- COD support planned
- Webhook-based async payment status updates
- Idempotent webhook processing
- HMAC signature verification for all Razorpay callbacks

---

## Configuration Properties Summary

| Category | Key | Default |
|---|---|---|
| Server | `server.port` | 9090 |
| DB | `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | - |
| JPA | `spring.jpa.hibernate.ddl-auto` | update |
| JWT | `jwt.access-token-expiration-ms` | 900000 (15min) |
| JWT | `jwt.refresh-token-expiration-ms` | 604800000 (7 days) |
| Razorpay | `razorpay.api.key`, `razorpay.api.secret` | - |
| Cloudinary | `cloudinary.*` | - |
| Mail | `spring.mail.*` | - |
| Email | `app.email.verification-token-expiry-minutes` | 60 |
| Email | `app.email.reset-token-expiry-minutes` | 30 |
| CORS | `app.frontend.allowed-origins` | http://localhost:3000 |

