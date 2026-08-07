import { useState, useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiSearch,
  FiChevronRight,
  FiShoppingBag,
  FiArrowRight,
  FiSliders,
  FiX,
  FiRefreshCw,
  FiFilter,
  FiXCircle,
} from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';
import { useFeaturedProducts } from '@/hooks/useProducts';

/* ═══════════════════════════════════════════════════════════════════════
   FALLBACK IMAGE — inline SVG data URL, zero network requests
   ═══════════════════════════════════════════════════════════════════════ */
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23F5F0E6'/%3E%3Cpath d='M35 45L50 30L65 45M35 55H65' stroke='%23D49E41' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

/* ═══════════════════════════════════════════════════════════════════════
   STATUS FILTER TABS — only statuses the backend supports
   ═══════════════════════════════════════════════════════════════════════ */
const statusFilterTabs = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PACKING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];


/* ═══════════════════════════════════════════════════════════════════════
   DATA RESOLVERS — multi-schema safe extraction from real API fields
   ═══════════════════════════════════════════════════════════════════════ */

/** Resolve product image from nested order item structure */
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

/** Resolve product name from nested order item structure */
function getOrderItemName(item) {
  if (!item) return 'Krishna Poshak Product';

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
  return 'Krishna Poshak Product';
}

/**
 * Status heading generator — Flipkart/Amazon style
 * "Delivered on 7 Aug 2026", "Shipped on 5 Aug 2026", "Order Placed", etc.
 */
