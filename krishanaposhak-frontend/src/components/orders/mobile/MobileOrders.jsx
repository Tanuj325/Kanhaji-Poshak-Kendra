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

// Reliable SVG Data URL fallback to prevent any network 404 requests or infinite loops
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23F5F0E6'/%3E%3Cpath d='M35 45L50 30L65 45M35 55H65' stroke='%23D49E41' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

const statusFilterTabs = [
  { value: '', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PACKING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

/**
 * Multi-schema product image resolver that handles item.imageUrl, item.image, item.productImage, item.product.imageUrl etc.
 */
const getProductImageUrl = (item) => {
  if (!item) return FALLBACK_IMAGE;
  if (typeof item === 'string' && item.trim()) return item;

  const url =
    item.imageUrl ||
    item.image ||
    item.productImage ||
    item.product?.imageUrl ||
    item.product?.image ||
    item.variant?.imageUrl ||
    item.variantImageUrl ||
    (Array.isArray(item.images) ? item.images[0]?.imageUrl || item.images[0]?.url || item.images[0] : null) ||
    (Array.isArray(item.product?.images) ? item.product.images[0]?.imageUrl || item.product.images[0]?.url || item.product.images[0] : null);

  if (url && typeof url === 'string' && url.trim()) {
    return url;
  }

  return FALLBACK_IMAGE;
};

/**
 * Generates clear, readable status heading matching modern e-commerce apps
 * Examples: "Delivered on May 07, 2025", "Order Placed on Aug 06, 2026", "Refund Completed"
 */
const getStatusHeading = (order) => {
  const status = order?.orderStatus?.toUpperCase();
  const dateStr = order?.deliveredDate || order?.orderDate;
  const formattedDate = dateStr ? formatDate(dateStr, { format: 'date' }) : '';

  switch (status) {
    case 'DELIVERED':
      return formattedDate ? `Delivered on ${formattedDate}` : 'Delivered';
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return formattedDate ? `Shipped on ${formattedDate}` : 'Shipped';
    case 'PROCESSING':
    case 'PACKING':
    case 'PACKED':
    case 'CONFIRMED':
      return 'Processing Order';
    case 'CANCELLED':
      return 'Cancelled Order';
    case 'RETURNED':
      return 'Refund Completed';
    case 'PENDING':
    default:
      return formattedDate ? `Order Placed on ${formattedDate}` : `Order #${order.orderNumber}`;
  }
};

/**
 * Luxury Empty Orders Illustration
 */
function EmptyOrdersIllustration() {
  return (
    <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FBF6ED] to-[#F5EAD6]" />
      <div className="absolute top-2 right-3 text-[#D49E41] text-[10px] animate-pulse">✨</div>
      <svg className="relative z-10 w-20 h-20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="50" width="60" height="50" rx="8" fill="#FAF3E6" stroke="#7A5825" strokeWidth="2.2" />
        <path d="M25 42C25 39.7909 26.7909 38 29 38H91C93.2091 38 95 39.7909 95 42V50H25V42Z" fill="#EFE2CD" stroke="#7A5825" strokeWidth="2.2" />
        <rect x="54" y="38" width="12" height="62" fill="#D49E41" fillOpacity="0.8" />
        <circle cx="60" cy="75" r="10" fill="#FFFFFF" stroke="#7A5825" strokeWidth="1.8" />
      </svg>
    </div>
  );
}

/**
 * Premium Mobile & Tablet Orders Page Component (<1024px)
 * High-density layout matching reference image.
 * Desktop (>=1024px) remains 100% untouched.
 */
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
    <div className="w-full min-h-screen max-w-full bg-white pb-20 font-sans text-stone-900 flex flex-col">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. COMPACT PAGE HEADER (44px) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex h-[44px] min-h-[44px] w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-3 md:px-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/account/profile')}
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-800 hover:bg-stone-100 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="text-base font-bold text-stone-900 font-display tracking-tight leading-none">
            My Orders
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              showSearch ? 'bg-amber-100 text-amber-900' : 'text-stone-700 hover:bg-stone-100'
            }`}
            aria-label="Toggle search"
          >
            <FiSearch className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowFiltersDrawer((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all relative ${
              status || paymentStatus
                ? 'bg-amber-950 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
            aria-label="Filter orders"
          >
            <FiFilter className="h-3.5 w-3.5" />
            {(status || paymentStatus) && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* EXPANDABLE SEARCH BAR */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-b border-stone-200 bg-white px-3 md:px-5 py-2 shadow-2xs"
          >
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by Order # or Product Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 pl-9 pr-8 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-800 focus:bg-white focus:outline-none transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-600"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. COMPACT STATUS FILTER PILLS (32px BAR) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto bg-white px-3 md:px-5 py-1.5 border-b border-stone-200/80 shadow-2xs whitespace-nowrap">
        {statusFilterTabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.value || 'all'}
              type="button"
              onClick={() => updateParam('status', tab.value)}
              className={`shrink-0 h-[28px] min-h-[28px] rounded-full px-3 text-[11px] transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white font-bold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 border border-transparent hover:bg-stone-200/70 font-medium'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* EXPANDABLE FILTER & SORT DRAWER */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFiltersDrawer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-stone-200 bg-stone-50 px-3 md:px-5 py-2.5 text-xs"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 text-[12px]">
                <FiSliders className="h-3.5 w-3.5 text-amber-800" /> Filter & Sort Orders
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
                  Clear Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => updateParam('paymentStatus', e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white py-1.5 px-2 text-xs text-stone-800 focus:outline-none"
                >
                  <option value="">All Payments</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Sort Orders</label>
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white py-1.5 px-2 text-xs text-stone-800 focus:outline-none"
                >
                  <option value="createdAt,desc">Newest First</option>
                  <option value="createdAt,asc">Oldest First</option>
                  <option value="totalAmount,desc">Price: High to Low</option>
                  <option value="totalAmount,asc">Price: Low to High</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. ORDER RESULT SUMMARY */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-stone-50/70 px-3 md:px-5 py-1 border-b border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500 font-medium">
        <span>Showing {orders.length} of {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}</span>
        {status && (
          <span className="font-bold text-amber-900">
            Filter: {status}
          </span>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA — REFERENCE-MATCHING HORIZONTAL ORDER LIST */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="w-full max-w-full px-2.5 md:px-5 flex-1">
        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="divide-y divide-stone-200/70">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="py-3 flex items-center gap-3 animate-pulse">
                <div className="h-[76px] w-[76px] md:h-[84px] md:w-[84px] rounded-xl bg-stone-200 shrink-0" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-4 w-1/2 bg-stone-200 rounded-md" />
                  <div className="h-3.5 w-3/4 bg-stone-200 rounded-md" />
                </div>
                <div className="h-5 w-5 bg-stone-200 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* ERROR STATE */
          <div className="rounded-xl bg-rose-50/70 p-5 text-center border border-rose-200 shadow-2xs my-4">
            <FiXCircle className="h-8 w-8 text-rose-600 mx-auto mb-1.5" />
            <h3 className="text-sm font-bold text-rose-900 font-display">Failed to load orders</h3>
            <p className="text-xs text-rose-700 mt-0.5 mb-3">{error?.message || 'Please check your connection and try again.'}</p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-900 text-white font-bold text-xs px-4 py-2 min-h-[38px]"
            >
              <FiRefreshCw className="h-3.5 w-3.5" /> Retry Loading
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 py-4"
          >
            <div className="rounded-xl bg-stone-50/60 p-5 md:p-6 text-center border border-stone-200/70">
              <EmptyOrdersIllustration />
              <h2 className="text-lg font-bold text-stone-900 font-display mt-1">No Orders Yet</h2>
              <p className="text-xs text-stone-500 mt-0.5 max-w-xs mx-auto leading-relaxed font-body">
                {status || paymentStatus || searchTerm
                  ? 'No orders match your active filter criteria. Try clearing search filters.'
                  : "Your orders will appear here after you make a purchase."}
              </p>
              <div className="mt-4">
                <Link to="/shop">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white font-bold text-xs px-5 py-2.5 min-h-[40px] shadow-sm hover:shadow-md active:scale-98 transition-all"
                  >
                    <FiShoppingBag className="h-4 w-4 text-amber-300" />
                    <span>Start Shopping</span>
                    <FiArrowRight className="h-4 w-4 text-amber-300" />
                  </button>
                </Link>
              </div>
            </div>

            {/* RECOMMENDED PRODUCTS */}
            {recommendedProducts.length > 0 && (
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900 font-display flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" /> Recommended For Your Deity
                  </h3>
                  <Link to="/shop" className="text-xs font-bold text-amber-800 flex items-center gap-0.5 hover:underline">
                    View All <FiChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {recommendedProducts.map((prod) => (
                    <Link
                      key={prod.id || prod.productId}
                      to={`/product/${prod.slug || prod.id}`}
                      className="group rounded-xl bg-white border border-stone-200/60 p-2 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-100 mb-1.5">
                        <img
                          src={getProductImageUrl(prod)}
                          alt={prod.name || prod.productName || 'Product'}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">KRISHANA POSHAK</p>
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1 leading-snug">{prod.name || prod.productName}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════════════════════════ */
          /* CONTINUOUS HORIZONTAL LIST MATCHING REFERENCE IMAGE DIRECTLY */
          /* ══════════════════════════════════════════════════════════════ */
          <AnimatePresence mode="popLayout">
            <div className="divide-y divide-stone-200/70">
              {orders.map((order) => {
                const itemsList = order.items || [];
                const firstItem = itemsList[0] || {};
                const extraCount = itemsList.length > 1 ? itemsList.length - 1 : 0;
                const statusHeading = getStatusHeading(order);
                const imageUrl = getProductImageUrl(firstItem);

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="group flex items-center gap-3 w-full py-3 px-1 hover:bg-stone-50/60 transition-colors"
                    >
                      {/* PRODUCT IMAGE (76px mobile, 84px tablet) */}
                      <div className="relative h-[76px] w-[76px] min-w-[76px] md:h-[84px] md:w-[84px] md:min-w-[84px] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 shadow-2xs shrink-0">
                        <img
                          src={imageUrl}
                          alt={firstItem.productName || firstItem.name || 'Product'}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                        {extraCount > 0 && (
                          <span className="absolute bottom-0.5 right-0.5 rounded-md bg-stone-900/85 backdrop-blur-xs px-1 py-0.5 text-[9px] font-bold text-white shadow-2xs">
                            +{extraCount}
                          </span>
                        )}
                      </div>

                      {/* CONTENT AREA (FLEX 1, MIN-W-0) */}
                      <div className="flex-1 min-w-0 pr-1 space-y-1">
                        {/* STATUS / DATE HEADING (15-16px BOLD) */}
                        <h3 className="text-[15px] md:text-[16px] font-bold text-stone-900 font-display leading-tight truncate">
                          {statusHeading}
                        </h3>

                        {/* ONLY PRODUCT NAME (13-14px REGULAR/MUTED) */}
                        <p className="text-[13px] md:text-[14px] font-normal text-stone-500 line-clamp-1 truncate font-sans">
                          {firstItem.productName || firstItem.name || `Order #${order.orderNumber}`}
                          {extraCount > 0 && ` (+${extraCount} more items)`}
                        </p>
                      </div>

                      {/* RIGHT CHEVRON ARROW */}
                      <div className="shrink-0 pl-1">
                        <FiChevronRight className="h-5 w-5 text-stone-900 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* MOBILE & TABLET PAGINATION */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between py-4 border-t border-stone-200/80 mt-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => updateParam('page', (page - 1).toString())}
              className="inline-flex items-center justify-center h-[38px] min-h-[38px] px-3.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-2xs"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-stone-600 font-display">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => updateParam('page', (page + 1).toString())}
              className="inline-flex items-center justify-center h-[38px] min-h-[38px] px-3.5 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-2xs"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
});
