import { useState, useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiStar,
  FiShare2,
  FiArrowRight,
  FiBookmark,
  FiAlertCircle,
  FiRefreshCw,
  FiPackage,
  FiCheck,
  FiTruck,
  FiGrid,
  FiList,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { siteConfig } from '@/config/siteConfig';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useFeaturedProducts } from '@/hooks/useProducts';

// Helper function to extract image URL safely
const resolveWishlistImage = (item) => {
  if (item?.imageUrl) return item.imageUrl;
  if (item?.image) return item.image;
  if (item?.productImageUrl) return item.productImageUrl;
  if (Array.isArray(item?.images) && item.images.length > 0) {
    const first = item.images[0];
    return typeof first === 'string' ? first : first?.imageUrl || first?.url;
  }
  if (item?.product) {
    if (item.product.imageUrl) return item.product.imageUrl;
    if (Array.isArray(item.product.images) && item.product.images.length > 0) {
      const first = item.product.images[0];
      return typeof first === 'string' ? first : first?.imageUrl || first?.url;
    }
  }
  return null;
};

/**
 * EmptyWishlistIllustration
 * Custom vector artwork matching the aesthetic:
 * Soft beige shopping bag with gold heart & peacock feather (Mor Pankh) detail.
 */
function EmptyWishlistIllustration() {
  return (
    <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
      {/* Background Soft Cream Circle */}
      <div className="absolute inset-0 rounded-full bg-[#FBF6ED]" />

      {/* Sparkles */}
      <div className="absolute top-3 right-6 text-[#D49E41] text-xs animate-pulse">✨</div>
      <div className="absolute bottom-8 left-5 text-[#D49E41] text-[10px]">✨</div>

      {/* Vector Canvas */}
      <svg className="relative z-10 w-32 h-32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shopping Bag Base */}
        <path
          d="M34 46L40 98C40 101.314 42.6863 104 46 104H74C77.3137 104 80 101.314 80 98L86 46H34Z"
          fill="#FAF3E6"
          stroke="#7A5825"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Side Shadow Fold */}
        <path
          d="M74 46L78 98C78 101.314 80.6863 104 84 104H86L80 46H74Z"
          fill="#EFE2CD"
          stroke="#7A5825"
          strokeWidth="1.8"
        />
        {/* Bag Handles */}
        <path
          d="M48 46V33C48 25.8203 53.8203 20 61 20C68.1797 20 74 25.8203 74 33V46"
          stroke="#5E4118"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Heart Symbol on Bag */}
        <path
          d="M60 76C60 76 46 66 46 57.5C46 53 49.5 49.5 54 49.5C56.8 49.5 59.2 51 60 53C60.8 51 63.2 49.5 66 49.5C70.5 49.5 74 53 74 57.5C74 66 60 76 60 76Z"
          fill="#C68D33"
        />

        {/* Peacock Feather (Mor Pankh) */}
        <g transform="translate(64, 28) rotate(22)">
          {/* Feather Stem */}
          <path d="M5 58Q14 34 28 6" stroke="#3F5C39" strokeWidth="2" strokeLinecap="round" />
          {/* Feather Eye Outer */}
          <ellipse cx="26" cy="10" rx="9" ry="13" fill="#1B5641" transform="rotate(-20 26 10)" />
          {/* Feather Eye Middle */}
          <ellipse cx="26" cy="10" rx="6.5" ry="9" fill="#D99B26" transform="rotate(-20 26 10)" />
          {/* Feather Eye Inner */}
          <ellipse cx="26" cy="10" rx="3.5" ry="5.5" fill="#1D4A7E" transform="rotate(-20 26 10)" />
          {/* Feather Fluffs */}
          <path d="M20 18C14 22 9 26 4 32" stroke="#3F5C39" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M28 18C33 24 38 28 42 34" stroke="#3F5C39" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

/**
 * MobileGridWishlistCard
 * Myntra / AJIO Style 2-Column Vertical Wishlist Card.
 * Ultra spacious layout with full width Move to Cart action bar.
 */
