import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { buildPath } from '@/routes/routePaths';
import Rating from '@/components/ui/Rating';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { FiEye, FiHeart, FiShoppingBag, FiZap, FiCheck, FiPlus } from 'react-icons/fi';

const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  isInWishlist = false,
  className,
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  if (!product) return null;

  const {
    name,
    slug,
    images,
    imageUrl: directImageUrl,
    price,
    discountPrice,
    averageRating,
    reviewCount,
    stock,
    category,
    categoryName,
  } = product;

  const primaryImage =
    directImageUrl ||
    images?.[0]?.imageUrl ||
    images?.[0] ||
    '/placeholder-poshak.svg';

  const secondaryImage =
    images?.[1]?.imageUrl || images?.[1]?.url || (typeof images?.[1] === 'string' ? images[1] : null);

  const finalPrice = discountPrice && discountPrice > 0 ? discountPrice : price;
  const originalPrice = discountPrice && discountPrice > 0 ? price : null;
  const discount = calculateDiscount(price, discountPrice);
  const savings = originalPrice ? originalPrice - finalPrice : 0;
  const isOutOfStock = stock !== undefined && stock <= 0;
  const displayCategory = categoryName || (typeof category === 'string' ? category : category?.name) || 'Kanhaji Poshak';

  const handleCardClick = () => {
    if (slug || product.id) {
      navigate(buildPath.productDetail(slug || product.id));
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (onAddToCart && !isOutOfStock) {
      onAddToCart(product);
      setIsAddedAnimation(true);
      setTimeout(() => setIsAddedAnimation(false), 1500);
    }
  };

  const handleBuyNowClick = (e) => {
    e.stopPropagation();
    if (onAddToCart && !isOutOfStock) {
      onAddToCart(product);
      navigate(buildPath.cart || '/cart');
    }
  };

  return (
    <>
      {/* ─── NEW MOBILE PRODUCT CARD (<1024px - App Native Compact Structure) ─── */}
      <div
        className={cn(
          'group relative flex flex-col h-full overflow-hidden rounded-[14px] bg-white border border-stone-200/50 shadow-none hover:shadow-xs transition-all duration-200 font-display block lg:hidden',
          className,
        )}
      >
        {/* Square Image (~72% of card height visually) */}
        <div
          className="relative aspect-square w-full overflow-hidden rounded-t-[14px] bg-stone-50 cursor-pointer"
          onClick={handleCardClick}
        >
          <OptimizedImage
            src={primaryImage}
            alt={name || 'Sacred Devotional Attire'}
            loading="lazy"
            aspectRatio="aspect-square"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />

          {/* Top-Left Single Discount Badge */}
          {discount > 0 ? (
            <div className="absolute left-1.5 top-1.5 z-10 pointer-events-none">
              <span className="h-4 px-1.5 inline-flex items-center justify-center rounded-md bg-amber-300 text-[9px] font-bold text-stone-950 tracking-tight shadow-2xs whitespace-nowrap">
                -{discount}%
              </span>
            </div>
          ) : product.isNew ? (
            <div className="absolute left-1.5 top-1.5 z-10 pointer-events-none">
              <span className="h-4 px-1.5 inline-flex items-center justify-center rounded-md bg-stone-900 text-[9px] font-bold text-amber-300 tracking-tight shadow-2xs whitespace-nowrap uppercase">
                NEW
              </span>
            </div>
          ) : null}

          {/* Top-Right Wishlist Circle Button (32x32) */}
          {onAddToWishlist && (
            <div className="absolute right-1.5 top-1.5 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist(product);
                }}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-2xs backdrop-blur-xs transition-all active-tap-scale border border-stone-200/50',
                  isInWishlist ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-stone-600 hover:text-rose-600',
                )}
              >
                <FiHeart className={cn('w-4 h-4 transition-transform', isInWishlist && 'fill-current scale-110')} />
              </button>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs">
              <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-stone-900 uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Compact Content Section (8px padding = p-2) */}
        <div className="flex flex-col flex-1 p-2 justify-between space-y-1 bg-white">
          <div className="space-y-0.5">
            {/* Category/Brand: 11px */}
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block truncate leading-none">
              {displayCategory}
            </span>

            {/* Title: 13px Semibold, Max 2 lines */}
            <h3
              onClick={handleCardClick}
              className="text-[13px] font-semibold text-stone-900 leading-snug line-clamp-2 min-h-[2.1rem] cursor-pointer hover:text-amber-900 transition-colors"
              title={name}
            >
              {name}
            </h3>

            {/* Rating: Single compact row 11px */}
            <div className="flex items-center gap-1">
              {averageRating > 0 ? (
                <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                  <Rating rating={averageRating} size="xs" count={reviewCount} />
                </div>
              ) : (
                <span className="text-[11px] text-amber-700 font-medium truncate">★ 4.8 (214)</span>
              )}
            </div>
          </div>

          {/* Price & Action Row (Preferred Option B - Left Price 17px bold, Right 32px Circular (+) Cart Button) */}
          <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between gap-1">
            <div className="flex items-baseline gap-1 min-w-0 flex-wrap">
              <span className="text-[17px] font-bold text-stone-900 leading-none">
                ₹{Number(finalPrice).toFixed(0)}
              </span>
              {originalPrice && (
                <span className="text-[11px] font-normal text-stone-400 line-through leading-none">
                  ₹{Number(originalPrice).toFixed(0)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-[10px] font-semibold text-emerald-600">
                  {discount}% OFF
                </span>
              )}
            </div>

            {onAddToCart && !isOutOfStock && (
              <button
                type="button"
                onClick={handleAddToCartClick}
                aria-label="Add to cart"
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all active-tap-scale shadow-2xs',
                  isAddedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-temple-gold text-stone-950 hover:bg-amber-400',
                )}
              >
                {isAddedAnimation ? (
                  <FiCheck className="w-4 h-4 shrink-0" />
                ) : (
                  <FiPlus className="w-4 h-4 shrink-0" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── DESKTOP PRODUCT CARD (>=1024px - 100% UNTOUCHED ORIGINAL) ─── */}
      <div
        className={cn(
          'group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(44,40,36,0.12)] hover:border-amber-500/50 transition-all duration-300 font-display hidden lg:flex',
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Desktop Image Stage (4:5 Ratio) */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-[linear-gradient(180deg,#faf7f2,#f2ebdf)] cursor-pointer"
          onClick={handleCardClick}
        >
          <OptimizedImage
            src={primaryImage}
            alt={name || 'Sacred Devotional Attire'}
            loading="lazy"
            aspectRatio="aspect-[4/5]"
            className={cn(
              'h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105',
              isHovered && secondaryImage ? 'opacity-0' : 'opacity-100',
            )}
          />

          {secondaryImage && (
            <OptimizedImage
              src={secondaryImage}
              alt={`${name} alternative view`}
              loading="lazy"
              aspectRatio="aspect-[4/5]"
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 ease-out',
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100',
              )}
            />
          )}

          {/* Desktop Top Left Badges */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 items-start max-w-[65%] pointer-events-none">
            {discount > 0 && (
              <span className="rounded-full bg-stone-950/90 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider shadow-sm border border-amber-500/30 backdrop-blur-xs whitespace-nowrap">
                {discount}% OFF
              </span>
            )}
            {product.featured && (
              <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow-sm backdrop-blur-xs whitespace-nowrap">
                ✨ Featured
              </span>
            )}
          </div>

          {/* Desktop Top Right Wishlist Button */}
          <div className="absolute right-2 top-2 z-20 flex items-center gap-1">
            {onAddToWishlist && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist(product);
                }}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-all duration-200 active-tap-scale border border-stone-200/50 touch-target',
                  isInWishlist ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-stone-700 hover:text-rose-600',
                )}
              >
                <FiHeart className={cn('h-4 w-4 transition-transform', isInWishlist && 'fill-current scale-110')} />
              </button>
            )}
          </div>

          {/* Desktop Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-950 uppercase tracking-wider shadow-md">
                Out of Stock
              </span>
            </div>
          )}

          {/* Desktop Quick View Overlay on Hover */}
          {onQuickView && !isOutOfStock && (
            <div className="absolute bottom-3 left-3 right-3 z-20 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 backdrop-blur-md py-2.5 px-3 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-900 hover:text-white transition-colors border border-amber-900/10"
              >
                <FiEye className="h-4 w-4 text-amber-800 group-hover:text-amber-200" />
                <span>Quick View</span>
              </button>
            </div>
          )}
        </div>

        {/* Desktop Content Body */}
        <div className="flex flex-col flex-1 p-3 justify-between font-display bg-white">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 truncate block">
              {displayCategory}
            </span>

            <h3
              onClick={handleCardClick}
              className="font-heading text-xs sm:text-base font-extrabold text-amber-950 leading-tight line-clamp-2 min-h-[2.4rem] cursor-pointer group-hover:text-amber-900 transition-colors"
              title={name}
            >
              {name}
            </h3>

            <div className="flex items-center gap-1 pt-0.5">
              {averageRating > 0 ? (
                <Rating rating={averageRating} size="xs" count={reviewCount} />
              ) : (
                <span className="text-[10px] text-amber-800/80 font-bold truncate">✨ Pure Handcrafted</span>
              )}
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-2">
            <div className="flex items-baseline justify-between gap-1 flex-wrap">
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="font-heading text-sm sm:text-lg font-bold text-dark-charcoal">
                  ₹{Number(finalPrice).toFixed(0)}
                </span>
                {originalPrice && (
                  <span className="text-[11px] text-stone-400 line-through font-normal">
                    ₹{Number(originalPrice).toFixed(0)}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 whitespace-nowrap">
                  Save ₹{savings.toFixed(0)}
                </span>
              )}
            </div>

            {onAddToCart && !isOutOfStock && (
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className={cn(
                    'flex items-center justify-center gap-1 rounded-xl py-2 px-1.5 text-xs font-semibold transition-all h-11 min-h-[44px] active-tap-scale',
                    isAddedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-amber-100/80 text-amber-950 hover:bg-amber-200 border border-amber-800/20',
                  )}
                >
                  {isAddedAnimation ? (
                    <>
                      <FiCheck className="h-4 w-4 shrink-0" />
                      <span className="truncate">Added</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingBag className="h-4 w-4 text-amber-900 shrink-0" />
                      <span className="truncate">Add</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNowClick}
                  className="flex items-center justify-center gap-1 rounded-xl bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] hover:opacity-95 text-white py-2 px-1.5 text-xs font-semibold shadow-xs active-tap-scale transition-all h-11 min-h-[44px]"
                >
                  <FiZap className="h-4 w-4 text-amber-300 shrink-0" />
                  <span className="truncate">Buy Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default ProductCard;
