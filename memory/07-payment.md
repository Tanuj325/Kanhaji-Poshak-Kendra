# PAYMENT FLOW - Complete Analysis

## Razorpay Integration

### Configuration (`config/RazorpayConfig.java`)
- Creates `RazorpayClient` bean using API key and secret from properties
- API Key/Secret loaded from `razorpay.api.key` and `razorpay.api.secret`

### Services
- `RazorpayService` (interface) + `RazorpayServiceImpl` (implementation)
- `PaymentService` (interface) + `PaymentServiceImpl` (implementation)

## Payment Flow (Razorpay)

### Step 1: Place Order (COD / Pending)
```
POST /api/orders
Body: { shippingAddressId, couponCode, paymentMethod, orderNotes }
→ Creates Order with PENDING payment status
→ Returns OrderResponse
```

### Step 2: Create Razorpay Order (for Online Payment)
```
POST /api/orders/razorpay
Body: { shippingAddressId, couponCode, paymentMethod, orderNotes }
→ Service creates pending Order (unsaved)
→ Calculates amount (totalAmount * 100 for paise)
→ RazorpayService.createOrder() → Razorpay API
→ Returns { id (razorpay_order_id), currency, amount, key (api key) }
```

Alternatively (if order already exists):
```
POST /api/payments/razorpay/order/{orderId}
→ Verifies order belongs to user
→ PaymentService.createRazorpayOrder(orderId)
→ Returns RazorpayOrderResponse
```

### Step 3: Frontend Razorpay Checkout
- Client receives `razorpay_order_id` and `key`
- Opens Razorpay checkout SDK with these details
- User completes payment on Razorpay UI
- Razorpay calls back with `razorpay_payment_id` and `razorpay_signature`

### Step 4: Verify Payment
```
POST /api/payments/razorpay/verify?razorpayOrderId=xxx&razorpayPaymentId=yyy&razorpaySignature=zzz
→ PaymentService.verifyRazorpayPayment()
→ Verifies HMAC signature using Razorpay secret
→ Updates Payment entity with razorpay_payment_id and razorpay_signature
→ Sets PaymentStatus = PAID
→ Updates Order.paymentStatus = PAID
→ Returns PaymentResponse
```

### Step 5: Initiate Payment (Alternative)
```
POST /api/payments/initiate
Body: { orderId, paymentMethod }
→ Creates Payment entity linked to Order
→ Returns PaymentResponse with PENDING status
```

## Webhook Flow

### Endpoint
```
POST /api/payment/webhook/razorpay
Header: X-Razorpay-Signature
Body: Raw JSON payload from Razorpay
```

### Processing
1. Read request body as string
2. Verify webhook signature via `razorpayService.verifyWebhookSignature(payload, signature)`
3. Parse JSON for `event.id` and `event.event`
4. Check idempotency via `RazorpayWebhookEvent` (unique event_id)
5. Process via `paymentService.processWebhookEvent(eventId, eventType, payload)`
6. Return 200 on success, 500 on error (triggers Razorpay retry)

### Webhook Events Handled
- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `order.paid` - Order marked as paid

## Refund Flow

### Endpoint
```
PaymentController initiates refund → PaymentService → Razorpay API
```

### RefundRequest
```json
{ "paymentId": 1, "amount": 500, "reason": "Customer returned item" }
```

### RefundResponse
```json
{ "id": 1, "razorpayRefundId": "rfnd_xxx", "amount": 500, "currency": "INR", "status": "PROCESSED", "reason": "...", "paymentId": 1, "orderId": 1 }
```

### Refund Entity
Tracks refunds with `razorpayRefundId`, amount (in paise), status (PROCESSED/FAILED), and reason.

## Database Entities

### Payment
One-to-One with Order. Stores all Razorpay transaction details.

### Refund
Many-to-One with Payment. Tracks individual refund attempts.

### RazorpayWebhookEvent
Tracks processed webhooks for idempotency. Keyed by unique `event_id` from Razorpay.

## Business Rules
1. One payment per order (OneToOne)
2. Payment verification uses HMAC SHA256 signature with Razorpay secret
3. Webhook processing is idempotent (ignores duplicate events)
4. COD orders skip Razorpay flow but still create Payment entity
5. Refunds update PaymentStatus to REFUNDED or PARTIALLY_REFUNDED
6. Frontend needs Razorpay API key for checkout SDK initialization

## Error Handling
- `RazorpayException`: Wraps `com.razorpay.RazorpayException` for Razorpay API failures
- `PaymentProcessingException`: For payment processing failures
- Invalid signatures return 400 Bad Request
- Unprocessable webhook payloads return 500 (for retry)