const MobileGridWishlistCard = memo(function MobileGridWishlistCard({
  item,
  onMoveToCart,
  onRemove,
  isItemMoving,
}) {
  const discountPercent = calculateDiscount(item.price, item.discountPrice);
  const isInStock = item.inStock !== false;
  const imgSrc = resolveWishlistImage(item);
  const variantId = item.variantId || item.productId;
  const activePrice = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
  const oldPrice = item.discountPrice && item.discountPrice < item.price ? item.price : null;
  const brandName = item.brand || item.product?.brand || item.product?.brandName || siteConfig.name;
  const rating = item.rating || item.product?.rating || 4.8;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-[18px] border border-[#EFECE6] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full font-sans relative group"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/4.5] w-full bg-[#F5F2ED] overflow-hidden">
        <Link to={`/product/${item.slug || item.productId}`} className="block w-full h-full">
          {imgSrc ? (
            <OptimizedImage
              src={imgSrc}
              alt={item.productName || 'Product'}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full p-4 text-stone-400">
              <FiPackage className="h-8 w-8 text-amber-700/40 mb-1" />
              <span className="text-[10px] font-bold text-stone-500">Poshak</span>
            </div>
          )}
        </Link>

        {/* Floating Remove Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={() => onRemove(variantId)}
          className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-xs text-stone-400 hover:text-rose-600 flex items-center justify-center shadow-xs transition-all"
          aria-label="Remove item"
        >
          <FiTrash2 className="h-3.5 w-3.5" />
        </motion.button>

        {/* Rating Pill Overlay */}
        <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-stone-800 px-1.5 py-0.5 rounded-md border border-stone-200 shadow-2xs flex items-center gap-0.5">
          <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#98631B] block line-clamp-1">
            {brandName}
          </span>
          <Link
            to={`/product/${item.slug || item.productId}`}
            className="text-[13px] font-semibold text-stone-900 line-clamp-1 leading-snug hover:text-amber-800 transition-colors block mt-0.5"
          >
            {item.productName || 'Divine Krishna Poshak'}
          </Link>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-1 flex-wrap font-sans">
          <span className="text-[15px] font-extrabold text-stone-900 leading-none">
            ₹{(activePrice || 0).toLocaleString('en-IN')}
          </span>
          {oldPrice && (
            <span className="text-[11px] text-stone-400 line-through">
              ₹{oldPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold text-emerald-600">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Bottom Move to Cart Full-Width Action Bar */}
      <div className="p-2 pt-0">
        <motion.button
          whileTap={isInStock && !isItemMoving ? { scale: 0.96 } : {}}
          type="button"
          disabled={!isInStock || isItemMoving}
          onClick={() => onMoveToCart(item)}
          className="w-full h-9 rounded-[12px] bg-gradient-to-r from-[#D49E41] to-[#C68D33] hover:from-[#C68D33] hover:to-[#B87E2B] text-white font-bold text-[12px] shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart className="h-3.5 w-3.5 text-white" />
          <span>{isItemMoving ? 'Moving...' : 'Move to Cart'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
});

/**
 * MobileHorizontalWishlistCard
 * Nike / Apple Store Style Horizontal Card.
 * Generous 2-Row layout: Top image + details, Bottom divider action bar.
 */
const MobileHorizontalWishlistCard = memo(function MobileHorizontalWishlistCard({
  item,
  onMoveToCart,
  onRemove,
  isItemMoving,
}) {
  const discountPercent = calculateDiscount(item.price, item.discountPrice);
  const isInStock = item.inStock !== false;
  const imgSrc = resolveWishlistImage(item);
  const variantId = item.variantId || item.productId;
  const activePrice = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
  const oldPrice = item.discountPrice && item.discountPrice < item.price ? item.price : null;
  const brandName = item.brand || item.product?.brand || item.product?.brandName || siteConfig.name;
  const rating = item.rating || item.product?.rating || 4.8;
  const reviewCount = item.reviewCount || item.product?.reviewCount || 128;
  const isNew = item.isNew || item.product?.isNew || false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.22 }}
      className="bg-white rounded-[18px] border border-[#EFECE6] p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3 w-full font-sans"
    >
      {/* Top Section: Left Image + Right Spacious Content */}
      <div className="flex gap-3.5 items-start">
        {/* Left Square Image (105x105) */}
        <div className="relative shrink-0 w-[105px] h-[105px]">
          <Link
            to={`/product/${item.slug || item.productId}`}
            className="w-[105px] h-[105px] rounded-[14px] overflow-hidden bg-[#F5F2ED] border border-stone-100 block"
          >
            {imgSrc ? (
              <OptimizedImage
                src={imgSrc}
                alt={item.productName || 'Product'}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full p-2 text-stone-400 bg-amber-50/40">
                <FiPackage className="h-7 w-7 text-amber-700/40 mb-1" />
                <span className="text-[9px] font-bold text-stone-500">Poshak</span>
              </div>
            )}
          </Link>

          {isNew && (
            <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-extrabold uppercase tracking-wider bg-[#C68D33] text-white px-1.5 py-0.5 rounded-md shadow-2xs">
              NEW
            </span>
          )}
        </div>

        {/* Right Details (Takes remaining 100% width) */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block line-clamp-1">
              {brandName}
            </span>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-800 bg-white border border-stone-200 px-1.5 py-0.5 rounded-md shadow-2xs">
              <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
              <span>{rating}</span>
            </div>
          </div>

          <Link
            to={`/product/${item.slug || item.productId}`}
            className="text-[14px] font-semibold text-stone-900 line-clamp-2 leading-snug hover:text-amber-800 transition-colors block"
          >
            {item.productName || 'Divine Krishna Poshak'}
          </Link>

          {/* Price Hierarchy */}
          <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
            <span className="text-[18px] font-bold text-stone-900 leading-none">
              ₹{(activePrice || 0).toLocaleString('en-IN')}
            </span>
            {oldPrice && (
              <span className="text-[12px] text-stone-400 line-through font-normal">
                ₹{oldPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Stock & Delivery line */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-0.5">
            {isInStock ? (
              <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                <FiCheck className="h-3 w-3 stroke-[3]" />
                <span>In Stock</span>
              </span>
            ) : (
              <span className="font-semibold text-rose-600">Out of Stock</span>
            )}
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-0.5 text-stone-500 font-medium">
              <FiTruck className="h-3 w-3 text-stone-400" />
              <span>Free Delivery</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Integrated Action Bar */}
      <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => onRemove(variantId)}
          className="text-[12px] font-medium text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer px-1 py-1"
          title="Remove item"
        >
          <FiTrash2 className="h-3.5 w-3.5 text-stone-400" />
          <span>Remove</span>
        </motion.button>

        <motion.button
          whileTap={isInStock && !isItemMoving ? { scale: 0.95 } : {}}
          type="button"
          disabled={!isInStock || isItemMoving}
          onClick={() => onMoveToCart(item)}
          className="h-[38px] px-4 rounded-[12px] bg-gradient-to-r from-[#D49E41] to-[#C68D33] hover:from-[#C68D33] hover:to-[#B87E2B] text-white font-bold text-[12px] shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart className="h-3.5 w-3.5 text-white" />
          <span>{isItemMoving ? 'Moving...' : 'Move to Cart'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
});

/**
 * MobileRecommendedCard
 * Product card for "You May Also Like" horizontal scroll section in Empty Wishlist view.
 */
function MobileRecommendedCard({ product }) {
  const navigate = useNavigate();
  const imgSrc = resolveWishlistImage(product);
  const activePrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const rating = product.rating || product.avgRating || 4.8;

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(`/product/${product.slug || product.id}`)}
      className="w-[140px] shrink-0 snap-start bg-white rounded-[14px] border border-[#EFECE6] p-2.5 cursor-pointer flex flex-col justify-between space-y-2 shadow-2xs font-sans"
    >
      <div className="space-y-1.5">
        <div className="aspect-square w-full rounded-[10px] bg-stone-50 overflow-hidden relative border border-stone-100">
          <OptimizedImage
            src={imgSrc}
            alt={product.name || 'Product'}
            className="h-full w-full object-cover object-center"
          />
          <button
            type="button"
            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 backdrop-blur-xs text-stone-600 flex items-center justify-center text-xs shadow-2xs"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FiHeart className="h-3 w-3" />
          </button>
        </div>

        <h3 className="text-[12px] font-bold text-stone-900 line-clamp-1 leading-tight font-sans">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-[13px] font-extrabold text-stone-900 font-sans">
            ₹{(activePrice || 0).toLocaleString('en-IN')}
          </span>

          <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#98631B]">
            <FiStar className="h-2.5 w-2.5 fill-[#98631B]" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * MobileWishlistSkeleton
 * Loading skeleton matching vertical & horizontal layouts.
 */
function MobileWishlistSkeleton() {
  return (
    <div className="min-h-dvh w-full bg-[#F8F6F2] text-stone-800 font-sans pb-28">
      <div className="h-[54px] bg-white border-b border-stone-200/80 px-4 flex items-center justify-between">
        <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse" />
        <div className="h-5 w-28 rounded-md bg-stone-200 animate-pulse" />
        <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse" />
      </div>

      <div className="px-4 py-4 max-w-[767px] mx-auto space-y-3">
        <div className="h-[90px] rounded-[18px] bg-amber-100/50 animate-pulse" />
        <div className="grid grid-cols-2 gap-3.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-[18px] bg-white border border-stone-200 p-2 space-y-2">
              <div className="w-full aspect-square rounded-[14px] bg-stone-200 animate-pulse" />
              <div className="h-3 w-16 bg-stone-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
              <div className="h-8 w-full bg-stone-200 rounded-[12px] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * MobileWishlist
 * Native App Style Mobile (<768px) and Tablet (768-1023px) Wishlist Page.
 * Inspired by Myntra, AJIO, Zara, Nike, and Apple Store layout standards.
 */
export default function MobileWishlist({
  items = [],
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
  onMoveToCart,
  onMoveAllToCart,
  onRemove,
  isMovingAll = false,
  movingItemId = null,
}) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Fetch featured products for empty wishlist recommendations
  const { data: featuredData } = useFeaturedProducts();
  const recommendedProducts = useMemo(() => {
    const list = Array.isArray(featuredData)
      ? featuredData
      : featuredData?.data || featuredData?.content || [];
    return list;
  }, [featuredData]);

  const inStockCount = useMemo(
    () => items.filter((item) => item.inStock !== false).length,
    [items]
  );

  const { estimatedTotal, totalDiscount } = useMemo(() => {
    let est = 0;
    let disc = 0;
    items.forEach((curr) => {
      const activeP = curr.discountPrice && curr.discountPrice < curr.price ? curr.discountPrice : curr.price;
      const oldP = curr.discountPrice && curr.discountPrice < curr.price ? curr.price : activeP;
      est += activeP || 0;
      disc += (oldP - activeP) || 0;
    });
    return { estimatedTotal: est, totalDiscount: disc };
  }, [items]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `My Wishlist | ${siteConfig.name}`,
          text: 'Check out my saved Krishna Poshak collection!',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      try {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Wishlist link copied to clipboard!');
      } catch {
        toast.error('Unable to copy link.');
      }
    }
  };

  if (isLoading) {
    return <MobileWishlistSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-dvh w-full bg-[#F8F6F2] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3 border border-rose-200">
          <FiAlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 mb-1">Failed to load Wishlist</h2>
        <p className="text-xs text-stone-500 max-w-xs mb-4">
          {error?.message || 'Unable to fetch your saved items at this time.'}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="h-10 px-5 rounded-xl bg-[#C68D33] hover:bg-[#B87E2B] text-white font-bold text-xs flex items-center gap-2 shadow-md"
        >
          <FiRefreshCw className="h-4 w-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-[#F8F6F2] text-stone-800 font-sans antialiased pb-28 md:pb-20">
      {/* ─── 1. HEADER (Sticky, Height: 54px) ─── */}
      <header className="sticky top-0 z-40 h-[54px] bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 flex items-center justify-between shadow-2xs">
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-transform"
          aria-label="Back"
        >
          <FiArrowLeft className="h-4 w-4" />
        </motion.button>

        {/* Center Title & Count */}
        <div className="flex items-center gap-1.5">
          <span className="text-[16px] font-bold text-stone-900 tracking-wide font-sans">
            Wishlist
          </span>
          <span className="text-[11px] font-bold text-[#98631B] bg-[#FFF5E5] border border-[#F3E2C8] px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>

        {/* Right Actions: View Mode Switcher + Share */}
        <div className="flex items-center gap-1.5">
          {items.length > 0 && (
            <div className="flex items-center bg-stone-100 rounded-full p-0.5 border border-stone-200/80">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full text-xs transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#C68D33] shadow-2xs font-bold' : 'text-stone-500'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <FiGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full text-xs transition-all ${
                  viewMode === 'list' ? 'bg-white text-[#C68D33] shadow-2xs font-bold' : 'text-stone-500'
                }`}
                title="List View"
                aria-label="List View"
              >
                <FiList className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={handleShare}
            className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-transform"
            aria-label="Share Wishlist"
            title="Share Wishlist"
          >
            <FiShare2 className="h-4 w-4" />
          </motion.button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="px-4 py-4 max-w-[767px] mx-auto space-y-3.5">
        {items.length === 0 ? (
          /* ─── EMPTY WISHLIST VIEW ─── */
          <div className="py-6 space-y-6">
            <EmptyWishlistIllustration />

            <div className="text-center space-y-2 max-w-xs mx-auto">
              <h1 className="text-2xl font-serif text-stone-900 tracking-tight font-normal">
                Your Wishlist is Empty
              </h1>
              <p className="text-[13px] text-stone-500 leading-relaxed font-sans">
                Explore our divine Krishna Poshak, Mukut, and Accessories collection and save your favorites.
              </p>
            </div>

            <div className="w-full max-w-xs mx-auto space-y-2.5 pt-2">
              <Link to={ROUTE_PATHS.SHOP || '/shop'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-11 rounded-full bg-[#C68D33] hover:bg-[#B87E2B] text-white font-bold text-[13px] shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue Shopping</span>
                  <FiArrowRight className="h-4 w-4 text-white" />
                </motion.button>
              </Link>

              <Link to={ROUTE_PATHS.CATEGORIES || '/categories'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-11 rounded-full bg-white border border-[#D4C3A3] text-stone-900 font-bold text-[13px] hover:bg-stone-50 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore Collections</span>
                </motion.button>
              </Link>
            </div>

            {recommendedProducts.length > 0 && (
              <div className="pt-8 border-t border-stone-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-stone-900 font-sans">
                    You May Also Like
                  </h2>
                  <Link to={ROUTE_PATHS.SHOP || '/shop'} className="text-[12px] font-bold text-[#C68D33] hover:underline">
                    View All
                  </Link>
                </div>

                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x -mx-4 px-4">
                  {recommendedProducts.slice(0, 6).map((prod) => (
                    <MobileRecommendedCard key={`rec-${prod.id}`} product={prod} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─── POPULATED WISHLIST VIEW ─── */
          <>
            {/* ─── 2. SAVED COLLECTION BANNER CARD ─── */}
            <div className="h-[90px] rounded-[18px] bg-gradient-to-r from-[#FFFDF9] via-[#FAF5ED] to-[#F6ECE0] border border-[#EEDFCD] px-4 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#F6E7D2] text-[#9E691A] flex items-center justify-center shrink-0">
                  <FiBookmark className="h-4 w-4 fill-[#9E691A]" />
                </div>
                <div>
                  <h1 className="text-[17px] font-bold text-stone-900 font-sans leading-tight">
                    Saved Collection
                  </h1>
                  <p className="text-[12px] text-stone-500 font-medium font-sans">
                    {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
                  </p>
                </div>
              </div>

              <HiSparkles className="h-5 w-5 text-[#D49E41] shrink-0" />
            </div>

            {/* ─── 3. WISHLIST PRODUCT CARDS (GRID VS LIST) ─── */}
            <AnimatePresence mode="popLayout">
              {viewMode === 'grid' ? (
                /* MYNTRA / AJIO NATIVE 2-COLUMN GRID */
                <div className="grid grid-cols-2 gap-3.5">
                  {items.map((item) => {
                    const variantId = item.variantId || item.productId;
                    const isItemMoving = movingItemId === variantId;

                    return (
                      <MobileGridWishlistCard
                        key={`mobile-grid-item-${item.wishlistId || item.id || variantId}`}
                        item={item}
                        onMoveToCart={onMoveToCart}
                        onRemove={onRemove}
                        isItemMoving={isItemMoving}
                      />
                    );
                  })}
                </div>
              ) : (
                /* APPLE STORE / NIKE NATIVE HORIZONTAL LIST */
                <div className="space-y-3">
                  {items.map((item) => {
                    const variantId = item.variantId || item.productId;
                    const isItemMoving = movingItemId === variantId;

                    return (
                      <MobileHorizontalWishlistCard
                        key={`mobile-list-item-${item.wishlistId || item.id || variantId}`}
                        item={item}
                        onMoveToCart={onMoveToCart}
                        onRemove={onRemove}
                        isItemMoving={isItemMoving}
                      />
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>

      {/* ─── 4. STICKY BOTTOM BAR ─── */}
      {items.length > 0 && (
        <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 h-[64px] bg-white border-t border-stone-200/80 px-4 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="max-w-[767px] w-full mx-auto flex items-center justify-between gap-2">
            {/* Left: Items Count & Estimated Total */}
            <div className="flex flex-col font-sans">
              <span className="text-[12px] font-bold text-stone-900 leading-tight">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-[13px] font-semibold text-stone-500">
                Est. Total
              </span>
            </div>

            {/* Middle: Price & Savings */}
            <div className="flex flex-col font-sans text-right mr-1">
              <span className="text-[16px] font-extrabold text-stone-900 leading-none">
                ₹{estimatedTotal.toLocaleString('en-IN')}
              </span>
              {totalDiscount > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 mt-0.5">
                  Save ₹{totalDiscount.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Right CTA: Move All to Cart */}
            <motion.button
              whileTap={inStockCount > 0 && !isMovingAll ? { scale: 0.95 } : {}}
              type="button"
              disabled={inStockCount === 0 || isMovingAll}
              onClick={onMoveAllToCart}
              className="h-[44px] px-4 rounded-[14px] bg-gradient-to-r from-[#D49E41] to-[#C68D33] hover:from-[#C68D33] hover:to-[#B87E2B] text-white font-bold text-[13px] shadow-md shadow-amber-900/15 flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <FiShoppingCart className="h-4 w-4 text-white" />
              <span>{isMovingAll ? 'Moving All...' : 'Move All to Cart'}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
