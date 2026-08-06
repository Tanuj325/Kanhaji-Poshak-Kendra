import { useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiStar,
  FiArrowRight,
  FiBookmark,
  FiAlertCircle,
  FiRefreshCw,
  FiPackage,
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
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-2">
      {/* Background Soft Cream Circle */}
      <div className="absolute inset-0 rounded-full bg-[#FBF6ED]" />

      {/* Sparkles */}
      <div className="absolute top-2 right-4 text-[#D49E41] text-[10px] animate-pulse">✨</div>
      <div className="absolute bottom-6 left-4 text-[#D49E41] text-[9px]">✨</div>

      {/* Vector Canvas */}
      <svg className="relative z-10 w-28 h-28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
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
 * 2-Column Grid Vertical Card (50% Screen Width per Card).
 * Styled after Myntra, AJIO, and Zara native mobile shopping apps.
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
  const rating = item.rating || item.product?.rating || null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="bg-white rounded-[18px] border border-[#EFECE6] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full w-full font-sans relative group"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/4.2] w-full bg-[#F5F2ED] overflow-hidden">
        <Link to={`/product/${item.slug || item.productId}`} className="block w-full h-full">
          {imgSrc ? (
            <OptimizedImage
              src={imgSrc}
              alt={item.productName || 'Product'}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full p-4 text-stone-400">
              <FiPackage className="h-7 w-7 text-amber-700/40 mb-1" />
              <span className="text-[9px] font-bold text-stone-500">Poshak</span>
            </div>
          )}
        </Link>

        {/* Premium Floating Delete Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={() => onRemove(variantId)}
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/95 backdrop-blur-md text-stone-600 hover:text-rose-600 hover:bg-rose-50 border border-stone-200/80 flex items-center justify-center shadow-md transition-all cursor-pointer"
          aria-label="Remove item from Wishlist"
          title="Remove from Wishlist"
        >
          <FiTrash2 className="h-3.5 w-3.5" />
        </motion.button>

        {/* Rating Pill Overlay */}
        {rating ? (
          <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs text-[9px] font-bold text-stone-800 px-1.5 py-0.5 rounded-md border border-stone-200/80 shadow-2xs flex items-center gap-0.5">
            <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            <span>{rating}</span>
          </div>
        ) : null}
      </div>

      {/* Details Container */}
      <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1">
        <div>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#98631B]/90 block line-clamp-1">
            {brandName}
          </span>
          <Link
            to={`/product/${item.slug || item.productId}`}
            className="text-[12px] sm:text-[13px] font-medium text-stone-900 line-clamp-1 leading-snug hover:text-amber-800 transition-colors block mt-0.5"
          >
            {item.productName || 'Divine Krishna Poshak'}
          </Link>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-1 flex-wrap font-sans pt-0.5">
          <span className="text-[14px] sm:text-[15px] font-bold text-stone-900 leading-none">
            ₹{(activePrice || 0).toLocaleString('en-IN')}
          </span>
          {oldPrice && (
            <span className="text-[10px] text-stone-400 line-through">
              ₹{oldPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[9px] font-bold text-emerald-600">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Bottom Full-Width Move to Cart Action Button */}
      <div className="p-2.5 pt-0 w-full">
        <motion.button
          whileTap={isInStock && !isItemMoving ? { scale: 0.96 } : {}}
          type="button"
          disabled={!isInStock || isItemMoving}
          onClick={() => onMoveToCart(item)}
          className="w-full h-9 rounded-[12px] bg-gradient-to-r from-[#D49E41] via-[#C68D33] to-[#B87E2B] hover:from-[#C68D33] hover:to-[#B87E2B] text-white font-bold text-[11.5px] sm:text-[12px] shadow-sm shadow-amber-900/15 flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiShoppingCart className="h-3.5 w-3.5 text-white shrink-0" />
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
  const rating = product.rating || product.avgRating || null;

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(`/product/${product.slug || product.id}`)}
      className="w-[130px] shrink-0 snap-start bg-white rounded-[14px] border border-[#EFECE6] p-2 cursor-pointer flex flex-col justify-between space-y-1.5 shadow-2xs font-sans"
    >
      <div className="space-y-1">
        <div className="aspect-square w-full rounded-[10px] bg-stone-50 overflow-hidden relative border border-stone-100">
          <OptimizedImage
            src={imgSrc}
            alt={product.name || 'Product'}
            className="h-full w-full object-cover object-center"
          />
          <button
            type="button"
            className="absolute top-1.5 right-1.5 h-5.5 w-5.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-600 flex items-center justify-center text-xs shadow-2xs"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FiHeart className="h-2.5 w-2.5 text-stone-600" />
          </button>
        </div>

        <h3 className="text-[11px] font-semibold text-stone-900 line-clamp-1 leading-tight font-sans">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-stone-900 font-sans">
            ₹{(activePrice || 0).toLocaleString('en-IN')}
          </span>

          {rating ? (
            <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#98631B]">
              <FiStar className="h-2.5 w-2.5 fill-[#98631B]" />
              <span>{rating}</span>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * MobileWishlistSkeleton
 * Loading skeleton for 2-column grid layout.
 */
function MobileWishlistSkeleton() {
  return (
    <div className="min-h-dvh w-full bg-[#F8F6F2] text-stone-800 font-sans pb-28">
      <div className="h-[50px] bg-white border-b border-stone-200/80 px-3.5 flex items-center justify-between">
        <div className="h-7 w-7 rounded-full bg-stone-200 animate-pulse" />
        <div className="h-4 w-24 rounded-md bg-stone-200 animate-pulse" />
        <div className="h-7 w-7 rounded-full bg-stone-200 animate-pulse" />
      </div>

      <div className="px-2.5 sm:px-4 py-3 max-w-[767px] mx-auto space-y-3">
        <div className="h-[76px] rounded-[16px] bg-amber-100/40 animate-pulse" />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-56 rounded-[16px] bg-white border border-stone-200 p-2 space-y-2">
              <div className="w-full aspect-square rounded-[12px] bg-stone-200 animate-pulse" />
              <div className="h-3 w-16 bg-stone-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
              <div className="h-8 w-full bg-stone-200 rounded-[10px] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * MobileWishlist
 * Native App Style 2-Column Grid Wishlist Page (<1024px).
 * Inspired by Myntra, AJIO, and Zara native mobile shopping apps.
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

  if (isLoading) {
    return <MobileWishlistSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-dvh w-full bg-[#F8F6F2] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3 border border-rose-200">
          <FiAlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-base font-bold text-stone-900 mb-1">Failed to load Wishlist</h2>
        <p className="text-xs text-stone-500 max-w-xs mb-4">
          {error?.message || 'Unable to fetch your saved items at this time.'}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="h-9 px-4 rounded-xl bg-[#C68D33] hover:bg-[#B87E2B] text-white font-bold text-xs flex items-center gap-2 shadow-md"
        >
          <FiRefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-[#F8F6F2] text-stone-800 font-sans antialiased pb-24 md:pb-16">
      {/* ─── 1. HEADER (Sticky, Height: 50px, Centered Title) ─── */}
      <header className="sticky top-0 z-40 h-[50px] bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-3.5 flex items-center justify-between shadow-2xs">
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => navigate(-1)}
          className="h-7.5 w-7.5 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-transform"
          aria-label="Back"
        >
          <FiArrowLeft className="h-3.5 w-3.5" />
        </motion.button>

        {/* Center Title & Count */}
        <div className="flex items-center gap-1.5">
          <span className="text-[15px] font-semibold text-stone-900 tracking-wide font-sans">
            Wishlist
          </span>
          <span className="text-[10px] font-bold text-[#98631B] bg-[#FFF5E5] border border-[#F3E2C8] px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>

        {/* Right Spacer (Keeps Title Centered) */}
        <div className="h-7.5 w-7.5" aria-hidden="true" />
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="px-0.5 sm:px-1.5 py-0.5 max-w-[767px] mx-auto space-y-2.5">
        {items.length === 0 ? (
          /* ─── EMPTY WISHLIST VIEW ─── */
          <div className="py-6 space-y-5">
            <EmptyWishlistIllustration />

            <div className="text-center space-y-1.5 max-w-xs mx-auto">
              <h1 className="text-xl font-serif text-stone-900 tracking-tight font-normal">
                Your Wishlist is Empty
              </h1>
              <p className="text-[12px] text-stone-500 leading-relaxed font-sans">
                Explore our divine Krishna Poshak, Mukut, and Accessories collection and save your favorites.
              </p>
            </div>

            <div className="w-full max-w-xs mx-auto space-y-2 pt-1">
              <Link to={ROUTE_PATHS.SHOP || '/shop'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-10 rounded-full bg-[#C68D33] hover:bg-[#B87E2B] text-white font-bold text-[12px] shadow-sm shadow-amber-900/15 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Continue Shopping</span>
                  <FiArrowRight className="h-3.5 w-3.5 text-white" />
                </motion.button>
              </Link>

              <Link to={ROUTE_PATHS.CATEGORIES || '/categories'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-10 rounded-full bg-white border border-[#D4C3A3] text-stone-900 font-bold text-[12px] hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore Collections</span>
                </motion.button>
              </Link>
            </div>

            {recommendedProducts.length > 0 && (
              <div className="pt-6 border-t border-stone-200/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-bold text-stone-900 font-sans">
                    You May Also Like
                  </h2>
                  <Link to={ROUTE_PATHS.SHOP || '/shop'} className="text-[11px] font-bold text-[#C68D33] hover:underline">
                    View All
                  </Link>
                </div>

                <div className="flex overflow-x-auto gap-2.5 pb-1 scrollbar-none snap-x -mx-2.5 px-2.5">
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
            <div className="h-[76px] rounded-[16px] bg-gradient-to-r from-[#FFFDF9] via-[#FAF5ED] to-[#F6ECE0] border border-[#EEDFCD]/80 px-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#F6E7D2] text-[#9E691A] flex items-center justify-center shrink-0">
                  <FiBookmark className="h-3.5 w-3.5 fill-[#9E691A]" />
                </div>
                <div>
                  <h1 className="text-[15px] font-bold text-stone-900 font-sans leading-tight">
                    Saved Collection
                  </h1>
                  <p className="text-[11px] text-stone-500 font-medium font-sans">
                    {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
                  </p>
                </div>
              </div>

              <HiSparkles className="h-4.5 w-4.5 text-[#D49E41] shrink-0" />
            </div>

            {/* ─── 3. 2-COLUMN GRID WISHLIST PRODUCT CARDS (WIDTH / 2 PER CARD) ─── */}
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
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
            </AnimatePresence>
          </>
        )}
      </main>

      {/* ─── 4. STICKY BOTTOM BAR ─── */}
      {items.length > 0 && (
        <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 h-[58px] bg-white/98 backdrop-blur-md border-t border-stone-200/80 px-3.5 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div className="max-w-[767px] w-full mx-auto flex items-center justify-between gap-2">
            {/* Left: Items Count & Estimated Total */}
            <div className="flex flex-col font-sans">
              <span className="text-[11px] font-bold text-stone-900 leading-tight">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-[12px] font-medium text-stone-500">
                Est. Total
              </span>
            </div>

            {/* Middle: Price & Savings */}
            <div className="flex flex-col font-sans text-right mr-1">
              <span className="text-[15px] font-extrabold text-stone-900 leading-none">
                ₹{estimatedTotal.toLocaleString('en-IN')}
              </span>
              {totalDiscount > 0 && (
                <span className="text-[9px] font-bold text-emerald-600 mt-0.5">
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
              className="h-[38px] px-3.5 rounded-full bg-gradient-to-r from-[#D49E41] to-[#C68D33] hover:from-[#C68D33] hover:to-[#B87E2B] text-white font-bold text-[12px] shadow-sm shadow-amber-900/10 flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <FiShoppingCart className="h-3.5 w-3.5 text-white" />
              <span>{isMovingAll ? 'Moving All...' : 'Move All to Cart'}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
