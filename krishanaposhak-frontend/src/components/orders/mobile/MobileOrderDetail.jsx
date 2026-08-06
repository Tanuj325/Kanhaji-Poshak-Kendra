import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiPrinter,
  FiXCircle,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiShoppingBag,
  FiStar,
  FiCheckCircle,
  FiRefreshCw,
  FiFileText,
  FiCheck,
  FiTruck,
  FiClock,
  FiPackage,
  FiNavigation,
  FiHelpCircle,
  FiShare2,
} from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { siteConfig } from '@/config/siteConfig';

// Status badge styling helper
const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'PROCESSING':
    case 'PACKING':
    case 'PACKED':
    case 'CONFIRMED':
      return 'bg-sky-50 text-sky-700 border-sky-200/80';
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return 'bg-purple-50 text-purple-700 border-purple-200/80';
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    case 'PENDING':
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
  }
};

const timelineSteps = [
  { status: 'PENDING', label: 'Order Placed', description: 'Order received & confirmed', icon: FiClock },
  { status: 'CONFIRMED', label: 'Confirmed', description: 'Verified by atelier', icon: FiCheckCircle },
  { status: 'PACKING', label: 'Processing', description: 'Crafting & luxury packaging', icon: FiPackage },
  { status: 'SHIPPED', label: 'Dispatched', description: 'Handed to express courier', icon: FiTruck },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'On the way to your door', icon: FiNavigation },
  { status: 'DELIVERED', label: 'Delivered', description: 'Sacred attire received', icon: FiCheck },
];

const statusIndexMap = {
  PENDING: 0,
  CONFIRMED: 1,
  PACKING: 2,
  PROCESSING: 2,
  PACKED: 2,
  SHIPPED: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
  CANCELLED: -1,
  RETURNED: -2,
};

/**
 * Modern Mobile & Tablet Timeline Component
 */
