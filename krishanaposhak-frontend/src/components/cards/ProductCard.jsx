import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { buildPath } from '@/routes/routePaths';
import Rating from '@/components/ui/Rating';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { FiEye, FiHeart, FiShoppingBag, FiZap, FiCheck } from 'react-icons/fi';

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
    images?.[0]?.url ||
    (typeof images?.[0] === 'string' ? images[0] : null) ||
    '/placeholder.svg';

  const secondaryImage =
    images?.[1]?.imageUrl || images?.[1]?.url || (typeof images?.[1] === 'string' ? images[1] : null);

  const discount = calculateDiscount(price, discountPrice);
  const isOutOfStock = stock === 0;
  const productHref = slug ? buildPath.product(slug) : null;
  const displayCategory =
    categoryName || (typeof category === 'string' ? category : category?.name) || 'Meerut Sacred Collection';

  const finalPrice = discountPrice || price;
  const originalPrice = discountPrice ? price : null;
  const savings = originalPrice && finalPrice ? Number(originalPrice) - Number(finalPrice) : 0;

  const handleCardClick = () => {
    if (productHref) {
      navigate(productHref);
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
    <div
      className={cn(
        'group relative flex flex-col h-full overflow-hidden rounded-xl bg-white border border-stone-200/80 shadow-xs hover:shadow-sm transition-all duration-200 font-display',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Stage (~65-70% of card, 1:1 Square on mobile, 4:5 on desktop) */}
      <div
        className="relative aspect-square lg:aspect-[4/5] w-full overflow-hidden rounded-t-xl bg-stone-100 cursor-pointer"
        onClick={handleCardClick}
      >
        <OptimizedImage
          src={primaryImage}
          alt={name || 'Sacred Devotional Attire'}
          loading="lazy"
          aspectRatio="aspect-square"
          className={cn(
            'h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105',
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100',
          )}
        />

        {secondaryImage && (
          <OptimizedImage
            src={secondaryImage}
            alt={`${name} alternative view`}
            loading="lazy"
            aspectRatio="aspect-square"
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-top transition-all duration-300 ease-out',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100',
            )}
          />
        )}

        {/* Top Left: Small 18px Discount Badge */}
        <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1 items-start max-w-[65%] pointer-events-none">
          {discount > 0 && (
            <span className="h-[18px] px-1.5 py-0 flex items-center justify-center rounded-full bg-stone-900/90 text-[10px] font-bold text-amber-300 tracking-tight shadow-xs whitespace-nowrap">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="h-[18px] px-1.5 py-0 flex items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white tracking-tight shadow-xs whitespace-nowrap">
              ✨ Featured
            </span>
          )}
        </div>

        {/* Top Right: Wishlist Button (32x32 Glass Circle) */}
        <div className="absolute right-1.5 top-1.5 z-20 flex items-center gap-1">
          {onAddToWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product);
              }}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur-xs transition-all duration-150 active-tap-scale border border-stone-200/50',
                isInWishlist ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-stone-700 hover:text-rose-600',
              )}
            >
              <FiHeart className={cn('h-3.5 w-3.5 transition-transform', isInWishlist && 'fill-current scale-110')} />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs">
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-amber-950 uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Desktop Quick View Overlay on Hover (Desktop ONLY) */}
        {onQuickView && !isOutOfStock && (
          <div className="absolute bottom-3 left-3 right-3 z-20 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 backdrop-blur-md py-2 px-3 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-900 hover:text-white transition-colors border border-amber-900/10"
            >
              <FiEye className="h-4 w-4 text-amber-800 group-hover:text-amber-200" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Content Body (Compact 10px padding, 6px spacing) */}
      <div className="flex flex-col flex-1 p-2.5 lg:p-3 justify-between font-display bg-white space-y-1.5">
        {/* Category, Title, Rating */}
        <div className="space-y-1">
          <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider truncate block line-clamp-1">
            {displayCategory}
          </span>

          <h3
            onClick={handleCardClick}
            className="text-[13px] font-medium text-stone-900 leading-snug line-clamp-2 min-h-[2.2rem] lg:text-base lg:font-bold cursor-pointer group-hover:text-amber-900 transition-colors"
            title={name}
          >
            {name}
          </h3>

          <div className="flex items-center gap-1 pt-0.5">
            {averageRating > 0 ? (
              <Rating rating={averageRating} size="xs" count={reviewCount} />
            ) : (
              <span className="text-[10px] text-amber-700 font-bold truncate">✨ Pure Handcrafted</span>
            )}
          </div>
        </div>

        {/* 3. Price & Action Buttons */}
        <div className="pt-1.5 border-t border-stone-100 space-y-1.5">
          {/* Non-wrapping Price Row (16px bold current price) */}
          <div className="flex items-baseline justify-between gap-1 flex-wrap whitespace-nowrap">
            <div className="flex items-baseline gap-1">
              <span className="text-base lg:text-lg font-extrabold text-stone-950">
                ₹{Number(finalPrice).toFixed(0)}
              </span>
              {originalPrice && (
                <span className="text-[11px] text-stone-400 line-through font-normal">
                  ₹{Number(originalPrice).toFixed(0)}
                </span>
              )}
            </div>

            {savings > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                Save ₹{savings.toFixed(0)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {onAddToCart && !isOutOfStock && (
            <>
              {/* Mobile Action Button (Single Full-Width 40px Temple Gold Button) */}
              <div className="block lg:hidden pt-0.5">
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className={cn(
                    'flex w-full items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all h-10 min-h-[40px] active-tap-scale shadow-xs',
                    isAddedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-temple-gold text-dark-charcoal hover:bg-amber-400',
                  )}
                >
                  {isAddedAnimation ? (
                    <>
                      <FiCheck className="h-3.5 w-3.5 shrink-0" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingBag className="h-3.5 w-3.5 shrink-0" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Desktop Action Buttons (Dual Add & Buy Now Buttons - Desktop ONLY) */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-1.5 pt-0.5">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
