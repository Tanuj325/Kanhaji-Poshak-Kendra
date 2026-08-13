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
  FiChevronRight,
  FiAlertTriangle,
} from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { siteConfig } from '@/config/siteConfig';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
import CancelOrderModal from '@/components/orders/CancelOrderModal';

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
    <div className="fixed inset-0 z-40 bg-[#faf7f2] text-stone-900 font-sans antialiased overflow-y-auto lg:hidden pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 min-h-[56px] w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 md:px-6 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate('/account/orders')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        <div className="h-5 w-32 bg-stone-200 rounded animate-pulse" />
        <div className="w-9" />
      </header>

      {/* Main Skeleton */}
      <main className="px-4 md:px-6 py-4 space-y-4 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 space-y-3 animate-pulse">
          <div className="h-4 w-40 bg-stone-200 rounded" />
          <div className="h-3 w-28 bg-stone-100 rounded" />
          <div className="h-6 w-24 bg-stone-200 rounded-full" />
        </div>

        <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 space-y-4 animate-pulse">
          <div className="h-4 w-36 bg-stone-200 rounded" />
          <div className="h-16 w-full bg-stone-100 rounded-xl" />
        </div>

        <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 space-y-4 animate-pulse">
          <div className="h-4 w-40 bg-stone-200 rounded" />
          <div className="flex gap-3">
            <div className="h-20 w-20 bg-stone-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 bg-stone-200 rounded" />
              <div className="h-3 w-1/2 bg-stone-100 rounded" />
              <div className="h-4 w-1/4 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PREMIUM ORDER TRACKING COMPONENT
   - Horizontal stepper on Tablet (768px-1023px)
   - Premium vertical step line & active status cards on Mobile (<768px)
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
      <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 flex items-center gap-3.5 text-rose-800 shadow-2xs">
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

  const progressPercent = Math.min(100, Math.max(0, (currentIdx / (timelineSteps.length - 1)) * 100));

  return (
    <div className="space-y-4">
      {/* ── TABLET HORIZONTAL STEPPER (768px - 1023px) ── */}
      <div className="hidden md:block py-2">
        <div className="relative flex items-center justify-between">
          {/* Track Line Background */}
          <div className="absolute left-6 right-6 top-4 h-[3px] bg-stone-200 -z-0" />
          {/* Active Progress Line */}
          <div
            className="absolute left-6 top-4 h-[3px] bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-600 transition-all duration-500 -z-0"
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
                        : 'border-stone-300 bg-white text-stone-400'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <p
                  className={`text-xs mt-2 font-medium leading-tight ${
                    isCurrent ? 'font-bold text-[#0f2440]' : isCompleted ? 'text-stone-900 font-semibold' : 'text-stone-400'
                  }`}
                >
                  {step.shortLabel}
                </p>
                {idx === 0 && orderDate && (
                  <span className="text-[10px] text-stone-400 mt-0.5">{formatDate(orderDate, { format: 'short' })}</span>
                )}
                {idx === timelineSteps.length - 1 && deliveredDate && (
                  <span className="text-[10px] text-stone-400 mt-0.5">{formatDate(deliveredDate, { format: 'short' })}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE VERTICAL STEP TIMELINE (<768px) ── */}
      <div className="block md:hidden space-y-3.5 py-1">
        {timelineSteps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === timelineSteps.length - 1;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex items-start group">
              {/* Connecting Vertical Track Segment (Centered on 13px line) */}
              {!isLast && (
                <div
                  className={`absolute left-[13px] top-6 bottom-0 w-[2.5px] -mb-3.5 transition-colors duration-500 ${
                    idx < currentIdx
                      ? 'bg-gradient-to-b from-amber-600 to-amber-700'
                      : 'bg-stone-200/80'
                  }`}
                />
              )}

              {/* Status Circle Icon Badge */}
              <div
                className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'border-amber-500 bg-[#0f2440] text-amber-300 ring-4 ring-amber-500/25 shadow-sm scale-105'
                    : isCompleted
                      ? 'border-amber-800 bg-amber-800 text-white shadow-2xs'
                      : 'border-stone-300 bg-stone-100 text-stone-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              {/* Step Content & Details Card */}
              <div
                className={`ml-3 flex-1 min-w-0 rounded-xl p-2.5 transition-all ${
                  isCurrent
                    ? 'bg-amber-50/70 border border-amber-200/80 shadow-2xs'
                    : isCompleted
                      ? 'bg-stone-50/60 border border-stone-200/40'
                      : 'bg-transparent border border-transparent'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <h5
                    className={`text-xs leading-tight ${
                      isCurrent
                        ? 'font-bold text-[#0f2440]'
                        : isCompleted
                          ? 'font-semibold text-stone-900'
                          : 'font-medium text-stone-400'
                    }`}
                  >
                    {step.label}
                  </h5>

                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                      In Progress
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-stone-500 mt-1 font-medium">
                  {idx === 0 && orderDate
                    ? `Placed on ${formatDate(orderDate, { format: 'datetime' })}`
                    : idx === timelineSteps.length - 1 && deliveredDate
                      ? `Delivered on ${formatDate(deliveredDate, { format: 'datetime' })}`
                      : step.description || ''}
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
      <div className="fixed inset-0 z-40 bg-[#faf7f2] text-stone-900 font-sans antialiased overflow-y-auto lg:hidden px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-rose-200 shadow-md text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <FiAlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-stone-900">Order Details Unavailable</h3>
          <p className="text-xs text-stone-600">{getErrorMessage(error)}</p>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/account/orders')}
              className="flex-1 h-11 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold"
            >
              Back to Orders
            </button>
            <button
              type="button"
              onClick={refetch}
              className="flex-1 h-11 rounded-xl bg-[#0f2440] text-white text-xs font-bold flex items-center justify-center gap-1.5"
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
    <div className="fixed inset-0 z-40 bg-[#faf7f2] text-stone-900 font-sans antialiased overflow-y-auto lg:hidden pb-16">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. PREMIUM STICKY HEADER (56px) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 flex h-14 min-h-[56px] w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-1 md:px-3 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/account/orders')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
            aria-label="Back to orders"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base md:text-lg font-bold text-stone-900 font-display tracking-tight leading-none">
              Order Details
            </h1>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">#{orderNum}</p>
          </div>
        </div>

        {/* Right Action Icon: Invoice Print */}
        <button
          type="button"
          onClick={handlePrintInvoice}
          className="flex h-7 w-7 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 active:scale-95 transition-all border border-stone-200/60"
          title="Print / Download Invoice"
        >
          <FiPrinter className="h-4.5 w-4.5 text-stone-700" />
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN FULL-WIDTH PAGE CONTENT */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="w-full px-1 md:px-3 py-4 max-w-5xl mx-auto space-y-4">
        {/* TABLET 2-COLUMN GRID WRAPPER (768px-1023px) / MOBILE 1-COLUMN */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          {/* ── LEFT COLUMN: Summary + Status + Products ── */}
          <div className="md:col-span-7 space-y-4">
            {/* ══════════════════════════════════════════════════════════ */}
            {/* 2. ORDER SUMMARY HEADER CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-2 md:p-3 border border-stone-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-sans">
                    KANHAJI POSHAK
                  </p>
                  <h2 className="text-base md:text-md font-bold text-stone-900 font-display">
                    Order #{orderNum}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">Placed on {orderDateFormatted}</p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-1 py-1 text-xs font-bold border ${getStatusBadgeStyle(
                      order?.orderStatus
                    )}`}
                  >
                    {order?.orderStatus || 'PENDING'}
                  </span>

                  {order?.paymentStatus && (
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-1 py-0.5 rounded-md border ${order.paymentStatus === 'PAID' || order.paymentStatus === 'COMPLETED'
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

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">Total Order Amount</span>
                <span className="text-xl md:text-2xl font-bold text-[#0f2440] font-display">
                  {totalAmountFormatted}
                </span>
              </div>
            </motion.div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 3. ORDER STATUS / TRACKING CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-100 pb-2.5">
                <FiTruck className="h-4 w-4 text-amber-800" /> Order Tracking Status
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
            <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center justify-between border-b border-stone-100 pb-2.5">
                <span className="flex items-center gap-1.5">
                  <FiShoppingBag className="h-4 w-4 text-amber-800" /> Purchased Items
                </span>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-600">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </h3>

              <div className="divide-y divide-stone-100">
                {items.map((item, idx) => {
                  const imageUrl = getOrderItemImage(item);
                  const productName = getOrderItemName(item, order);
                  const priceFormatted = formatPrice(item.price || item.totalPrice || 0);

                  return (
                    <div key={item.id || idx} className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3.5">
                      {/* Product Image: 80-100px mobile, 96-112px tablet */}
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/70 shrink-0">
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
                          className="text-sm md:text-base font-semibold text-stone-900 line-clamp-2 leading-snug hover:text-amber-900 transition-colors font-sans block"
                        >
                          {productName}
                        </Link>

                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-stone-500 font-medium mt-1">
                          {(item.size || item.variantName || item.variant?.size) && (
                            <span>Size: {item.size || item.variantName || item.variant?.size}</span>
                          )}
                          {item.color && (
                            <>
                              {(item.size || item.variantName || item.variant?.size) && <span>•</span>}
                              <span className="text-amber-900 font-bold">Color: {item.color}</span>
                            </>
                          )}
                          <span>• Qty: {item.quantity || 1}</span>
                        </div>

                        <p className="text-base md:text-lg font-bold text-[#0f2440] font-display mt-1.5">
                          {priceFormatted}
                        </p>
                      </div>

                      {/* Review Action if Order Delivered */}
                      {isDelivered && (
                        <button
                          type="button"
                          onClick={() => setSelectedReviewProduct(item)}
                          className="shrink-0 h-9 px-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 text-xs font-bold flex items-center gap-1 hover:bg-amber-100 transition-all shadow-2xs"
                        >
                          <FiStar className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>Review</span>
                        </button>
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
            <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-100 pb-2.5">
                <FiFileText className="h-4 w-4 text-amber-800" /> Price Details
              </h3>

              <div className="space-y-2.5 text-xs text-stone-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">
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
                  <span className="font-bold text-stone-900">
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
                    <span className="font-bold text-stone-900">
                      {formatPrice(order.tax || order.taxAmount || 0)}
                    </span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-stone-100 flex justify-between items-center text-stone-900 font-bold text-sm">
                  <span>Total Amount</span>
                  <span className="text-lg font-bold text-[#0f2440] font-display">
                    {totalAmountFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 6. SHIPPING ADDRESS CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            {order?.shippingAddress && (
              <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 shadow-xs space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-100 pb-2.5">
                  <FiMapPin className="h-4 w-4 text-amber-800" /> Delivery Address
                </h3>

                <div className="text-xs text-stone-700 space-y-1 leading-relaxed">
                  <p className="font-bold text-stone-900 text-sm">
                    {order.shippingAddress.fullName || order.customerName || 'Valued Customer'}
                  </p>
                  {order.shippingAddress.phoneNumber && (
                    <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                      <FiPhone className="h-3.5 w-3.5 text-amber-800" /> {order.shippingAddress.phoneNumber}
                    </p>
                  )}
                  {order.shippingAddress.addressLine1 && <p>{order.shippingAddress.addressLine1}</p>}
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-stone-500">{order.shippingAddress.addressLine2}</p>
                  )}
                  {(order.shippingAddress.city || order.shippingAddress.state) && (
                    <p className="font-semibold text-stone-900">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                    </p>
                  )}
                  {order.shippingAddress.country && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {order.shippingAddress.country}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 7. PAYMENT & DELIVERY DETAILS CARD */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="rounded-2xl bg-white p-4 md:p-5 border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 border-b border-stone-100 pb-2.5">
                <FiCreditCard className="h-4 w-4 text-amber-800" /> Payment & Delivery Information
              </h3>

              <div className="space-y-2 text-xs text-stone-600">
                {order?.paymentMethod && (
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-bold text-stone-900">{order.paymentMethod}</span>
                  </div>
                )}
                {order?.paymentStatus && (
                  <div className="flex justify-between items-center">
                    <span>Payment Status</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${order.paymentStatus === 'PAID' || order.paymentStatus === 'COMPLETED'
                        ? 'text-emerald-700 bg-emerald-50'
                        : order.paymentStatus === 'FAILED'
                          ? 'text-rose-700 bg-rose-50'
                          : 'text-amber-800 bg-amber-50'
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                )}
                {(order?.razorpayPaymentId || order?.paymentId || order?.transactionId) && (
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-mono text-[11px] text-stone-800">
                      {order.razorpayPaymentId || order.paymentId || order.transactionId}
                    </span>
                  </div>
                )}
                {order?.deliveredDate && (
                  <div className="flex justify-between pt-1 border-t border-stone-100">
                    <span>Delivered On</span>
                    <span className="font-bold text-emerald-800">
                      {formatDate(order.deliveredDate, { format: 'datetime' })}
                    </span>
                  </div>
                )}
                {order?.trackingNumber && (
                  <div className="flex justify-between">
                    <span>Tracking #</span>
                    <span className="font-semibold text-stone-900">{order.trackingNumber}</span>
                  </div>
                )}
                {order?.courierName && (
                  <div className="flex justify-between">
                    <span>Courier Partner</span>
                    <span className="font-semibold text-stone-900">{order.courierName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════ */}
            {/* 8. COMPACT ACTION BUTTONS GROUP (44-48px touch targets) */}
            {/* ══════════════════════════════════════════════════════════ */}
            <div className="space-y-2.5 pt-1">
              {/* Primary Action Button: Buy Again */}
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleBuyAgain}
                  disabled={isBuyingAgain}
                  className="w-full h-11 min-h-[44px] rounded-xl bg-[#0f2440] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#1b3a5c] active:scale-98 transition-all disabled:opacity-50"
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
                  className="w-full h-11 min-h-[44px] rounded-xl border border-stone-300 bg-white text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-50 active:scale-98 transition-all shadow-2xs"
                >
                  <FiPrinter className="h-4 w-4 text-amber-800" />
                  <span>Invoice</span>
                </button>

                {/* Need Help / Support */}
                <a
                  href={`tel:${siteConfig.phone || '+919876543210'}`}
                  className="w-full h-11 min-h-[44px] rounded-xl border border-stone-300 bg-white text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-50 active:scale-98 transition-all shadow-2xs"
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
                  className="w-full h-11 min-h-[44px] rounded-xl border border-rose-200 bg-rose-50/80 text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 active:scale-98 transition-all shadow-2xs"
                >
                  <FiXCircle className="h-4 w-4 text-rose-600" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Order Confirmation Modal */}
      {canCancel && handleCancelOrder && (
        <CancelOrderModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen?.(false)}
          onConfirm={handleCancelOrder}
          orderNumber={orderNum}
          isLoading={cancelOrder?.isPending}
        />
      )}
    </div>
  );
});
