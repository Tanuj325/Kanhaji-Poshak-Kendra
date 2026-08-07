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
import { formatPrice } from '@/utils/formatPrice';
import { useFeaturedProducts } from '@/hooks/useProducts';

const statusFilterTabs = [
  { value: '', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PACKING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

/**
 * Generates clear, readable status heading matching modern e-commerce apps
 * Example: "Delivered on 06 Aug, 2026", "Order Placed on 06 Aug, 2026", "Processing Order"
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
    <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-3">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FBF6ED] to-[#F5EAD6]" />
      <div className="absolute top-2 right-4 text-[#D49E41] text-xs animate-pulse">✨</div>
      <svg className="relative z-10 w-24 h-24" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="50" width="60" height="50" rx="8" fill="#FAF3E6" stroke="#7A5825" strokeWidth="2.2" />
        <path d="M25 42C25 39.7909 26.7909 38 29 38H91C93.2091 38 95 39.7909 95 42V50H25V42Z" fill="#EFE2CD" stroke="#7A5825" strokeWidth="2.2" />
        <rect x="54" y="38" width="12" height="62" fill="#D49E41" fillOpacity="0.8" />
        <circle cx="60" cy="75" r="11" fill="#FFFFFF" stroke="#7A5825" strokeWidth="1.8" />
      </svg>
    </div>
  );
}

/**
 * Mobile & Tablet Horizontal Order List UI Component (<1024px)
 * Designed strictly matching reference layout: Large image + Heading/Product/Price beside + Right Chevron.
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
    <div className="w-full min-h-screen max-w-full bg-white pb-28 font-sans text-stone-900 flex flex-col">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. PAGE HEADER */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex h-[54px] min-h-[54px] w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 md:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/account/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-800 hover:bg-stone-100 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[20px] md:text-[22px] font-bold text-stone-900 font-display tracking-tight leading-none">
            My Orders
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              showSearch ? 'bg-amber-100 text-amber-900' : 'text-stone-700 hover:bg-stone-100'
            }`}
            aria-label="Toggle search"
          >
            <FiSearch className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowFiltersDrawer((prev) => !prev)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all relative ${
              status || paymentStatus
                ? 'bg-amber-950 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
            aria-label="Filter orders"
          >
            <FiFilter className="h-4 w-4" />
            {(status || paymentStatus) && (
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-stone-200 bg-white px-4 md:px-6 py-2.5 shadow-2xs"
          >
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by Order # or Product Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-9 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-800 focus:bg-white focus:outline-none transition-all"
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

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. HORIZONTAL STATUS FILTER TABS */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto bg-white px-4 md:px-6 py-2 border-b border-stone-200/80 shadow-2xs whitespace-nowrap">
        {statusFilterTabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.value || 'all'}
              type="button"
              onClick={() => updateParam('status', tab.value)}
              className={`shrink-0 h-[38px] min-h-[38px] rounded-full px-4 text-xs transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 border border-transparent hover:bg-stone-200/70 font-semibold'
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
            className="overflow-hidden border-b border-stone-200 bg-stone-50 px-4 md:px-6 py-3 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 text-[13px]">
                <FiSliders className="h-4 w-4 text-amber-800" /> Filter & Sort Orders
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

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => updateParam('paymentStatus', e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white py-2 px-2.5 text-xs text-stone-800 focus:outline-none"
                >
                  <option value="">All Payments</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Sort Orders</label>
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white py-2 px-2.5 text-xs text-stone-800 focus:outline-none"
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
      <div className="w-full bg-stone-50/80 px-4 md:px-6 py-2 border-b border-stone-200/60 flex items-center justify-between text-xs text-stone-500 font-medium">
        <span>Showing {orders.length} of {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}</span>
        {status && (
          <span className="font-bold text-amber-900">
            Filter: {status}
          </span>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA — CONTINUOUS HORIZONTAL LIST */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="w-full max-w-full px-4 md:px-6 flex-1">
        {/* LOADING SKELETON ROW */}
        {isLoading ? (
          <div className="divide-y divide-stone-200/80">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="py-4 flex items-center gap-3.5 md:gap-4 animate-pulse">
                <div className="h-[96px] w-[96px] md:h-[110px] md:w-[110px] rounded-[16px] bg-stone-200 shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 bg-stone-200 rounded-md" />
                  <div className="h-3 w-1/3 bg-stone-200 rounded-md" />
                  <div className="h-4 w-1/2 bg-stone-200 rounded-md" />
                  <div className="h-4 w-1/4 bg-stone-200 rounded-md mt-1" />
                </div>
                <div className="h-6 w-6 bg-stone-200 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* ERROR STATE */
          <div className="rounded-2xl bg-rose-50/70 p-6 text-center border border-rose-200 shadow-2xs my-6">
            <FiXCircle className="h-10 w-10 text-rose-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-rose-900 font-display">Failed to load orders</h3>
            <p className="text-xs text-rose-700 mt-1 mb-4">{error?.message || 'Please check your connection and try again.'}</p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-900 text-white font-bold text-xs px-5 py-2.5 min-h-[44px]"
            >
              <FiRefreshCw className="h-4 w-4" /> Retry Loading
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 py-6"
          >
            <div className="rounded-2xl bg-stone-50/60 p-6 md:p-8 text-center border border-stone-200/70">
              <EmptyOrdersIllustration />
              <h2 className="text-[20px] md:text-[22px] font-bold text-stone-900 font-display mt-2">No Orders Yet</h2>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed font-body">
                {status || paymentStatus || searchTerm
                  ? 'No orders match your active filter criteria. Try clearing search filters.'
                  : "Your orders will appear here after you make a purchase."}
              </p>
              <div className="mt-5">
                <Link to="/shop">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white font-bold text-xs px-6 py-3 min-h-[44px] shadow-md hover:shadow-lg active:scale-98 transition-all"
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
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900 font-display flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-600" /> Recommended For Your Deity
                  </h3>
                  <Link to="/shop" className="text-xs font-bold text-amber-800 flex items-center gap-1 hover:underline">
                    View All <FiChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {recommendedProducts.map((prod) => (
                    <Link
                      key={prod.id || prod.productId}
                      to={`/product/${prod.slug || prod.id}`}
                      className="group rounded-2xl bg-white border border-stone-200/60 p-2.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100 mb-2">
                        <img
                          src={prod.imageUrl || (Array.isArray(prod.images) ? prod.images[0]?.imageUrl || prod.images[0] : '/placeholder.svg')}
                          alt={prod.name || 'Product'}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">KRISHANA POSHAK</p>
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1 leading-snug">{prod.name || prod.productName}</h4>
                        <p className="text-[16px] font-bold text-amber-950 font-display mt-1">{formatPrice(prod.price || prod.discountPrice || 0)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════════════════════════ */
          /* CONTINUOUS HORIZONTAL ORDER HISTORY LIST (MATCHING REFERENCE IMAGE) */
          /* ══════════════════════════════════════════════════════════════ */
          <AnimatePresence mode="popLayout">
            <div className="divide-y divide-stone-200/80">
              {orders.map((order) => {
                const itemsList = order.items || [];
                const firstItem = itemsList[0] || {};
                const extraCount = itemsList.length > 1 ? itemsList.length - 1 : 0;
                const totalQty = itemsList.reduce((acc, item) => acc + (item.quantity || 1), 0) || 1;
                const statusHeading = getStatusHeading(order);

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="group block w-full py-4 hover:bg-stone-50/60 transition-colors rounded-xl px-1"
                    >
                      <div className="flex items-center gap-3.5 md:gap-4 w-full">
                        {/* LARGE SQUARE PRODUCT IMAGE (96px mobile, 110px tablet) */}
                        <div className="relative h-[96px] w-[96px] min-w-[96px] md:h-[110px] md:w-[110px] md:min-w-[110px] rounded-[16px] overflow-hidden bg-stone-100 border border-stone-200/60 shadow-2xs shrink-0">
                          <img
                            src={firstItem.imageUrl || '/placeholder.svg'}
                            alt={firstItem.productName || 'Product'}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {extraCount > 0 && (
                            <span className="absolute bottom-1 right-1 rounded-md bg-stone-900/85 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                              +{extraCount} more
                            </span>
                          )}
                        </div>

                        {/* CONTENT AREA (FLEX 1, MIN-W-0) */}
                        <div className="flex-1 min-w-0 pr-1 space-y-0.5">
                          {/* STATUS / DATE HEADING (16-18px BOLD) */}
                          <h3 className="text-[16px] md:text-[18px] font-bold text-stone-900 font-display leading-snug truncate">
                            {statusHeading}
                          </h3>

                          {/* BRAND / CATEGORY */}
                          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-amber-900/70 font-sans leading-none pt-0.5">
                            KRISHANA POSHAK
                          </p>

                          {/* PRODUCT NAME (14-15px, LINE-CLAMP-2) */}
                          <p className="text-[14px] md:text-[15px] font-medium text-stone-700 line-clamp-2 leading-snug font-sans">
                            {firstItem.productName || `Order #${order.orderNumber}`}
                            {extraCount > 0 && ` (+${extraCount} more items)`}
                          </p>

                          {/* QUANTITY & PRICE (Qty 1 • ₹350) */}
                          <div className="flex items-center gap-2 text-xs md:text-sm text-stone-500 font-medium font-sans pt-1">
                            <span>Qty: {totalQty}</span>
                            <span>•</span>
                            <span className="text-[16px] md:text-[18px] font-bold text-amber-950 font-display">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT CHEVRON ARROW (22-26px) */}
                        <div className="shrink-0 pl-1">
                          <FiChevronRight className="h-6 w-6 text-stone-800 group-hover:translate-x-1 transition-transform" />
                        </div>
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
          <div className="flex items-center justify-between py-6 border-t border-stone-200/80 mt-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => updateParam('page', (page - 1).toString())}
              className="inline-flex items-center justify-center h-[42px] min-h-[42px] px-4 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-2xs"
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
              className="inline-flex items-center justify-center h-[42px] min-h-[42px] px-4 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-2xs"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
});
