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
  FiSearch,
  FiArrowRight,
  FiCheckCircle,
  FiGift,
  FiTruck,
  FiGrid,
  FiAlertCircle,
  FiRefreshCw,
  FiPackage,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { siteConfig } from '@/config/siteConfig';
import { ROUTE_PATHS } from '@/routes/routePaths';

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
 * MobileWishlistCard
 * Rebuilt luxury compact product card for Mobile (<768px) and Tablet (768-1023px).
 * Specs: 14px radius, 1:1 image, Wishlist remove icon top-right, Discount badge top-left,
 * Brand 11px, Title 13px max 2 lines, Price hierarchy, Stock status, Delivery line,
 * Move To Cart primary gold button & Remove small text button.
 */
const MobileWishlistCard = memo(function MobileWishlistCard({
  item,
  onMoveToCart,
  onRemove,
  isItemMoving,
}) {
  const navigate = useNavigate();
  const discountPercent = calculateDiscount(item.price, item.discountPrice);
  const isInStock = item.inStock !== false;
  const imgSrc = resolveWishlistImage(item);
  const variantId = item.variantId || item.productId;
  const activePrice = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
  const oldPrice = item.discountPrice && item.discountPrice < item.price ? item.price : null;
  const brandName = item.brand || item.product?.brand || item.product?.brandName || siteConfig.name;
  const rating = item.rating || item.product?.rating || 4.9;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
      className="group relative flex flex-col justify-between rounded-[14px] bg-white border border-stone-200/80 p-2.5 sm:p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 h-full overflow-hidden"
    >
      <div className="space-y-2">
        {/* 1:1 Square Rounded Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-stone-50 border border-stone-100">
          <Link to={`/product/${item.slug || item.productId}`} className="block w-full h-full">
            {imgSrc ? (
              <OptimizedImage
                src={imgSrc}
                alt={item.productName || 'Product'}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full p-2 text-stone-400 bg-amber-50/50">
                <FiPackage className="h-8 w-8 text-amber-700/40 mb-1" />
                <span className="text-[10px] font-bold text-stone-500">Krishna Poshak</span>
              </div>
            )}
          </Link>

          {/* Top-Left Discount Badge */}
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs tracking-tight">
              {discountPercent}% OFF
            </span>
          )}

          {/* Top-Right Wishlist Remove Icon Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(variantId);
            }}
            className="absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-stone-400 shadow-2xs transition-colors hover:bg-rose-50 hover:text-rose-600"
            title="Remove from Wishlist"
            aria-label={`Remove ${item.productName} from wishlist`}
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </motion.button>

          {/* Out of Stock Overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-10 pointer-events-none p-2">
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Meta Details */}
        <div className="space-y-1 pt-0.5">
          {/* Brand 11px uppercase gray */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block font-sans line-clamp-1">
            {brandName}
          </span>

          {/* Title 13px font-semibold max 2 lines */}
          <Link
            to={`/product/${item.slug || item.productId}`}
            className="text-[13px] font-semibold text-stone-900 line-clamp-2 leading-tight hover:text-amber-800 transition-colors font-sans block"
          >
            {item.productName || 'Divine Krishna Poshak'}
          </Link>

          {/* Rating Pill / Saved Badge */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
              <span>{rating}</span>
              <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
              <FiCheckCircle className="h-2.5 w-2.5" />
              <span>Saved</span>
            </span>
          </div>

          {/* Price Hierarchy */}
          <div className="flex items-baseline gap-1.5 flex-wrap pt-1">
            <span className="text-[16px] sm:text-[18px] font-bold text-stone-900 leading-none font-sans">
              ₹{(activePrice || 0).toLocaleString('en-IN')}
            </span>

            {oldPrice && (
              <span className="text-[11px] text-stone-400 line-through font-normal">
                ₹{oldPrice.toLocaleString('en-IN')}
              </span>
            )}

            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-700">
                ({discountPercent}% OFF)
              </span>
            )}
          </div>

          {/* Stock Status & Delivery Line */}
          <div className="flex items-center justify-between text-[10px] pt-0.5 text-stone-500">
            {isInStock ? (
              <span className="font-semibold text-emerald-700">✓ In Stock</span>
            ) : (
              <span className="font-semibold text-rose-600">Unavailable</span>
            )}
            <span className="flex items-center gap-0.5 text-stone-400">
              <FiTruck className="h-2.5 w-2.5 text-emerald-600" />
              <span>Free Delivery</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Move to Cart (Primary Gold) + Remove (Small text button) */}
      <div className="pt-3 border-t border-stone-100 space-y-1.5 mt-2">
        <motion.button
          whileTap={isInStock && !isItemMoving ? { scale: 0.96 } : {}}
          type="button"
          disabled={!isInStock || isItemMoving}
          onClick={() => onMoveToCart(item)}
          className="w-full h-9 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-bold text-[12px] shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart className="h-3.5 w-3.5 text-amber-200" />
          <span>{isItemMoving ? 'Moving...' : isInStock ? 'Move to Cart' : 'Out of Stock'}</span>
        </motion.button>

        <button
          type="button"
          onClick={() => onRemove(variantId)}
          className="w-full text-center text-[11px] text-stone-400 hover:text-rose-600 font-medium py-0.5 transition-colors hover:underline"
        >
          Remove item
        </button>
      </div>
    </motion.div>
  );
});