const MobileOrderTimeline = memo(function MobileOrderTimeline({
  currentStatus,
  orderDate,
  deliveredDate,
  cancelledAt,
}) {
  const currentIdx = statusIndexMap[currentStatus] ?? 0;
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 flex items-center gap-3.5 text-rose-800">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
          <FiXCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-display font-bold text-sm text-rose-900">Order Cancelled</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            {cancelledAt ? formatDate(cancelledAt, { format: 'datetime' }) : 'This order has been cancelled.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
      {/* Progress Overlay Line */}
      <div
        className="absolute left-[13px] top-2 w-[2px] bg-gradient-to-b from-amber-600 via-amber-500 to-emerald-600 transition-all duration-700"
        style={{
          height: `${Math.min(100, Math.max(0, (currentIdx / (timelineSteps.length - 1)) * 100))}%`,
        }}
      />

      {timelineSteps.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const Icon = step.icon;

        return (
          <div key={step.status} className="relative flex items-start gap-3.5 group">
            {/* Step Icon Indicator Circle */}
            <span
              className={`absolute -left-[25px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs transition-all ${
                isCurrent
                  ? 'border-amber-400 bg-amber-950 text-amber-300 ring-4 ring-amber-400/25 scale-110 shadow-md'
                  : isCompleted
                  ? 'border-amber-900 bg-amber-900 text-white'
                  : 'border-stone-300 bg-white text-stone-400'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>

            {/* Step Labels */}
            <div className="min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <h5 className={`text-[15px] font-semibold leading-tight ${isCurrent ? 'text-amber-950 font-bold' : isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                  {step.label}
                </h5>
                {isCurrent && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5 leading-snug">{step.description}</p>
              <p className="text-[11px] text-stone-400 mt-0.5 font-medium">
                {idx === 0 && orderDate
                  ? formatDate(orderDate, { format: 'datetime' })
                  : idx === timelineSteps.length - 1 && deliveredDate
                  ? formatDate(deliveredDate, { format: 'datetime' })
                  : ''}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

/**
 * Mobile & Tablet Rebuilt Order Details Component
 */
export default memo(function MobileOrderDetail({
  order = null,
  orderId = null,
  isLoading = false,
  isError = false,
  error = null,
  refetch,
  isCancelModalOpen,
  setIsCancelModalOpen,
  selectedReviewProduct,
  setSelectedReviewProduct,
  isBuyingAgain,
  handleCancelOrder,
  handleBuyAgain,
  handlePrintInvoice,
  canCancel = false,
  isDelivered = false,
  cancelOrder,
}) {
  const navigate = useNavigate();

  const items = order?.items || [];

  return (
    <div className="min-h-screen bg-stone-50/60 pb-28 font-sans text-stone-900">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* STICKY HEADER (52-56px) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex h-[54px] min-h-[54px] w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/account/orders')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
            aria-label="Back to orders"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[22px] font-bold text-stone-900 font-display tracking-tight leading-none">
            Order Details
          </h1>
        </div>

        <button
          type="button"
          onClick={handlePrintInvoice}
          className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition-all"
          title="Print Invoice"
        >
          <FiPrinter className="h-5 w-5" />
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="px-4 py-4 space-y-4">
        {/* ORDER SUMMARY HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[18px] bg-white p-[14px] border border-stone-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">KRISHANA POSHAK</p>
              <h2 className="text-[15px] font-bold text-stone-900 font-display">
                Order #{order?.orderNumber || orderId}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Placed on {order?.orderDate ? formatDate(order.orderDate, { format: 'datetime' }) : 'N/A'}
              </p>
            </div>

            {/* Status Badge Pill (12px) */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold border ${getStatusBadgeStyle(order?.orderStatus)}`}>
              {order?.orderStatus || 'PENDING'}
            </span>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Grand Total</span>
            <span className="text-[20px] font-bold text-amber-950 font-display">
              {formatPrice(order?.totalAmount || 0)}
            </span>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* TRACK ORDER BUTTON (STRICT PROMPT REQUIREMENTS) */}
        {/* 44px Height, Rounded, Gradient Gold, Full Width */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => {
            const el = document.getElementById('mobile-timeline-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full h-[44px] min-h-[44px] rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white font-bold font-display text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 active:scale-98 transition-all"
        >
          <FiTruck className="h-4 w-4 text-amber-100" />
          <span>Track Order Status</span>
        </motion.button>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECONDARY BUTTONS ROW (STRICT PROMPT REQUIREMENTS) */}
        {/* Download Invoice, Return Order / Cancel Order, Need Help */}
        {/* Outlined Buttons, Height 42px */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Download Invoice */}
          <button
            type="button"
            onClick={handlePrintInvoice}
            className="w-full h-[42px] min-h-[42px] rounded-xl border border-stone-300 bg-white text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-50 active:scale-98 transition-all shadow-2xs"
          >
            <FiFileText className="h-4 w-4 text-amber-800" />
            <span>Download Invoice</span>
          </button>

          {/* Need Help */}
          <a
            href={`tel:${siteConfig.phone || '+919876543210'}`}
            className="w-full h-[42px] min-h-[42px] rounded-xl border border-stone-300 bg-white text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-50 active:scale-98 transition-all shadow-2xs"
          >
            <FiHelpCircle className="h-4 w-4 text-amber-800" />
            <span>Need Help</span>
          </a>

          {/* Buy Again / Cancel Order */}
          {canCancel ? (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="w-full h-[42px] min-h-[42px] rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 active:scale-98 transition-all shadow-2xs col-span-2 sm:col-span-1"
            >
              <FiXCircle className="h-4 w-4 text-rose-600" />
              <span>Cancel Order</span>
            </button>
          ) : (
            items.length > 0 && items[0]?.variantId && (
              <button
                type="button"
                onClick={handleBuyAgain}
                disabled={isBuyingAgain}
                className="w-full h-[42px] min-h-[42px] rounded-xl border border-amber-200 bg-amber-50/60 text-amber-900 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-100 active:scale-98 transition-all shadow-2xs col-span-2 sm:col-span-1"
              >
                <FiRefreshCw className={`h-4 w-4 text-amber-800 ${isBuyingAgain ? 'animate-spin' : ''}`} />
                <span>Buy Again</span>
              </button>
            )
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ORDER TIMELINE CARD (Inside Order Details) */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div id="mobile-timeline-section" className="rounded-[18px] bg-white p-[14px] border border-stone-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2 border-b border-stone-100 pb-3">
            <FiTruck className="h-4 w-4 text-amber-800" /> Order Tracking Timeline
          </h3>
          <MobileOrderTimeline
            currentStatus={order?.orderStatus}
            orderDate={order?.orderDate}
            deliveredDate={order?.deliveredDate}
            cancelledAt={order?.cancelledAt}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* PURCHASED ITEMS LIST */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="rounded-[18px] bg-white p-[14px] border border-stone-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3">
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center justify-between border-b border-stone-100 pb-2.5">
            <span className="flex items-center gap-2">
              <FiShoppingBag className="h-4 w-4 text-amber-800" /> Purchased Items
            </span>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
              {items.length}
            </span>
          </h3>

          <div className="divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.id} className="py-3 first:pt-1 last:pb-1 flex items-start gap-3">
                {/* Product Image 72x72 */}
                <img
                  src={item.imageUrl || '/placeholder.svg'}
                  alt={item.productName}
                  className="h-[72px] w-[72px] rounded-[14px] object-cover bg-stone-100 border border-stone-200/60 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-sans leading-none">
                    KRISHANA POSHAK
                  </p>
                  <Link to={`/product/${item.productId || item.id}`} className="text-[15px] font-semibold text-stone-900 line-clamp-2 leading-snug font-sans block mt-0.5 hover:text-amber-900">
                    {item.productName}
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-1">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && <span>•</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>

                  <p className="text-[20px] font-bold text-amber-950 font-display mt-1">
                    {formatPrice(item.price || 0)}
                  </p>
                </div>

                {/* Review Action Button if Delivered */}
                {isDelivered && (
                  <button
                    type="button"
                    onClick={() => setSelectedReviewProduct(item)}
                    className="shrink-0 h-[36px] px-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 text-xs font-semibold flex items-center gap-1 hover:bg-amber-100 transition-all"
                  >
                    <FiStar className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>Review</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* DELIVERY ADDRESS DETAILS */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="rounded-[18px] bg-white p-[14px] border border-stone-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-2.5">
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <FiMapPin className="h-4 w-4 text-amber-800" /> Delivery Address
          </h3>

          <div className="text-xs text-stone-700 space-y-1 pt-1 leading-relaxed">
            <p className="font-bold text-stone-900 text-sm">{order?.shippingAddress?.fullName || order?.customerName || 'Valued Devotee'}</p>
            {order?.shippingAddress?.phoneNumber && (
              <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                <FiPhone className="h-3.5 w-3.5 text-amber-800" /> {order.shippingAddress.phoneNumber}
              </p>
            )}
            {order?.shippingAddress?.addressLine1 && <p>{order.shippingAddress.addressLine1}</p>}
            {order?.shippingAddress?.addressLine2 && <p className="text-stone-500">{order.shippingAddress.addressLine2}</p>}
            {(order?.shippingAddress?.city || order?.shippingAddress?.state) && (
              <p className="font-semibold text-stone-900">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
            )}
            {order?.shippingAddress?.country && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{order.shippingAddress.country}</p>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* INVOICE & PAYMENT SUMMARY CARD */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="rounded-[18px] bg-white p-[14px] border border-stone-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3">
          <h3 className="text-sm font-bold text-stone-900 font-display flex items-center gap-2 border-b border-stone-100 pb-2.5">
            <FiCreditCard className="h-4 w-4 text-amber-800" /> Payment & Invoice Summary
          </h3>

          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-stone-900">{formatPrice(order?.subTotal || order?.totalAmount || 0)}</span>
            </div>

            {typeof order?.discount === 'number' && order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Coupon</span>
                <span className="font-bold">-{formatPrice(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping Charge</span>
              <span className="font-bold text-stone-900">
                {order?.shippingCharge === 0 ? <span className="text-emerald-600 font-bold">✓ FREE DELIVERY</span> : formatPrice(order?.shippingCharge || 0)}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-stone-900 font-bold">
              <span className="text-sm">Grand Total</span>
              <span className="text-[20px] font-bold text-amber-950 font-display">{formatPrice(order?.totalAmount || 0)}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">Payment Status</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-bold border ${order?.paymentStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
              {order?.paymentStatus || 'PENDING'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
});
