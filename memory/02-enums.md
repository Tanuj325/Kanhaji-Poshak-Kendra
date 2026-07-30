# ENUMS - Complete Analysis

## Role (`enums/Role.java`)
```
ADMIN, CUSTOMER
```
**Usage**: User entity. Used in JWT claims, `@PreAuthorize("hasRole('ADMIN')")` checks, and `UserPrincipal` authorities as `ROLE_ADMIN` / `ROLE_CUSTOMER`.

---

## OrderStatus (`enums/OrderStatus.java`)
```
PENDING → CONFIRMED → PACKING → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
                              ↘ CANCELLED
                                              DELIVERED → RETURNED
```
**Usage**: Order entity lifecycle. Represents the complete order fulfillment pipeline.

---

## PaymentStatus (`enums/PaymentStatus.java`)
```
PENDING, PAID, FAILED, REFUNDED, PARTIALLY_REFUNDED
```
**Usage**: Payment entity and Order.paymentStatus. Tracks payment lifecycle from initiation to potential refunds.

---

## PaymentMethod (`enums/PaymentMethod.java`)
```
COD, RAZORPAY, UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, WALLET
```
**Usage**: Payment entity. Specifies how the customer paid. Currently Razorpay is fully integrated; COD and others may be planned.

---

## DiscountType (`enums/DiscountType.java`)
```
PERCENTAGE, FLAT
```
**Usage**: Coupon entity. Determines whether discount is percentage-based or fixed amount.

---

## Gender (`enums/Gender.java`)
```
MALE, FEMALE, KIDS, UNISEX
```
**Usage**: User entity. Customer's gender for personalization and analytics.

---

## Size (`enums/Size.java`)
```
SIZE_0 through SIZE_12, CUSTOM
```
- Has custom JSON serialization: `@JsonValue` returns the string value (e.g., "0", "1"), `@JsonCreator` parses from string
- **Usage**: ProductVariant entity (stored as String column, not enum in DB). Used for traditional wear sizing (e.g., Kurtas, Sherwanis).

---

## ReviewStatus (`enums/ReviewStatus.java`)
```
APPROVED, PENDING, REJECTED
```
**Usage**: Review entity. Moderated review system where admin must approve reviews before public display.

---

## NotificationType (`enums/NotificationType.java`)
```
ORDER, PAYMENT, COUPON, SYSTEM, PROMOTION
```
**Usage**: Notification entity. Categorizes notifications for filtering and display purposes.

---

## RefundStatus (`enums/RefundStatus.java`)
```
PROCESSED, FAILED
```
**Usage**: Refund entity. Tracks whether a Razorpay refund was successfully processed or failed.