/**
 * MobileWishlistSkeleton
 * Loading Skeleton state for Mobile/Tablet view.
 */
function MobileWishlistSkeleton() {
  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-stone-800 font-sans pb-28">
      {/* Skeleton Header */}
      <div className="h-[56px] bg-white border-b border-stone-200/80 px-4 flex items-center justify-between">
        <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse" />
        <div className="h-5 w-28 rounded-md bg-stone-200 animate-pulse" />
        <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse" />
      </div>

      <div className="px-3.5 py-4 max-w-[1023px] mx-auto space-y-4">
        <div className="h-14 rounded-2xl bg-amber-100/50 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-[14px] bg-white border border-stone-200 p-3 space-y-3">
              <div className="aspect-square w-full rounded-[10px] bg-stone-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-stone-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-stone-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
                <div className="h-9 w-full bg-stone-200 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * MobileWishlist
 * Redesigned Luxury Mobile (<768px) and Tablet (768-1023px) Wishlist Page.
 * Inspired by Apple Store, Nike, Myntra, Zara, Shopify Plus.
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

  const inStockCount = useMemo(
    () => items.filter((item) => item.inStock !== false).length,
    [items]
  );

  const estimatedTotal = useMemo(
    () =>
      items.reduce((acc, curr) => {
        const p = curr.discountPrice && curr.discountPrice < curr.price ? curr.discountPrice : curr.price;
        return acc + (p || 0);
      }, 0),
    [items]
  );

  // Handle Share functionality
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

  // Loading State
  if (isLoading) {
    return <MobileWishlistSkeleton />;
  }

  // Error State
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
          className="h-10 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-2 shadow-md"
        >
          <FiRefreshCw className="h-4 w-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-[#FAF8F5] text-stone-800 font-sans antialiased pb-28 md:pb-20">
      {/* ─── 1. STICKY MOBILE HEADER (56px) ─── */}
      <header className="sticky top-0 z-40 h-[56px] bg-white/92 backdrop-blur-md border-b border-stone-200/80 px-3.5 flex items-center justify-between shadow-2xs">
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200/80 flex items-center justify-center text-stone-700 transition-transform"
          aria-label="Back"
        >
          <FiArrowLeft className="h-4 w-4" />
        </motion.button>

        <div className="flex items-center gap-1.5">
          <FiHeart className="h-4 w-4 text-amber-700 fill-amber-700" />
          <span className="text-[14px] font-bold text-stone-900 tracking-wide uppercase font-sans">
            Wishlist
          </span>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
            ({items.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
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
            aria-label="Search Shop"
            title="Search Shop"
          >
            <FiSearch className="h-4 w-4" />
          </motion.button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="px-3.5 py-4 max-w-[1023px] mx-auto space-y-4">
        {items.length === 0 ? (
          /* ─── EMPTY WISHLIST STATE (Rebuilt Luxury Look) ─── */
          <div className="py-12 px-4 text-center space-y-6 flex flex-col items-center justify-center max-w-sm mx-auto">
            {/* Premium Illustration / Icon Cluster */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 via-amber-50 to-warm-cream border-2 border-amber-300/60 flex items-center justify-center shadow-inner">
                <FiHeart className="h-11 w-11 text-amber-700 fill-amber-700/20" />
              </div>
              <span className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center text-xs shadow-md">
                ✨
              </span>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-heading text-stone-900 tracking-tight">
                Your Wishlist is Waiting
              </h1>
              <p className="text-xs text-stone-500 leading-relaxed font-body">
                Save your favourite Krishna Poshak, Mukut and Accessories for later.
              </p>
            </div>

            {/* Buttons */}
            <div className="w-full space-y-2.5 pt-2">
              <Link to={ROUTE_PATHS.SHOP || '/shop'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-[44px] rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-bold text-[13px] shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue Shopping</span>
                  <FiArrowRight className="h-4 w-4 text-amber-200" />
                </motion.button>
              </Link>

              <Link to={ROUTE_PATHS.CATEGORIES || '/categories'} className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full h-[44px] rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-[13px] hover:bg-stone-50 flex items-center justify-center gap-2 transition-all"
                >
                  <FiGrid className="h-4 w-4 text-amber-800" />
                  <span>Explore Collections</span>
                </motion.button>
              </Link>
            </div>
          </div>
        ) : (
          /* ─── WISHLIST WITH PRODUCTS ─── */
          <>
            {/* 2. Banner Header */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <HiSparkles className="h-4 w-4 text-amber-700" />
                  <h1 className="font-heading text-base sm:text-lg font-extrabold text-stone-900">
                    Your Saved Collection
                  </h1>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1 font-body">
                  <FiGift className="h-3 w-3 text-amber-700 shrink-0" />
                  Items saved for later • Divine attire & accessories
                </p>
              </div>

              {inStockCount > 0 && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 self-start sm:self-auto">
                  <FiCheckCircle className="h-3.5 w-3.5" />
                  <span>{inStockCount} items ready to move to cart</span>
                </div>
              )}
            </div>

            {/* 3. Product Cards Grid (Compact 16px Section Spacing) */}
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {items.map((item) => {
                  const variantId = item.variantId || item.productId;
                  const isItemMoving = movingItemId === variantId;

                  return (
                    <MobileWishlistCard
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

      {/* ─── 5. BOTTOM STICKY BAR (Height 60px, Glass Blur, Rounded Top) ─── */}
      {items.length > 0 && (
        <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 h-[60px] bg-white/95 backdrop-blur-md border-t border-stone-200/80 rounded-t-[16px] px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="max-w-[1023px] w-full mx-auto flex items-center justify-between gap-3">
            {/* Left Info: Items Count & Estimated Total */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-sans">
                {inStockCount} {inStockCount === 1 ? 'Item' : 'Items'} Available
              </span>
              <span className="text-[16px] font-bold text-stone-900 leading-tight font-sans">
                Est. ₹{estimatedTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Right Primary CTA: Move All To Cart */}
            <motion.button
              whileTap={inStockCount > 0 && !isMovingAll ? { scale: 0.95 } : {}}
              type="button"
              disabled={inStockCount === 0 || isMovingAll}
              onClick={onMoveAllToCart}
              className="h-[42px] px-4 sm:px-6 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-bold text-[13px] shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="h-4 w-4 text-amber-200" />
              <span>{isMovingAll ? 'Moving All...' : `Move All To Cart (${inStockCount})`}</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
