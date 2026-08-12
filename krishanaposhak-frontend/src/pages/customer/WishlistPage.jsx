import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import PriceDisplay from '@/components/ui/PriceDisplay';
import DiscountBadge from '@/components/ui/DiscountBadge';
import Badge from '@/components/ui/Badge';
import { useWishlistContext } from '@/context/WishlistContext';
import { useMoveWishlistToCart } from '@/hooks/useMoveWishlistToCart';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileWishlist from '@/components/wishlist/mobile/MobileWishlist';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { siteConfig } from '@/config/siteConfig';
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiStar,
  FiArrowRight,
  FiPackage,
  FiCheckCircle,
  FiGift,
} from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'My Wishlist' },
];

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

function WishlistPage() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const { wishlist, isLoading, isError, error, refetch, removeFromWishlist } = useWishlistContext();
  const moveToCart = useMoveWishlistToCart();
  const [isMovingAll, setIsMovingAll] = useState(false);

  const items = Array.isArray(wishlist) ? wishlist : [];
  const inStockCount = items.filter((item) => item.inStock !== false).length;

  const handleMoveToCart = useCallback(
    async (item) => {
      const variantId = item.variantId || item.productId;
      if (!variantId) return;
      try {
        await moveToCart.mutateAsync({ variantId, wishlistId: item.wishlistId });
      } catch {
        // Hook already toasts errors
      }
    },
    [moveToCart],
  );

  const handleMoveAllToCart = useCallback(async () => {
    const inStockItems = items.filter((item) => item.inStock !== false);
    if (inStockItems.length === 0) return;

    setIsMovingAll(true);
    try {
      for (const item of inStockItems) {
        const variantId = item.variantId || item.productId;
        if (variantId) {
          await moveToCart.mutateAsync({ variantId, wishlistId: item.wishlistId });
        }
      }
    } catch {
      // Errors toasted by hook
    } finally {
      setIsMovingAll(false);
    }
  }, [items, moveToCart]);

  const handleRemove = useCallback(
    async (variantId) => {
      if (!variantId) return;
      try {
        await removeFromWishlist(variantId);
      } catch {
        // Hook already toasts errors
      }
    },
    [removeFromWishlist],
  );

  // Render Mobile/Tablet View (<1024px)
  if (!isDesktop) {
    return (
      <>
        <Helmet>
          <title>{`My Wishlist (${items.length}) | ${siteConfig.name}`}</title>
          <meta name="description" content="View and manage your saved Krishna Poshak items" />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <MobileWishlist
          items={items}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch?.()}
          onMoveToCart={handleMoveToCart}
          onMoveAllToCart={handleMoveAllToCart}
          onRemove={handleRemove}
          isMovingAll={isMovingAll}
          movingItemId={moveToCart.isPending ? moveToCart.variables?.variantId : null}
        />
      </>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // DESKTOP VIEW (>=1024px - 100% UNTOUCHED ORIGINAL)
  // ══════════════════════════════════════════════════════════════
  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-6xl">
        <Breadcrumb items={breadcrumbItems} />
        <Skeleton variant="text" className="h-8 w-48 bg-temple-gold/20" />
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} variant="card" className="h-80 w-full rounded-3xl bg-temple-gold/15" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 w-full max-w-5xl">
        <ErrorState
          title="Failed to load wishlist"
          message={error?.message || 'Unable to fetch your saved wishlist items.'}
          onRetry={() => refetch?.()}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`My Wishlist (${items.length}) | ${siteConfig.name}`}</title>
        <meta name="description" content="View and manage your saved Krishna Poshak items" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 w-full max-w-7xl font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        {/* Wishlist Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-white via-warm-cream/30 to-temple-gold/10 border border-temple-gold/30 shadow-md">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-900/20">
                <FiHeart className="h-6 w-6 fill-amber-700 text-amber-900" />
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950">
                Saved Wishlist {items.length > 0 && <span className="text-amber-800">({items.length})</span>}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 flex items-center gap-1.5 font-body">
              <FiGift className="h-3.5 w-3.5 text-amber-800 shrink-0" />
              Your saved divine poshaks, mukuts & devotional jewellery
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              {inStockCount > 0 && (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleMoveAllToCart}
                  disabled={isMovingAll}
                  leftIcon={<FiShoppingCart className="h-4 w-4" />}
                  className="w-full font-bold shadow-md sm:w-auto"
                >
                  Move All to Cart ({inStockCount})
                </Button>
              )}
              <Link to="/shop">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full font-bold sm:w-auto"
                >
                  Explore Shop <FiArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            message="Explore our collection and save your favorite Laddu Gopal poshaks, mukuts, and accessories!"
            action={
              <Link to="/shop">
                <Button variant="primary" leftIcon={<FiShoppingCart className="h-4 w-4" />} className="font-bold">
                  Explore Attire Collection
                </Button>
              </Link>
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => {
                const discountPercent = calculateDiscount(item.price, item.discountPrice);
                const isInStock = item.inStock !== false;
                const imgSrc = resolveWishlistImage(item);
                const isCurrentItemLoading =
                  moveToCart.isPending &&
                  (moveToCart.variables?.variantId === item.variantId ||
                    moveToCart.variables?.variantId === item.productId);

                return (
                  <motion.div
                    key={`wishlist-item-${item.wishlistId || item.id || item.productId || item.variantId}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col rounded-2xl bg-white border border-stone-200/80 overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_28px_rgba(15,36,64,0.12)] hover:border-[#C99A3B]/40 transition-all duration-300 h-full font-display"
                  >
                    {/* Product Image Container — Landscape aspect ratio (aspect-[4/3]) for wide luxury feel */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-50">
                      <Link to={`/product/${item.slug || item.productId}`} className="block w-full h-full">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={item.productName}
                            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}

                        <div
                          className="flex flex-col items-center justify-center gap-1.5 p-4 text-natural-wood/40 text-center w-full h-full"
                          style={{ display: imgSrc ? 'none' : 'flex' }}
                        >
                          <FiPackage className="h-10 w-10 text-temple-gold/40" />
                          <span className="text-xs font-bold text-dark-charcoal">Poshak Collection</span>
                        </div>
                      </Link>

                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 z-10 pointer-events-none">
                          <DiscountBadge percentage={discountPercent} />
                        </div>
                      )}

                      {/* Out of Stock Overlay */}
                      {!isInStock && (
                        <div className="absolute inset-0 bg-dark-charcoal/70 backdrop-blur-xs flex items-center justify-center z-10 pointer-events-none">
                          <Badge variant="danger" size="md" className="font-bold shadow-md">
                            Out of Stock
                          </Badge>
                        </div>
                      )}

                      {/* Floating Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.variantId || item.productId);
                        }}
                        className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-stone-500 shadow-xs transition-all duration-200 hover:scale-105 hover:bg-rose-500 hover:text-white"
                        title="Remove from Wishlist"
                        aria-label={`Remove ${item.productName} from wishlist`}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Product Details — Compact & Perfectly Proportioned */}
                    <div className="flex flex-col flex-1 p-4 justify-between font-display bg-white gap-3">
                      <div>
                        <Link
                          to={`/product/${item.slug || item.productId}`}
                          className="text-base font-bold text-[#0F2440] hover:text-[#C99A3B] transition-colors line-clamp-1 leading-snug mb-2 block"
                          title={item.productName}
                        >
                          {item.productName}
                        </Link>

                        <div className="flex items-center justify-between gap-2">
                          <PriceDisplay price={item.price} discountPrice={item.discountPrice} size="md" />

                          {item.rating > 0 ? (
                            <div className="flex items-center gap-1 text-xs text-stone-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">
                              <FiStar className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                              <span className="font-bold text-[#0F2440] text-xs">{item.rating}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                              <FiCheckCircle className="h-3 w-3 flex-shrink-0" />
                              <span>Saved</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Move to Cart Action Button */}
                      <div className="pt-2 border-t border-slate-100">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          isFullWidth
                          onClick={() => handleMoveToCart(item)}
                          disabled={!isInStock || isCurrentItemLoading}
                          leftIcon={<FiShoppingCart className="h-4 w-4" />}
                          className="font-bold shadow-xs uppercase tracking-wider text-xs h-10"
                        >
                          {isInStock ? 'Move to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </motion.div>
    </>
  );
}

export default WishlistPage;
