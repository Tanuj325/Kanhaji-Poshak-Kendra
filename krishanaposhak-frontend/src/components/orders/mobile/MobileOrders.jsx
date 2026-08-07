import { useState, useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiSearch,
  FiChevronRight,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiFilter,
  FiX,
  FiShoppingBag,
  FiArrowRight,
  FiSliders,
  FiCreditCard,
} from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { useFeaturedProducts } from '@/hooks/useProducts';

// Status badge color map - Ultra-compact status pills
const getStatusBadgeStyle = (status) => {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'PROCESSING':
    case 'PACKING':
    case 'PACKED':
    case 'CONFIRMED':
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return 'bg-sky-50 text-sky-700 border-sky-200/80';
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    case 'PENDING':
    default:
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return FiCheckCircle;
    case 'PROCESSING':
    case 'PACKING':
    case 'PACKED':
    case 'CONFIRMED':
      return FiPackage;
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return FiTruck;
    case 'CANCELLED':
      return FiXCircle;
    case 'PENDING':
    default:
      return FiClock;
  }
};

const statusFilterTabs = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PACKING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

/**
 * Compact Empty Orders Artwork
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
 * Mobile & Tablet High-Density Compact Orders Component
 * Ultra-sleek, zero wasted space, luxury mobile-first UX.
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
    <div className="w-full h-full min-h-screen max-w-full bg-stone-50/70 pb-20 font-sans text-stone-900 flex flex-col">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. SLEEK COMPACT HEADER (48px) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex h-[48px] min-h-[48px] w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-1 md:px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/account/profile')}
            className="flex h-7 w-7 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="text-lg font-bold text-stone-900 font-display tracking-tight leading-none">
            My Orders
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${showSearch ? 'bg-amber-100 text-amber-900' : 'text-stone-700 hover:bg-stone-100'
              }`}
            aria-label="Toggle search"
          >
            <FiSearch className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowFiltersDrawer((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all relative ${status || paymentStatus
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
            className="overflow-hidden border-b border-stone-200 bg-white px-3 md:px-6 py-2 shadow-2xs"
          >
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by Order # or Product Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 pl-9 pr-8 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none transition-all"
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
      {/* 2. COMPACT STATUS FILTER PILLS (34px HEIGHT) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto bg-white px-3 md:px-6 py-1.5 border-b border-stone-200/60 whitespace-nowrap">
        {statusFilterTabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.value || 'all'}
              type="button"
              onClick={() => updateParam('status', tab.value)}
              className={`shrink-0 h-[32px] rounded-full px-3 text-[12px] transition-all flex items-center justify-center ${isActive
                ? 'bg-amber-950 text-white font-bold border border-amber-900 shadow-2xs'
                : 'bg-stone-100/80 text-stone-600 border border-transparent hover:bg-stone-200/60 font-medium'
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
            className="overflow-hidden border-b border-stone-200 bg-amber-50/40 px-3 md:px-6 py-2.5 text-xs"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-900/10">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-[12px]">
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
      {/* 3. TIGHT ORDER SUMMARY BAR */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-stone-100/60 px-3.5 md:px-6 py-1 border-b border-stone-200/50 flex items-center justify-between text-[11px] text-stone-500 font-medium">
        <span>Showing {orders.length} of {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}</span>
        {status && (
          <span className="font-semibold text-amber-900">
            Status: {status}
          </span>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="w-full max-w-full px-1 md:px-4 py-2.5 space-y-2.5 flex-1">
        {/* LOADING SKELETON */}
        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="w-full rounded-2xl bg-white p-3 border border-stone-200/80 shadow-2xs flex flex-col gap-2 animate-pulse"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                  <div className="h-3.5 w-28 bg-stone-200 rounded-md" />
                  <div className="h-4 w-16 bg-stone-200 rounded-full" />
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-[72px] w-[72px] rounded-xl bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-1.5 py-0.5">
                    <div className="h-3 w-16 bg-stone-200 rounded-md" />
                    <div className="h-3.5 w-3/4 bg-stone-200 rounded-md" />
                    <div className="h-3 w-1/3 bg-stone-200 rounded-md" />
                    <div className="h-4 w-20 bg-stone-200 rounded-md mt-1" />
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                  <div className="h-3.5 w-20 bg-stone-200 rounded-md" />
                  <div className="h-[38px] w-full bg-stone-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          /* ERROR STATE */
          <div className="rounded-2xl bg-rose-50/70 p-5 text-center border border-rose-200 shadow-2xs my-3">
            <FiXCircle className="h-8 w-8 text-rose-600 mx-auto mb-1.5" />
            <h3 className="text-sm font-bold text-rose-900 font-display">Failed to load orders</h3>
            <p className="text-[11px] text-rose-700 mt-0.5 mb-3">{error?.message || 'Please check your connection and try again.'}</p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-900 text-white font-bold text-xs px-4 py-2 min-h-[38px]"
            >
              <FiRefreshCw className="h-3.5 w-3.5" /> Retry Loading
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY STATE WITH RECOMMENDATIONS */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 pt-1"
          >
            <div className="rounded-2xl bg-white p-5 md:p-6 text-center border border-stone-200/80 shadow-2xs">
              <EmptyOrdersIllustration />
              <h2 className="text-lg font-bold text-stone-900 font-display mt-1">No Orders Yet</h2>
              <p className="text-[11px] text-stone-500 mt-0.5 max-w-xs mx-auto leading-relaxed font-body">
                {status || paymentStatus || searchTerm
                  ? 'No orders match your active filter criteria. Try clearing search filters.'
                  : "You haven't placed any orders with Krishana Poshak yet."}
              </p>
              <div className="mt-4">
                <Link to="/shop">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white font-bold text-xs px-5 py-2.5 min-h-[40px] shadow-sm hover:shadow-md active:scale-98 transition-all"
                  >
                    <FiShoppingBag className="h-3.5 w-3.5 text-amber-300" />
                    <span>Start Shopping</span>
                    <FiArrowRight className="h-3.5 w-3.5 text-amber-300" />
                  </button>
                </Link>
              </div>
            </div>

            {/* RECOMMENDED PRODUCTS SECTION */}
            {recommendedProducts.length > 0 && (
              <div className="pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900 font-display flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" /> Recommended For Your Deity
                  </h3>
                  <Link to="/shop" className="text-[11px] font-bold text-amber-800 flex items-center gap-0.5 hover:underline">
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
                          src={prod.imageUrl || (Array.isArray(prod.images) ? prod.images[0]?.imageUrl || prod.images[0] : '/placeholder.svg')}
                          alt={prod.name || 'Product'}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">KRISHANA POSHAK</p>
                        <h4 className="text-[11px] font-semibold text-stone-900 line-clamp-1 leading-tight">{prod.name || prod.productName}</h4>
                        <p className="text-xs font-bold text-amber-950 font-display mt-0.5">{formatPrice(prod.price || prod.discountPrice || 0)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════════════════════════ */
          /* 4. SLEEK HIGH-DENSITY ORDER CARDS */
          /* ══════════════════════════════════════════════════════════════ */
          <AnimatePresence mode="popLayout">
            <div className="space-y-2.5">
              {orders.map((order) => {
                const itemsList = order.items || [];
                const StatusIcon = getStatusIcon(order.orderStatus);
                const badgeStyle = getStatusBadgeStyle(order.orderStatus);

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="group relative w-full rounded-2xl bg-white p-3 md:p-4 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 space-y-2"
                  >
                    {/* CARD HEADER: ORDER ID, DATE, STATUS BADGE */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-stone-800 font-display truncate max-w-[150px] xs:max-w-[190px] sm:max-w-xs">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium shrink-0">
                          • {order.orderDate ? formatDate(order.orderDate, { format: 'date' }) : ''}
                        </span>
                      </div>

                      {/* STATUS BADGE PILL */}
                      <span className={`flex flex-col items-right gap-1 rounded-md px-1 py-0.5 text-[10px] font-bold border shrink-0 ${badgeStyle}`}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        <span>{order.orderStatus || 'PENDING'}</span>
                      </span>
                    </div>

                    {/* PRODUCTS LIST */}
                    <Link to={`/account/orders/${order.id}`} className="block group/link space-y-2">
                      {itemsList.length > 0 ? (
                        itemsList.map((item, itemIdx) => (
                          <div
                            key={item.id || itemIdx}
                            className={`flex items-start gap-2.5 ${itemIdx > 0 ? 'pt-2 border-t border-stone-100/70' : ''
                              }`}
                          >
                            {/* PRODUCT IMAGE: 72px mobile, 80px tablet */}
                            <div className="relative h-[72px] w-[72px] min-w-[72px] md:h-[80px] md:w-[80px] md:min-w-[80px] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 shrink-0">
                              <img
                                src={item.imageUrl || '/placeholder.svg'}
                                alt={item.productName || 'Product'}
                                className="h-full w-full object-cover group-hover/link:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans leading-none">
                                KRISHANA POSHAK
                              </p>
                              <h3 className="text-[13px] font-semibold text-stone-900 line-clamp-1 leading-tight font-sans group-hover/link:text-amber-900 transition-colors">
                                {item.productName || `Product #${itemIdx + 1}`}
                              </h3>
                              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                                {item.size && <span>Size: {item.size}</span>}
                                {item.size && <span>•</span>}
                                <span>Qty: {item.quantity || 1}</span>
                              </div>
                              <p className="text-[15px] font-bold text-amber-950 font-display pt-0.5">
                                {formatPrice(item.price || item.unitPrice || (itemsList.length === 1 ? order.totalAmount : 0))}
                              </p>
                            </div>

                            {/* CHEVRON */}
                            <div className="self-center pl-0.5 shrink-0">
                              <FiChevronRight className="h-4.5 w-4.5 text-stone-400 group-hover/link:text-amber-900 group-hover/link:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xs font-semibold text-stone-900">Order #{order.orderNumber}</h3>
                            <p className="text-[11px] text-stone-500">Total: {formatPrice(order.totalAmount)}</p>
                          </div>
                          <FiChevronRight className="h-4 w-4 text-stone-400" />
                        </div>
                      )}
                    </Link>

                    {/* TOTAL & PAYMENT DIVIDER ROW */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Total</span>
                        <span className="text-[15px] font-bold text-amber-950 font-display">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>

                      <div className="text-right">
                        {order.paymentStatus && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500">
                            <FiCreditCard className="h-3 w-3 text-stone-400" />
                            <span>{order.paymentStatus === 'COMPLETED' ? 'Paid' : order.paymentStatus}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* VIEW DETAILS BUTTON (SLEEK 38PX BUTTON) */}
                    <div className="pt-1.5 flex flex-col sm:flex-row items-center gap-1.5">
                      {itemsList.length > 0 && itemsList[0]?.variantId && (
                        <button
                          type="button"
                          onClick={() => handleBuyAgain(order)}
                          disabled={buyingAgainId === order.id}
                          className="w-full sm:w-auto h-[38px] min-h-[38px] px-3.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-50 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <FiRefreshCw className={`h-3.5 w-3.5 text-amber-800 ${buyingAgainId === order.id ? 'animate-spin' : ''}`} />
                          <span>Buy Again</span>
                        </button>
                      )}

                      <Link to={`/account/orders/${order.id}`} className="w-full">
                        <button
                          type="button"
                          className="w-full h-[38px] min-h-[38px] rounded-xl bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white text-xs font-bold shadow-2xs hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>View Details</span>
                          <FiArrowRight className="h-3.5 w-3.5 text-amber-300" />
                        </button>
                      </Link>
                    </div>
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
          <div className="flex items-center justify-between pt-3 border-t border-stone-200/70">
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
