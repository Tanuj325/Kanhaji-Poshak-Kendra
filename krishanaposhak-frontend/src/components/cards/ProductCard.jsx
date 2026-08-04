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
        'group relative flex flex-col h-full overflow-hidden rounded-[28px] bg-white border border-amber-900/15 shadow-[0_8px_30px_rgba(44,40,36,0.06)] hover:shadow-[0_20px_50px_rgba(44,40,36,0.16)] hover:border-amber-500/60 transition-all duration-500 font-display backdrop-blur-xs',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Luxury Gold Foil Top Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />

      {/* Image Container Stage */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(250,247,242,0.9),rgba(242,235,223,0.7))] cursor-pointer"
        onClick={handleCardClick}
      >
        <OptimizedImage
          src={primaryImage}
          alt={name || 'Sacred Devotional Attire'}
          loading="lazy"
          aspectRatio="aspect-[4/5]"
          className={cn(
            'h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110',
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
              'absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out',
              isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100',
            )}
          />
        )}

        {/* Top Left Glassmorphism Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-stone-950/90 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold text-amber-300 uppercase tracking-widest shadow-md border border-amber-500/40 backdrop-blur-md font-mono">
              {discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-1 text-[9px] sm:text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md backdrop-blur-md border border-amber-400/30">
              ✨ Featured
            </span>
          )}
        </div>

        {/* Top Right Wishlist & Mobile Quick View */}
        <div className="absolute right-2.5 top-2.5 z-20 flex items-center gap-1.5">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick View product"
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md text-stone-800 active:scale-90 transition-all min-h-[44px] min-w-[44px]"
            >
              <FiEye className="h-4 w-4 text-amber-900" />
            </button>
          )}

          {onAddToWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToWishlist(product);
              }}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition-all duration-200 hover:scale-110 active:scale-90 border border-amber-900/10 min-h-[44px] min-w-[44px]',
                isInWishlist ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-stone-700 hover:text-rose-600',
              )}
            >
              <FiHeart className={cn('h-4 w-4 transition-transform', isInWishlist && 'fill-current scale-110')} />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/65 backdrop-blur-xs">
            <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider shadow-lg">
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

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between font-display bg-white">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 truncate block">
            {displayCategory}
          </span>

          <h3
            onClick={handleCardClick}
            className="font-heading text-sm sm:text-base font-extrabold text-amber-950 leading-snug line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] cursor-pointer group-hover:text-amber-900 transition-colors mt-0.5"
            title={name}
          >
            {name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5">
            {averageRating > 0 ? (
              <Rating rating={averageRating} size="xs" count={reviewCount} />
            ) : (
              <span className="text-[11px] text-amber-800/80 font-bold">✨ Pure Handcrafted</span>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-amber-900/10 space-y-2.5">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-base sm:text-lg font-bold text-dark-charcoal">
                ₹{Number(finalPrice).toFixed(0)}
              </span>
              {originalPrice && (
                <span className="text-xs text-stone-400 line-through font-normal">
                  ₹{Number(originalPrice).toFixed(0)}
                </span>
              )}
            </div>

            {savings > 0 && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                Save ₹{savings.toFixed(0)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {onAddToCart && !isOutOfStock && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleAddToCartClick}
                className={cn(
                  'flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-xs font-bold transition-all min-h-[44px]',
                  isAddedAnimation
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-100/90 text-amber-950 hover:bg-amber-200 border border-amber-800/20 active:scale-95',
                )}
              >
                {isAddedAnimation ? (
                  <>
                    <FiCheck className="h-3.5 w-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <FiShoppingBag className="h-3.5 w-3.5 text-amber-900 shrink-0" />
                    <span className="truncate">Add</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNowClick}
                className="flex items-center justify-center gap-1 rounded-xl bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] hover:opacity-95 text-white py-2 px-2 text-xs font-bold shadow-xs active:scale-95 transition-all min-h-[44px]"
              >
                <FiZap className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span className="truncate">Buy Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
