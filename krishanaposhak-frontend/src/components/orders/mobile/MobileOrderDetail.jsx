import { memo, useMemo } from 'react';
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
  FiAlertTriangle,
} from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { siteConfig } from '@/config/siteConfig';

/* ═══════════════════════════════════════════════════════════════════════
   FALLBACK IMAGE — Inline SVG Data URL, zero external network dependency
   ═══════════════════════════════════════════════════════════════════════ */
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23F5F0E6'/%3E%3Cpath d='M35 45L50 30L65 45M35 55H65' stroke='%23C99A3B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

/* ═══════════════════════════════════════════════════════════════════════
   DATA RESOLVERS — Safe multi-schema extraction from real API responses
   ═══════════════════════════════════════════════════════════════════════ */
function getOrderItemImage(item) {
  if (!item) return FALLBACK_IMAGE;

  const url =
    item.imageUrl ||
    item.image ||
    item.productImage ||
    item.product?.imageUrl ||
    item.product?.image ||
    item.product?.images?.[0]?.imageUrl ||
    item.product?.images?.[0]?.url ||
    (typeof item.product?.images?.[0] === 'string' ? item.product.images[0] : null) ||
    item.variant?.imageUrl ||
    item.variant?.image ||
    item.variantImageUrl ||
    (Array.isArray(item.images)
      ? item.images[0]?.imageUrl || item.images[0]?.url || (typeof item.images[0] === 'string' ? item.images[0] : null)
      : null);

  if (url && typeof url === 'string' && url.trim() && url !== '/placeholder.svg') {
    return url;
  }
  return FALLBACK_IMAGE;
}

function getOrderItemName(item, order) {
  if (!item) return order?.orderNumber ? `Order #${order.orderNumber}` : 'Krishana Poshak Product';

  const name =
    item.productName ||
    item.name ||
    item.title ||
    item.product?.name ||
    item.product?.productName ||
    item.product?.title ||
    item.productTitle ||
    item.variant?.product?.name;

  if (name && typeof name === 'string' && name.trim()) {
    return name;
  }
  return order?.orderNumber ? `Order #${order.orderNumber}` : 'Krishana Poshak Product';
}

/* ═══════════════════════════════════════════════════════════════════════
   STATUS BADGE STYLES — Krishana Poshak Luxury Color Tokens
   ═══════════════════════════════════════════════════════════════════════ */
const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/90';
    case 'PROCESSING':
    case 'PACKING':
    case 'PACKED':
    case 'CONFIRMED':
      return 'bg-amber-50 text-amber-900 border-amber-300/80';
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return 'bg-sky-50 text-sky-900 border-sky-200/90';
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-800 border-rose-200/90';
    case 'PENDING':
    default:
      return 'bg-stone-100 text-stone-800 border-stone-200';
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   TIMELINE STEPS & MAP
   ═══════════════════════════════════════════════════════════════════════ */
const timelineSteps = [
  { status: 'PENDING', label: 'Order Placed', shortLabel: 'Placed', icon: FiClock },
  { status: 'CONFIRMED', label: 'Confirmed', shortLabel: 'Confirmed', icon: FiCheckCircle },
  { status: 'PACKING', label: 'Processing', shortLabel: 'Processing', icon: FiPackage },
  { status: 'SHIPPED', label: 'Dispatched', shortLabel: 'Shipped', icon: FiTruck },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', shortLabel: 'Out for Delivery', icon: FiNavigation },
  { status: 'DELIVERED', label: 'Delivered', shortLabel: 'Delivered', icon: FiCheck },
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

/* ═══════════════════════════════════════════════════════════════════════
   SKELETON LOADER — Realistic Mobile & Tablet Layout Placeholder
   ═══════════════════════════════════════════════════════════════════════ */
function MobileOrderDetailSkeleton() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-slate-800 font-sans antialiased lg:hidden pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-[52px] w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate('/account/orders')}
          className="h-[36px] w-[36px] rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs"
          aria-label="Back"
        >
          <FiArrowLeft className="h-4 w-4 text-slate-800" />
        </button>
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="w-9" />
      </header>

      {/* Main Skeleton */}
      <main className="px-4 py-4 space-y-4 max-w-5xl mx-auto">
        <div className="rounded-[16px] bg-white p-4 border border-slate-200/80 space-y-3 animate-pulse">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-3 w-28 bg-slate-100 rounded" />
          <div className="h-6 w-24 bg-slate-200 rounded-full" />
        </div>

        <div className="rounded-[16px] bg-white p-4 border border-slate-200/80 space-y-4 animate-pulse">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-16 w-full bg-slate-100 rounded-xl" />
        </div>

        <div className="rounded-[16px] bg-white p-4 border border-slate-200/80 space-y-4 animate-pulse">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="flex gap-3">
            <div className="h-16 w-16 bg-slate-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
              <div className="h-4 w-1/4 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PREMIUM ORDER TRACKING COMPONENT
   - Horizontal line & step cards on Tablet (768px-1023px)
   - Compact vertical step line on Mobile (<768px)
   ═══════════════════════════════════════════════════════════════════════ */