function getStatusHeading(order) {
  const status = order?.orderStatus?.toUpperCase();
  const deliveredDate = order?.deliveredDate;
  const orderDate = order?.orderDate;

  switch (status) {
    case 'DELIVERED': {
      const d = deliveredDate || orderDate;
      return d ? `Delivered on ${formatDate(d, { format: 'short' })}` : 'Delivered';
    }
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY': {
      const d = order?.shippedDate || orderDate;
      return d ? `Shipped on ${formatDate(d, { format: 'short' })}` : 'Shipped';
    }
    case 'PROCESSING':
    case 'PACKING':
    case 'PACKED':
    case 'CONFIRMED':
      return 'Processing Order';
    case 'CANCELLED':
      return 'Order Cancelled';
    case 'RETURNED':
      return 'Refund Completed';
    case 'PENDING':
    default: {
      return orderDate ? `Order Placed on ${formatDate(orderDate, { format: 'short' })}` : 'Order Placed';
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   EMPTY STATE ILLUSTRATION
   ═══════════════════════════════════════════════════════════════════════ */
function EmptyOrdersIllustration() {
  return (
    <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FBF6ED] to-[#F5EAD6]" />
      <svg className="relative z-10 w-16 h-16 md:w-20 md:h-20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="50" width="60" height="50" rx="8" fill="#FAF3E6" stroke="#7A5825" strokeWidth="2.2" />
        <path d="M25 42C25 39.7909 26.7909 38 29 38H91C93.2091 38 95 39.7909 95 42V50H25V42Z" fill="#EFE2CD" stroke="#7A5825" strokeWidth="2.2" />
        <rect x="54" y="38" width="12" height="62" fill="#D49E41" fillOpacity="0.8" />
        <circle cx="60" cy="75" r="10" fill="#FFFFFF" stroke="#7A5825" strokeWidth="1.8" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SKELETON ORDER ROW — matches the simple flat row layout
   ═══════════════════════════════════════════════════════════════════════ */
function SkeletonOrderRow() {
  return (
    <div className="flex items-center gap-3.5 py-4 animate-pulse">
      <div className="h-[80px] w-[80px] md:h-[96px] md:w-[96px] rounded-xl bg-stone-200 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2 py-1">
        <div className="h-4 w-3/5 bg-stone-200 rounded" />
        <div className="h-3.5 w-4/5 bg-stone-100 rounded" />
      </div>
      <div className="h-5 w-5 bg-stone-200 rounded-full shrink-0" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ORDER ROW — Flipkart-style simple flat row
   Image | Status heading + Product name | Chevron
   ═══════════════════════════════════════════════════════════════════════ */
const OrderRow = memo(function OrderRow({ order }) {
  const itemsList = order?.items || order?.orderItems || order?.products || [];
  const firstItem = itemsList[0] || null;
  const extraCount = itemsList.length > 1 ? itemsList.length - 1 : 0;

  const imageUrl = getOrderItemImage(firstItem);
  const productName = getOrderItemName(firstItem);
  const statusHeading = getStatusHeading(order);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        to={`/account/orders/${order.id}`}
        className="group flex items-center gap-3.5 w-full py-4 hover:bg-stone-50/60 transition-colors"
      >
        {/* Product Image */}
        <div className="h-[80px] w-[80px] min-w-[80px] md:h-[96px] md:w-[96px] md:min-w-[96px] rounded-xl overflow-hidden bg-[#F5F0E6] border border-stone-200/60 shrink-0">
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

        {/* Status Heading + Product Name */}
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="text-[15px] md:text-base font-bold text-stone-900 leading-snug line-clamp-2">
            {statusHeading}
          </h3>
          <p className="text-[13px] md:text-sm text-stone-500 font-medium leading-snug line-clamp-1 mt-0.5">
            {productName}
            {extraCount > 0 && ` (+${extraCount} more)`}
          </p>
        </div>

        {/* Right Chevron */}
        <div className="shrink-0 pl-1">
          <FiChevronRight className="h-5 w-5 md:h-6 md:w-6 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════
   MAIN MOBILE ORDERS COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default memo(function MobileOrders({
  orders = [],
  totalOrders = 0,
  totalPages = 1,
  page = 1,
  status = '',
  paymentStatus = '',
  sort = 'createdAt,desc',
  searchTerm = '',
  setSearchTerm,
  updateParam,
  isLoading = false,
  isError = false,
  error = null,
  refetch,
  handleBuyAgain,
  buyingAgainId = null,
}) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Fetch featured products for recommendations on empty orders
  const { data: featuredData } = useFeaturedProducts();
  const recommendedProducts = useMemo(() => {
    const list = featuredData?.content || featuredData?.data || (Array.isArray(featuredData) ? featuredData : []);
    return list.slice(0, 4);
  }, [featuredData]);

  return (
    <div
      className="w-full min-h-[100dvh] bg-[#FAFAF8] flex flex-col"
      style={{ maxWidth: 'none' }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          1. PAGE HEADER — 56px mobile, 60px tablet
          ══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 w-full bg-white/97 backdrop-blur-md border-b border-stone-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between h-14 md:h-[60px] px-4 md:px-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/account/profile')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50 border border-stone-200/60 text-stone-800 hover:bg-stone-100 active:scale-95 transition-all shrink-0"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-[18px] w-[18px]" />
          </button>

          {/* Title */}
          <h1 className="text-xl md:text-[22px] font-bold text-stone-900 tracking-tight leading-none font-display">
            My Orders
          </h1>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all shrink-0 ${
              showSearch
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-stone-50 border border-stone-200/60 text-stone-700 hover:bg-stone-100'
            }`}
            aria-label="Toggle search"
          >
            <FiSearch className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          EXPANDABLE SEARCH BAR
          ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden bg-white border-b border-stone-200/60 px-4 md:px-6"
          >
            <div className="relative flex items-center py-2.5">
              <FiSearch className="absolute left-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by Order # or Product Name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/80 pl-10 pr-9 py-2.5 text-[13px] text-stone-900 placeholder-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-700/20 transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 text-stone-400 hover:text-stone-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════
          2. ORDERS SUMMARY + FILTER TOGGLE
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-white px-4 md:px-6 py-3 border-b border-stone-200/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-stone-900 font-display leading-tight">
            {!isLoading && `${totalOrders} ${totalOrders === 1 ? 'Order' : 'Orders'}`}
            {isLoading && 'Loading…'}
          </h2>
          {(status || paymentStatus || searchTerm) && (
            <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
              Filtered results
            </p>
          )}
        </div>

        {/* Filter + Sort toggle */}
        <button
          type="button"
          onClick={() => setShowFiltersDrawer((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold transition-all border ${
            status || paymentStatus
              ? 'bg-amber-950 text-white border-amber-950 shadow-sm'
              : 'bg-stone-50 text-stone-700 border-stone-200/70 hover:bg-stone-100'
          }`}
        >
          <FiSliders className="h-3.5 w-3.5" />
          Filters
          {(status || paymentStatus) && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 ml-0.5" />
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          3. STATUS FILTER TABS — horizontally scrollable pills
          ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-white border-b border-stone-200/50 px-4 md:px-6 py-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {statusFilterTabs.map((tab) => {
            const isActive = status === tab.value;
            return (
              <button
                key={tab.value || '__all__'}
                type="button"
                onClick={() => updateParam('status', tab.value)}
                className={`shrink-0 h-[36px] md:h-[38px] rounded-full px-4 md:px-5 text-[12px] md:text-[13px] font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          EXPANDABLE FILTER & SORT DRAWER
          ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFiltersDrawer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-stone-200 bg-white px-4 md:px-6"
          >
            <div className="py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-stone-900 flex items-center gap-1.5">
                  <FiFilter className="h-3.5 w-3.5 text-amber-800" /> Filters & Sort
                </span>
                {(status || paymentStatus || searchTerm) && (
                  <button
                    type="button"
                    onClick={() => {
                      updateParam('status', '');
                      updateParam('paymentStatus', '');
                      setSearchTerm('');
                    }}
                    className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => updateParam('paymentStatus', e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-800 focus:outline-none focus:border-amber-700"
                  >
                    <option value="">All Payments</option>
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 mb-1">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => updateParam('sort', e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-800 focus:outline-none focus:border-amber-700"
                  >
                    <option value="createdAt,desc">Newest First</option>
                    <option value="createdAt,asc">Oldest First</option>
                    <option value="totalAmount,desc">Price: High → Low</option>
                    <option value="totalAmount,asc">Price: Low → High</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════
          4. MAIN CONTENT AREA
          ══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 w-full px-4 md:px-6 py-4 md:py-5 pb-24 md:pb-6">
        {/* ── LOADING STATE ── */}
        {isLoading ? (
          <div className="divide-y divide-stone-200/70">
            {[1, 2, 3, 4].map((idx) => (
              <SkeletonOrderRow key={idx} />
            ))}
          </div>

        ) : isError ? (
          /* ── ERROR STATE ── */
          <div className="rounded-2xl bg-rose-50/80 p-6 md:p-8 text-center border border-rose-200/80 mt-2">
            <FiXCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-rose-900 font-display">
              Couldn&apos;t load your orders
            </h3>
            <p className="text-xs text-rose-700 mt-1 mb-4 max-w-xs mx-auto">
              {error?.message || 'Please check your connection and try again.'}
            </p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 text-white font-bold text-xs px-5 py-2.5 min-h-[40px] hover:bg-rose-800 active:scale-[0.97] transition-all"
            >
              <FiRefreshCw className="h-3.5 w-3.5" /> Try Again
            </button>
          </div>

        ) : orders.length === 0 ? (
          /* ── EMPTY STATE ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 pt-4"
          >
            <div className="rounded-2xl bg-white p-6 md:p-8 text-center border border-stone-200/60">
              <EmptyOrdersIllustration />
              <h2 className="text-lg md:text-xl font-bold text-stone-900 font-display mt-3">
                No Orders Yet
              </h2>
              <p className="text-[13px] text-stone-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                {status || paymentStatus || searchTerm
                  ? 'No orders match your filters. Try clearing them.'
                  : 'Your orders will appear here after your first purchase.'}
              </p>
              <div className="mt-5">
                <Link to="/shop">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white font-bold text-[13px] px-6 py-3 min-h-[44px] shadow-sm hover:shadow-md active:scale-[0.97] transition-all"
                  >
                    <FiShoppingBag className="h-4 w-4 text-amber-300" />
                    Start Shopping
                    <FiArrowRight className="h-4 w-4 text-amber-300" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Recommended products */}
            {recommendedProducts.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-stone-900 font-display flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                    Recommended For You
                  </h3>
                  <Link to="/shop" className="text-xs font-bold text-amber-800 flex items-center gap-0.5 hover:underline">
                    View All <FiChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
                  {recommendedProducts.map((prod) => (
                    <Link
                      key={prod.id || prod.productId}
                      to={`/product/${prod.slug || prod.id}`}
                      className="group rounded-xl bg-white border border-stone-200/60 p-2 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-50 mb-1.5">
                        <img
                          src={getOrderItemImage(prod)}
                          alt={getOrderItemName(prod)}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <h4 className="text-xs font-semibold text-stone-900 line-clamp-1 leading-snug">
                        {getOrderItemName(prod)}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

        ) : (
          /* ── ORDER LIST — flat divider-separated rows ── */
          <AnimatePresence mode="popLayout">
            <div className="divide-y divide-stone-200/70">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            5. PAGINATION
            ══════════════════════════════════════════════════════════════════ */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-5 mt-4 border-t border-stone-200/70">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => updateParam('page', (page - 1).toString())}
              className="inline-flex items-center justify-center h-[40px] px-4 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-sm active:scale-[0.97] transition-all"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-stone-500 font-display">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => updateParam('page', (page + 1).toString())}
              className="inline-flex items-center justify-center h-[40px] px-4 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-sm active:scale-[0.97] transition-all"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
});
