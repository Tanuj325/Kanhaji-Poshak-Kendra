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
 * Custom vector artwork matching the screenshot illustration:
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
 * MobileHorizontalWishlistCard
 * Rebuilt Horizontal Product Card matching screenshot (left mockup).
 * Contains: 110x110 image, Brand, Title, Variant/Size, Rating Pill, Price hierarchy, Stock line, Move to Cart button + Trash circle button.
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
  const variantText = item.size || item.color ? [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' | ') : item.variantName || 'Base | Medium Size';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, height: 0 }}
      transition={{ duration: 0.22 }}
      className="bg-white rounded-[16px] border border-[#EFECE6] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex gap-3.5 items-start relative overflow-hidden"
    >
      {/* Left Column: 110x110 Square Image */}
      <Link
        to={`/product/${item.slug || item.productId}`}
        className="w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] rounded-[14px] overflow-hidden bg-[#F5F2ED] shrink-0 border border-stone-100 relative block"
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

      {/* Right Column: Product Meta & Actions */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Top Header: Brand Name & Filled Heart */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans line-clamp-1">
            {brandName}
          </span>

          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={() => onRemove(variantId)}
            className="text-[#C68D33] hover:text-rose-600 transition-colors p-0.5"
            title="Saved in Wishlist"
            aria-label="Remove from wishlist"
          >
            <FiHeart className="h-4 w-4 fill-[#C68D33]" />
          </motion.button>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${item.slug || item.productId}`}
          className="text-[14px] font-bold text-stone-900 line-clamp-1 leading-snug hover:text-amber-800 transition-colors font-sans block"
        >
          {item.productName || 'Divine Krishna Poshak'}
        </Link>

        {/* Variant / Size info */}
        <p className="text-[11px] text-stone-500 font-medium line-clamp-1 font-sans">
          {variantText}
        </p>

        {/* Rating Pill */}
        <div className="flex items-center gap-1 pt-0.5">
          <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#98631B] bg-[#FFF8EE] border border-[#F3E2C8] px-1.5 py-0.5 rounded">
            <FiStar className="h-2.5 w-2.5 fill-[#98631B] text-[#98631B]" />
            <span>{rating}</span>
          </div>
          <span className="text-[11px] text-stone-400 font-normal">({reviewCount})</span>
        </div>

        {/* Price Row: Selling Price, MRP, Discount */}
        <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5 font-sans">
          <span className="text-[16px] font-extrabold text-stone-900 leading-none">
            ₹{(activePrice || 0).toLocaleString('en-IN')}
          </span>

          {oldPrice && (
            <span className="text-[11px] text-stone-400 line-through font-normal">
              ₹{oldPrice.toLocaleString('en-IN')}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="text-[11px] font-bold text-emerald-600">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Stock & Delivery line */}
        <div className="flex items-center gap-1.5 text-[11px] pt-0.5 text-stone-500 font-sans">
          {isInStock ? (
            <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
              <FiCheck className="h-3 w-3 stroke-[3]" />
              <span>In Stock</span>
            </span>
          ) : (
            <span className="font-semibold text-rose-600">Out of Stock</span>
          )}
          <span className="text-stone-300">•</span>
          <span>Free Delivery</span>
        </div>

        {/* Bottom Buttons: Move to Cart Pill & Circle Trash Button */}
        <div className="flex items-center gap-2 pt-2">
          <motion.button
            whileTap={isInStock && !isItemMoving ? { scale: 0.95 } : {}}
            type="button"
            disabled={!isInStock || isItemMoving}
            onClick={() => onMoveToCart(item)}
            className="flex-1 h-9 rounded-full bg-[#FFF9EE] border border-[#F5E5CE] hover:bg-[#FCEFD8] text-[#98631B] font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          >
            <FiShoppingCart className="h-3.5 w-3.5 text-[#98631B]" />
            <span>{isItemMoving ? 'Moving...' : 'Move to Cart'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            type="button"
            onClick={() => onRemove(variantId)}
            className="h-9 w-9 rounded-full border border-stone-200 text-stone-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center shrink-0 transition-all"
            title="Delete item"
            aria-label="Delete item"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </motion.button>
        </div>
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
      className="w-[140px] shrink-0 snap-start bg-white rounded-[14px] border border-[#EFECE6] p-2.5 cursor-pointer flex flex-col justify-between space-y-2 shadow-2xs"
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
 * Loading skeleton matching horizontal card layout.
 */
function MobileWishlistSkeleton() {
  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-stone-800 font-sans pb-28">
      <div className="h-[56px] bg-white border-b border-stone-200/80 px-4 flex items-center justify-between">
        <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse" />
        <div className="h-5 w-28 rounded-md bg-stone-200 animate-pulse" />
        <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse" />
      </div>

      <div className="px-4 py-4 max-w-[767px] mx-auto space-y-3.5">
        <div className="h-16 rounded-[16px] bg-amber-100/50 animate-pulse" />
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-[16px] bg-white border border-stone-200 p-3 flex gap-3">
            <div className="w-[110px] h-[110px] rounded-[14px] bg-stone-200 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-stone-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-stone-200 rounded animate-pulse" />
              <div className="h-9 w-full bg-stone-200 rounded-full animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * MobileWishlist
 * Exact Pixel-Perfect Mobile (<768px) and Tablet (768-1023px) Wishlist Redesign.
 * Strictly matches user provided design mockup screenshot.
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
      <div className="min-h-dvh w-full bg-[#FAF8F5] flex flex-col items-center justify-center p-4 text-center font-sans">
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
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-stone-800 font-sans antialiased pb-28 md:pb-20">
      {/* ─── 1. HEADER ─── */}
      <header className="sticky top-0 z-40 h-[56px] bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 flex items-center justify-between shadow-2xs">
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-transform"
          aria-label="Back"
        >
          <FiArrowLeft className="h-4 w-4" />
        </motion.button>

        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold text-stone-900 tracking-wide font-sans">
            Wishlist
          </span>
          <span className="text-[11px] font-bold text-[#98631B] bg-[#FFF5E5] border border-[#F3E2C8] px-2 py-0.5 rounded-full">
            ({items.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
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

          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => navigate(ROUTE_PATHS.SHOP || '/shop')}
            className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-transform"
            aria-label="Wishlist Heart"
          >
            <FiHeart className="h-4 w-4 text-[#C68D33]" />
          </motion.button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="px-4 py-4 max-w-[767px] mx-auto space-y-3.5">
        {items.length === 0 ? (
          /* ─── EMPTY WISHLIST VIEW (RIGHT MOCKUP IN SCREENSHOT) ─── */
          <div className="py-6 space-y-6">
            {/* Custom Shopping Bag + Mor Pankh Vector Art */}
            <EmptyWishlistIllustration />

            {/* Headline & Subtitle */}
            <div className="text-center space-y-2 max-w-xs mx-auto">
              <h1 className="text-2xl font-serif text-stone-900 tracking-tight font-normal">
                Your Wishlist is Waiting
              </h1>
              <p className="text-xs text-stone-500 leading-relaxed font-sans">
                Save your favourite Krishna Poshak, Mukut and Accessories for later.
              </p>
            </div>

            {/* Action Buttons: Solid Gold Continue Shopping & Outline Explore Collections */}
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

            {/* Recommended Products Carousel ("You May Also Like") */}
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
          /* ─── POPULATED WISHLIST VIEW (LEFT MOCKUP IN SCREENSHOT) ─── */
          <>
            {/* Banner Card ("Your Saved Collection") */}
            <div className="rounded-[16px] bg-[#FAF5ED] border border-[#EEDFCD] p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-[#F6E7D2] text-[#9E691A] flex items-center justify-center shrink-0">
                  <FiBookmark className="h-5 w-5 fill-[#9E691A]" />
                </div>
                <div>
                  <h1 className="text-[15px] font-bold text-stone-900 font-sans">
                    Your Saved Collection
                  </h1>
                  <p className="text-[12px] text-stone-500 font-sans">
                    Items you love, saved for later
                  </p>
                </div>
              </div>

              <HiSparkles className="h-5 w-5 text-[#D49E41] shrink-0" />
            </div>

            {/* Horizontal Cards List */}
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {items.map((item) => {
                  const variantId = item.variantId || item.productId;
                  const isItemMoving = movingItemId === variantId;

                  return (
                    <MobileHorizontalWishlistCard
                      key={`mobile-wishlist-item-${item.wishlistId || item.id || variantId}`}
                      item={item}
                      onMoveToCart={onMoveToCart}
                      onRemove={onRemove}
                      isItemMoving={isItemMoving}
                    />
                  );
                })}
              </div>
            </AnimatePresence>
          </>
        )}
      </main>

      {/* ─── STICKY BOTTOM BAR (LEFT MOCKUP IN SCREENSHOT) ─── */}
      {items.length > 0 && (
        <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 h-[64px] bg-white border-t border-stone-200/80 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="max-w-[767px] w-full mx-auto flex items-center justify-between gap-2">
            {/* Left Column: Count & Total Price */}
            <div className="flex flex-col font-sans">
              <span className="text-[12px] font-bold text-stone-900 leading-tight">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                Estimated Total
              </span>
            </div>

            {/* Middle Column: Price & Green Savings */}
            <div className="flex flex-col font-sans text-right mr-2">
              <span className="text-[16px] font-extrabold text-stone-900 leading-none">
                ₹{estimatedTotal.toLocaleString('en-IN')}
              </span>
              {totalDiscount > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 mt-0.5">
                  You Save ₹{totalDiscount.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Right Column CTA: Move All to Cart */}
            <motion.button
              whileTap={inStockCount > 0 && !isMovingAll ? { scale: 0.95 } : {}}
              type="button"
              disabled={inStockCount === 0 || isMovingAll}
              onClick={onMoveAllToCart}
              className="h-[42px] px-4 rounded-xl bg-[#C68D33] hover:bg-[#B87E2B] text-white font-bold text-[13px] shadow-md shadow-amber-900/15 flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
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