const MobileOrderTimeline = memo(function MobileOrderTimeline({
  currentStatus,
  orderDate,
  deliveredDate,
  cancelledAt,
}) {
  const currentIdx = statusIndexMap[currentStatus?.toUpperCase()] ?? 0;
  const isCancelled = currentStatus?.toUpperCase() === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="rounded-[14px] border border-rose-200 bg-rose-50/90 p-3.5 flex items-center gap-3 text-rose-800 shadow-2xs">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
          <FiXCircle className="h-4.5 w-4.5" />
        </div>
        <div>
          <h4 className="font-display font-bold text-xs text-rose-900">Order Cancelled</h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            {cancelledAt ? formatDate(cancelledAt, { format: 'datetime' }) : 'This order has been cancelled.'}
          </p>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.max(0, (currentIdx / (timelineSteps.length - 1)) * 100));

  return (
    <div className="space-y-3">
      {/* ── TABLET HORIZONTAL STEPPER (768px - 1023px) ── */}
      <div className="hidden md:block py-2">
        <div className="relative flex items-center justify-between">
          {/* Track Line Background */}
          <div className="absolute left-6 right-6 top-4 h-[3px] bg-slate-200 -z-0" />
          {/* Active Progress Line */}
          <div
            className="absolute left-6 top-4 h-[3px] bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 transition-all duration-500 -z-0"
            style={{ width: `calc(${progressPercent}% * 0.88)` }}
          />

          {timelineSteps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon = step.icon;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center text-center max-w-[100px]">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs transition-all ${
                    isCurrent
                      ? 'border-amber-500 bg-[#0f2440] text-amber-300 ring-4 ring-amber-500/20 shadow-md scale-110'
                      : isCompleted
                      ? 'border-amber-700 bg-amber-700 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <p
                  className={`text-xs mt-2 font-medium leading-tight ${
                    isCurrent ? 'font-bold text-[#0f2440]' : isCompleted ? 'text-slate-900 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {step.shortLabel}
                </p>
                {idx === 0 && orderDate && (
                  <span className="text-[10px] text-slate-400 mt-0.5">{formatDate(orderDate, { format: 'short' })}</span>
                )}
                {idx === timelineSteps.length - 1 && deliveredDate && (
                  <span className="text-[10px] text-slate-400 mt-0.5">{formatDate(deliveredDate, { format: 'short' })}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE VERTICAL STEP TIMELINE (<768px) ── */}
      <div className="block md:hidden relative pl-6 space-y-3.5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
        {/* Progress Line */}
        <div
          className="absolute left-[11px] top-2 w-[2px] bg-gradient-to-b from-amber-700 via-amber-600 to-emerald-600 transition-all duration-500"
          style={{ height: `${progressPercent}%` }}
        />

        {timelineSteps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex items-start gap-3 min-w-0">
              <span
                className={`absolute -left-[23px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] transition-all ${
                  isCurrent
                    ? 'border-amber-500 bg-[#0f2440] text-amber-300 ring-3 ring-amber-500/25 scale-105 shadow-2xs'
                    : isCompleted
                    ? 'border-amber-800 bg-amber-800 text-white'
                    : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                <Icon className="h-3 w-3" />
              </span>

              <div className="min-w-0 pt-0.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5
                    className={`text-xs font-semibold leading-tight ${
                      isCurrent ? 'text-[#0f2440] font-bold' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h5>
                  {isCurrent && (
                    <span className="rounded-full bg-amber-100/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-900 border border-amber-300/60">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
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
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════
   MAIN MOBILE & TABLET ORDER DETAIL COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
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
  isBuyingAgain = false,
  handleCancelOrder,
  handleBuyAgain,
  handlePrintInvoice,
  canCancel = false,
  isDelivered = false,
  cancelOrder,
}) {
  const navigate = useNavigate();

  // Resolve items array safely
  const items = useMemo(() => {
    if (!order) return [];
    return order.items || order.orderItems || order.products || [];
  }, [order]);

  // Loading state handling
  if (isLoading) {
    return <MobileOrderDetailSkeleton />;
  }

  // Error state handling
  if (isError) {
    return (
      <div className="min-h-dvh w-full bg-[#FAF8F5] text-slate-800 font-sans antialiased lg:hidden px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-[20px] p-6 border border-rose-200 shadow-sm text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <FiAlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">Order Details Unavailable</h3>
          <p className="text-xs text-slate-600">{getErrorMessage(error)}</p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/account/orders')}
              className="flex-1 h-11 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold active:scale-95 transition-all"
            >
              Back to Orders
            </button>
            <button
              type="button"
              onClick={refetch}
              className="flex-1 h-11 rounded-xl bg-[#0f2440] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <FiRefreshCw className="h-3.5 w-3.5 text-amber-300" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderNum = order?.orderNumber || orderId || 'N/A';
  const orderDateFormatted = order?.orderDate ? formatDate(order.orderDate, { format: 'datetime' }) : 'N/A';
  const totalAmountFormatted = formatPrice(order?.totalAmount || 0);

  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-slate-800 font-sans antialiased lg:hidden pb-12">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. PREMIUM STICKY HEADER (52px) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 flex h-[52px] min-h-[52px] w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/account/orders')}
            className="h-[36px] w-[36px] rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs shrink-0"
            aria-label="Back to orders"
          >
            <FiArrowLeft className="h-4 w-4 text-slate-800" />
          </button>
          <div className="min-w-0">
            <h1 className="text-[14px] font-bold text-slate-900 font-display tracking-tight leading-none truncate">
              Order Details
            </h1>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">#{orderNum}</p>
          </div>
        </div>

        {/* Right Action Icon: Invoice Print */}
        <button
          type="button"
          onClick={handlePrintInvoice}
          className="h-[36px] w-[36px] rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-2xs shrink-0"
          title="Print / Download Invoice"
        >
          <FiPrinter className="h-4 w-4 text-slate-700" />
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN FULL-WIDTH PAGE CONTENT */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="w-full px-4 py-4 max-w-5xl mx-auto space-y-4">
        {/* TABLET 2-COLUMN GRID WRAPPER (768px-1023px) / MOBILE 1-COLUMN */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* ── LEFT COLUMN: Summary + Status + Products ── */}
          <div className="md:col-span-7 space-y-4">
            {/* ══════════════════════════════════════════════════════════ */}
            {/* 2. ORDER SUMMARY HEADER CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[16px] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-sans">
                    KRISHANA POSHAK
                  </p>
                  <h2 className="text-base font-bold text-slate-900 font-display truncate">
                    Order #{orderNum}
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">Placed on {orderDateFormatted}</p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${getStatusBadgeStyle(
                      order?.orderStatus
                    )}`}
                  >
                    {order?.orderStatus || 'PENDING'}
                  </span>

                  {order?.paymentStatus && (
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        order.paymentStatus === 'PAID' || order.paymentStatus === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : order.paymentStatus === 'FAILED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Total Amount</span>
                <span className="text-xl font-bold text-[#0f2440] font-display">
                  {totalAmountFormatted}
                </span>
              </div>
            </motion.div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 3. ORDER STATUS / TRACKING CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="rounded-[16px] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FiTruck className="h-3.5 w-3.5 text-amber-800" /> Order Tracking Status
              </h3>
              <MobileOrderTimeline
                currentStatus={order?.orderStatus}
                orderDate={order?.orderDate}
                deliveredDate={order?.deliveredDate}
                cancelledAt={order?.cancelledAt}
              />
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 4. PRODUCT SECTION & CARDS */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="rounded-[16px] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="flex items-center gap-1.5">
                  <FiShoppingBag className="h-3.5 w-3.5 text-amber-800" /> Purchased Items
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </h3>

              <div className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const imageUrl = getOrderItemImage(item);
                  const productName = getOrderItemName(item, order);
                  const priceFormatted = formatPrice(item.price || item.totalPrice || 0);

                  return (
                    <div key={item.id || idx} className="py-3 first:pt-1 last:pb-1 flex flex-col gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Product Image: 68px mobile, 76px tablet */}
                        <div className="h-[68px] w-[68px] sm:h-[76px] sm:w-[76px] rounded-[12px] overflow-hidden bg-slate-100 border border-slate-200/70 shrink-0">
                          <img
                            src={imageUrl}
                            alt={productName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.productId || item.id}`}
                            className="text-[13px] sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug hover:text-amber-900 transition-colors block"
                          >
                            {productName}
                          </Link>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-1 flex-wrap">
                            {(item.size || item.variantName || item.variant?.size) && (
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                                Size: {item.size || item.variantName || item.variant?.size}
                              </span>
                            )}
                            <span>Qty: {item.quantity || 1}</span>
                          </div>

                          <p className="text-sm sm:text-base font-bold text-[#0f2440] font-display mt-1">
                            {priceFormatted}
                          </p>
                        </div>
                      </div>

                      {/* Review Action Row if Order Delivered */}
                      {isDelivered && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedReviewProduct(item)}
                            className="h-[34px] px-3 rounded-[10px] border border-amber-300 bg-amber-50 text-amber-950 text-[11px] font-bold flex items-center gap-1 hover:bg-amber-100 active:scale-95 transition-all shadow-2xs"
                          >
                            <FiStar className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span>Write Review</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Price Details + Address + Payment + Actions ── */}
          <div className="md:col-span-5 space-y-4">
            {/* ══════════════════════════════════════════════════════════ */}
            {/* 5. PRICE DETAILS CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="rounded-[16px] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FiFileText className="h-3.5 w-3.5 text-amber-800" /> Price Details
              </h3>

              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">
                    {formatPrice(order?.subTotal || order?.totalAmount || 0)}
                  </span>
                </div>

                {typeof order?.discount === 'number' && order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-bold">-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-900">
                    {order?.shippingCharge === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE DELIVERY</span>
                    ) : (
                      formatPrice(order?.shippingCharge || 0)
                    )}
                  </span>
                </div>

                {(typeof order?.tax === 'number' || typeof order?.taxAmount === 'number') && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(order.tax || order.taxAmount || 0)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-slate-900 font-bold text-sm">
                  <span>Total Amount</span>
                  <span className="text-base sm:text-lg font-bold text-[#0f2440] font-display">
                    {totalAmountFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 6. SHIPPING ADDRESS CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            {order?.shippingAddress && (
              <div className="rounded-[16px] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <FiMapPin className="h-3.5 w-3.5 text-amber-800" /> Delivery Address
                </h3>

                <div className="text-xs text-slate-700 space-y-1 leading-relaxed break-words min-w-0">
                  <p className="font-bold text-slate-900 text-sm">
                    {order.shippingAddress.fullName || order.customerName || 'Valued Customer'}
                  </p>
                  {order.shippingAddress.phoneNumber && (
                    <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                      <FiPhone className="h-3.5 w-3.5 text-amber-800 shrink-0" /> {order.shippingAddress.phoneNumber}
                    </p>
                  )}
                  {order.shippingAddress.addressLine1 && <p>{order.shippingAddress.addressLine1}</p>}
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-slate-500">{order.shippingAddress.addressLine2}</p>
                  )}
                  {(order.shippingAddress.city || order.shippingAddress.state) && (
                    <p className="font-semibold text-slate-900">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                    </p>
                  )}
                  {order.shippingAddress.country && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {order.shippingAddress.country}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 7. PAYMENT & DELIVERY DETAILS CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="rounded-[16px] bg-white p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <FiCreditCard className="h-3.5 w-3.5 text-amber-800" /> Payment & Delivery Details
              </h3>

              <div className="space-y-2 text-xs text-slate-600 min-w-0">
                {order?.paymentMethod && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="shrink-0">Payment Method</span>
                    <span className="font-bold text-slate-900 truncate">{order.paymentMethod}</span>
                  </div>
                )}
                {order?.paymentStatus && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="shrink-0">Payment Status</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        order.paymentStatus === 'PAID' || order.paymentStatus === 'COMPLETED'
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : order.paymentStatus === 'FAILED'
                          ? 'text-rose-700 bg-rose-50 border border-rose-200'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                )}
                {(order?.razorpayPaymentId || order?.paymentId || order?.transactionId) && (
                  <div className="flex justify-between items-baseline gap-2 min-w-0">
                    <span className="shrink-0">Transaction ID</span>
                    <span className="font-mono text-[10px] text-slate-800 break-all select-all bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 max-w-[65%] text-right">
                      {order.razorpayPaymentId || order.paymentId || order.transactionId}
                    </span>
                  </div>
                )}
                {order?.deliveredDate && (
                  <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-100">
                    <span className="shrink-0">Delivered On</span>
                    <span className="font-bold text-emerald-800 truncate">
                      {formatDate(order.deliveredDate, { format: 'datetime' })}
                    </span>
                  </div>
                )}
                {order?.trackingNumber && (
                  <div className="flex justify-between items-baseline gap-2 min-w-0">
                    <span className="shrink-0">Tracking #</span>
                    <span className="font-mono text-[10px] text-slate-900 break-all select-all bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
                      {order.trackingNumber}
                    </span>
                  </div>
                )}
                {order?.courierName && (
                  <div className="flex justify-between items-center gap-2">
                    <span className="shrink-0">Courier Partner</span>
                    <span className="font-semibold text-slate-900 truncate">{order.courierName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 8. ACTION BUTTONS GROUP (44-46px touch targets) */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="space-y-2 pt-1">
              {/* Primary Action Button: Buy Again */}
              {items.length > 0 && items[0]?.variantId && !canCancel && (
                <button
                  type="button"
                  onClick={handleBuyAgain}
                  disabled={isBuyingAgain}
                  className="w-full h-[46px] min-h-[46px] rounded-[12px] bg-[#0f2440] hover:bg-[#1b3a5c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all disabled:opacity-50"
                >
                  <FiRefreshCw className={`h-4 w-4 text-amber-300 ${isBuyingAgain ? 'animate-spin' : ''}`} />
                  <span>Buy Again</span>
                </button>
              )}

              {/* Secondary Actions Row */}
              <div className="grid grid-cols-2 gap-2">
                {/* Download Invoice */}
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="w-full h-[44px] min-h-[44px] rounded-[12px] border border-slate-200/80 bg-white text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-98 transition-all shadow-2xs"
                >
                  <FiPrinter className="h-4 w-4 text-amber-800" />
                  <span>Invoice</span>
                </button>

                {/* Need Help / Support */}
                <a
                  href={`tel:${siteConfig.phone || '+919876543210'}`}
                  className="w-full h-[44px] min-h-[44px] rounded-[12px] border border-slate-200/80 bg-white text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-98 transition-all shadow-2xs"
                >
                  <FiHelpCircle className="h-4 w-4 text-amber-800" />
                  <span>Need Help</span>
                </a>
              </div>

              {/* Cancel Order Action */}
              {canCancel && (
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={cancelOrder?.isPending}
                  className="w-full h-[44px] min-h-[44px] rounded-[12px] border border-rose-200 bg-rose-50 text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 active:scale-98 transition-all shadow-2xs"
                >
                  <FiXCircle className="h-4 w-4 text-rose-600" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});
