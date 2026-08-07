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
  FiCalendar,
} from 'react-icons/fi';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { useFeaturedProducts } from '@/hooks/useProducts';

// Status badge color map - Premium subtle status pills with 11-12px font size
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
 * Luxury Empty Orders Illustration
 * Vector artwork matching Krishna Poshak aesthetic: Soft warm circle, luxury shopping box & Mor Pankh accent
 */
function EmptyOrdersIllustration() {
  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-3">
      {/* Background Soft Gold Circle */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FBF6ED] to-[#F5EAD6]" />

      {/* Sparkles */}
      <div className="absolute top-2 right-4 text-[#D49E41] text-xs animate-pulse">✨</div>
      <div className="absolute bottom-4 left-4 text-[#D49E41] text-[10px]">✨</div>

      {/* SVG Artwork */}
      <svg className="relative z-10 w-28 h-28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Box Base */}
        <rect x="30" y="50" width="60" height="50" rx="8" fill="#FAF3E6" stroke="#7A5825" strokeWidth="2.2" />
        {/* Box Lid */}
        <path d="M25 42C25 39.7909 26.7909 38 29 38H91C93.2091 38 95 39.7909 95 42V50H25V42Z" fill="#EFE2CD" stroke="#7A5825" strokeWidth="2.2" />
        {/* Gold Ribbon Vertical */}
        <rect x="54" y="38" width="12" height="62" fill="#D49E41" fillOpacity="0.8" />
        {/* Ribbon Bow */}
        <path d="M60 38C52 28 42 32 48 38Z" fill="#C68D33" stroke="#7A5825" strokeWidth="1.5" />
        <path d="M60 38C68 28 78 32 72 38Z" fill="#C68D33" stroke="#7A5825" strokeWidth="1.5" />
        {/* Shopping Bag Icon Accent */}
        <circle cx="60" cy="75" r="12" fill="#FFFFFF" stroke="#7A5825" strokeWidth="1.8" />
        <path d="M56 73V71C56 68.7909 57.7909 67 60 67C62.2091 67 64 68.7909 64 71V73M54 73H66L67 81H53L54 73Z" stroke="#7A5825" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mor Pankh Accent */}
        <g transform="translate(68, 16) rotate(25)">
          <path d="M4 48Q12 28 24 4" stroke="#3F5C39" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="22" cy="8" rx="8" ry="11" fill="#1B5641" transform="rotate(-20 22 8)" />
          <ellipse cx="22" cy="8" rx="5.5" ry="8" fill="#D99B26" transform="rotate(-20 22 8)" />
          <ellipse cx="22" cy="8" rx="3" ry="5" fill="#1D4A7E" transform="rotate(-20 22 8)" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Mobile & Tablet Rebuilt Orders Page Component
 * Occupies 100% available screen width & height as a full-screen page (no modals/drawers)
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
    <div className="w-full min-h-screen max-w-full bg-stone-50/60 pb-20 font-sans text-stone-900 flex flex-col">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* STICKY HEADER (56px) */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 flex h-[56px] min-h-[56px] w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 md:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/account/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] md:text-[22px] font-bold text-stone-900 font-display tracking-tight leading-none">
              My Orders
            </h1>
          </div>
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
            <FiSearch className="h-5 w-5" />
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
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
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
            className="overflow-hidden border-b border-stone-200 bg-white px-4 md:px-6 py-2.5 shadow-xs"
          >
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by Order # or Product Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-9 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-700 focus:bg-white focus:outline-none transition-all"
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
      {/* ORDER SUMMARY BAR */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-white px-4 md:px-6 py-3 border-b border-stone-200/60 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Account</span>
          <h2 className="text-[20px] md:text-[22px] font-bold text-stone-900 font-display leading-tight">
            My Orders
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-full bg-amber-100/80 px-3 py-1 text-[12px] font-bold text-amber-900 border border-amber-300/50">
            {totalOrders} {totalOrders === 1 ? 'Order' : 'Orders'}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HORIZONTAL STATUS FILTER PILLS */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto bg-white px-4 md:px-6 py-2.5 border-b border-stone-200/60 shadow-2xs">
        {statusFilterTabs.map((tab) => {
          const isActive = status === tab.value;
          return (
            <button
              key={tab.value || 'all'}
              type="button"
              onClick={() => updateParam('status', tab.value)}
              className={`shrink-0 h-[36px] min-h-[36px] rounded-full px-4 text-[12px] md:text-[13px] transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-amber-950 text-white font-bold border border-amber-900 shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50 font-medium'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* EXPANDABLE FILTER & SORT ROW */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showFiltersDrawer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-stone-200 bg-amber-50/40 px-4 md:px-6 py-3 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/10">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-[13px]">
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
      {/* MAIN CONTENT AREA */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <main className="w-full max-w-full px-4 md:px-6 py-4 space-y-3 flex-1">
        {/* LOADING STATE SKELETON */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="w-full rounded-[18px] bg-white p-[14px] md:p-4 border border-stone-200/70 shadow-2xs flex flex-col gap-3 animate-pulse"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="h-4 w-28 bg-stone-200 rounded-md" />
                  <div className="h-5 w-20 bg-stone-200 rounded-full" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-[84px] w-[84px] rounded-[14px] bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-2 py-0.5">
                    <div className="h-3 w-20 bg-stone-200 rounded-md" />
                    <div className="h-4 w-3/4 bg-stone-200 rounded-md" />
                    <div className="h-3 w-1/3 bg-stone-200 rounded-md" />
                    <div className="h-5 w-24 bg-stone-200 rounded-md mt-1" />
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-end gap-2">
                  <div className="h-[40px] w-24 bg-stone-200 rounded-[12px]" />
                  <div className="h-[40px] w-28 bg-stone-200 rounded-[12px]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          /* ERROR STATE */
          <div className="rounded-[18px] bg-rose-50/70 p-6 text-center border border-rose-200 shadow-2xs my-4">
            <FiXCircle className="h-10 w-10 text-rose-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-rose-900 font-display">Failed to load orders</h3>
            <p className="text-xs text-rose-700 mt-1 mb-4">{error?.message || 'Please check your connection and try again.'}</p>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-[12px] bg-rose-900 text-white font-bold text-xs px-4 py-2.5 min-h-[42px]"
            >
              <FiRefreshCw className="h-4 w-4" /> Retry Loading
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* ══════════════════════════════════════════════════════════════ */
          /* EMPTY ORDERS STATE WITH RECOMMENDATIONS */
          /* ══════════════════════════════════════════════════════════════ */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pt-2"
          >
            <div className="rounded-[18px] bg-white p-6 text-center border border-stone-200/70 shadow-xs">
              <EmptyOrdersIllustration />
              <h2 className="text-[20px] md:text-[22px] font-bold text-stone-900 font-display mt-2">No Orders Yet</h2>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed font-body">
                {status || paymentStatus || searchTerm
                  ? 'No orders match your active filter criteria. Try clearing search filters.'
                  : "You haven't placed any orders with Krishana Poshak yet. Explore our divine attire & jewellery collection."}
              </p>
              <div className="mt-5">
                <Link to="/shop">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 text-white font-bold text-xs px-6 py-3 min-h-[44px] shadow-md hover:shadow-lg active:scale-98 transition-all"
                  >
                    <FiShoppingBag className="h-4 w-4 text-amber-300" />
                    <span>Start Shopping</span>
                    <FiArrowRight className="h-4 w-4 text-amber-300" />
                  </button>
                </Link>
              </div>
            </div>

            {/* RECOMMENDED PRODUCTS SECTION */}
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
                        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">KRISHANA POSHAK</p>
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
          /* REBUILT PREMIUM ORDER CARDS LIST */
          /* ══════════════════════════════════════════════════════════════ */
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {orders.map((order) => {
                const itemsList = order.items || [];
                const firstItem = itemsList[0] || {};
                const StatusIcon = getStatusIcon(order.orderStatus);
                const badgeStyle = getStatusBadgeStyle(order.orderStatus);
                const extraItemsCount = itemsList.length > 1 ? itemsList.length - 1 : 0;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="group relative w-full rounded-[18px] bg-white p-[14px] md:p-4 border border-stone-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all duration-200 space-y-3"
                  >
                    {/* ORDER CARD HEADER: Order #, Date, Status Badge */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-bold text-stone-900 font-display">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-[11px] md:text-[12px] text-stone-500 font-medium">
                          Placed on {order.orderDate ? formatDate(order.orderDate, { format: 'date' }) : 'N/A'}
                        </span>
                      </div>

                      {/* STATUS BADGE */}
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] md:text-[12px] font-bold border shrink-0 ${badgeStyle}`}>
                        <StatusIcon className="h-3 w-3" />
                        <span>{order.orderStatus || 'PENDING'}</span>
                      </span>
                    </div>

                    {/* PRODUCT PREVIEW */}
                    <Link to={`/account/orders/${order.id}`} className="block group">
                      <div className="flex items-start gap-3">
                        {/* PRODUCT IMAGE: 84px Square rounded 14px */}
                        <div className="relative h-[84px] w-[84px] min-w-[84px] rounded-[14px] overflow-hidden bg-stone-100 border border-stone-200/60 shrink-0">
                          <img
                            src={firstItem.imageUrl || '/placeholder.svg'}
                            alt={firstItem.productName || 'Product'}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {extraItemsCount > 0 && (
                            <span className="absolute bottom-1 right-1 rounded-md bg-stone-900/85 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                              +{extraItemsCount} more
                            </span>
                          )}
                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-sans leading-none">
                            KRISHANA POSHAK
                          </p>
                          <h3 className="text-[14px] md:text-[15px] font-semibold text-stone-900 line-clamp-2 leading-snug font-sans group-hover:text-amber-900 transition-colors">
                            {firstItem.productName || `Order #${order.orderNumber}`}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] md:text-[12px] text-stone-500 font-medium">
                            {firstItem.size && <span>Size: {firstItem.size}</span>}
                            {firstItem.size && <span>•</span>}
                            <span>Qty: {firstItem.quantity || 1}</span>
                          </div>

                          {/* PRICE & DELIVERY METADATA */}
                          <div className="flex items-baseline justify-between pt-0.5 flex-wrap gap-1">
                            <p className="text-[16px] md:text-[18px] font-bold text-amber-950 font-display">
                              {formatPrice(order.totalAmount)}
                            </p>
                            {order.deliveredDate ? (
                              <span className="text-[11px] text-emerald-700 font-semibold">
                                Delivered on {formatDate(order.deliveredDate, { format: 'date' })}
                              </span>
                            ) : order.orderStatus === 'CANCELLED' ? (
                              <span className="text-[11px] text-rose-600 font-medium">Order Cancelled</span>
                            ) : null}
                          </div>
                        </div>

                        {/* CHEVRON */}
                        <div className="self-center pl-1 shrink-0">
                          <FiChevronRight className="h-5 w-5 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </Link>

                    {/* CARD ACTIONS */}
                    <div className="pt-2.5 border-t border-stone-100 flex items-center justify-end gap-2.5">
                      {itemsList.length > 0 && firstItem.variantId && (
                        <button
                          type="button"
                          onClick={() => handleBuyAgain(order)}
                          disabled={buyingAgainId === order.id}
                          className="inline-flex items-center justify-center gap-1.5 h-[40px] px-4 rounded-[12px] border border-stone-200/90 bg-white text-[12px] font-bold text-stone-700 hover:bg-stone-50 active:scale-98 transition-all shadow-2xs"
                        >
                          <FiRefreshCw className={`h-3.5 w-3.5 text-amber-800 ${buyingAgainId === order.id ? 'animate-spin' : ''}`} />
                          <span>Buy Again</span>
                        </button>
                      )}

                      <Link to={`/account/orders/${order.id}`}>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-1 h-[40px] px-4 rounded-[12px] bg-gradient-to-r from-amber-900 via-amber-850 to-amber-950 text-white text-[12px] font-bold shadow-xs hover:brightness-105 active:scale-98 transition-all"
                        >
                          <span>View Details</span>
                          <FiChevronRight className="h-4 w-4" />
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
          <div className="flex items-center justify-between pt-4 border-t border-stone-200/70">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => updateParam('page', (page - 1).toString())}
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-2xs"
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
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 shadow-2xs"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
});
