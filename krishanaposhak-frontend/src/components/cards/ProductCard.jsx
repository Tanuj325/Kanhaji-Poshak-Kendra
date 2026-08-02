import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { buildPath } from '@/routes/routePaths';
import Rating from '@/components/ui/Rating';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { FiEye, FiHeart, FiShoppingBag } from 'react-icons/fi';

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
    categoryName || (typeof category === 'string' ? category : category?.name) || 'Meerut Collection';

  const handleCardClick = () => {
    if (productHref) {
      navigate(productHref);
    }
  };

  const finalPrice = discountPrice || price;
  const originalPrice = discountPrice ? price : null;

  return (
    <div
      className={cn(
        'group relative flex flex-col h-full overflow-hidden rounded-[28px] bg-white/90 border border-white/70 shadow-[0_14px_36px_rgba(44,40,36,0.08)] hover:shadow-[0_20px_48px_rgba(44,40,36,0.12)] hover:border-temple-gold/25 transition-all duration-300 font-display backdrop-blur-sm',
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[linear-gradient(180deg,rgba(248,246,243,0.94),rgba(240,234,225,0.88))] cursor-pointer"
        onClick={handleCardClick}
      >
        <OptimizedImage
          src={primaryImage}
          alt={name || 'Sacred Poshak'}
          loading="lazy"
          aspectRatio="aspect-[4/5]"
          className={cn(
            'h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105',
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100',
          )}
        />

        {secondaryImage && (
          <OptimizedImage
            src={secondaryImage}
            alt={name || 'Secondary view'}
            loading="lazy"
            aspectRatio="aspect-[4/5]"
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-105',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100',
            )}
          />
        )}

        {/* Top Left Discount Badge Tag */}
        {discount && (
          <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-deep-navy px-2.5 py-1 text-[10px] sm:text-xs font-bold text-temple-gold-light uppercase tracking-wider shadow-[0_10px_24px_rgba(15,36,64,0.18)] border border-temple-gold/20">
            -{discount}% OFF
          </div>
        )}

        {/* Top Right Wishlist & Mobile Quick View */}
        <div className="absolute right-2.5 top-2.5 z-20 flex items-center gap-1.5">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick View"
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_24px_rgba(44,40,36,0.08)] text-stone-800 active:scale-95 transition-transform min-h-[44px] min-w-[44px]"
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
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 shadow-[0_10px_24px_rgba(44,40,36,0.08)] backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 border border-temple-gold/10 min-h-[44px] min-w-[44px]',
                isInWishlist ? 'text-rose-600 bg-rose-50' : 'text-stone-700 hover:text-rose-600',
              )}
            >
              <FiHeart className={cn('h-4 w-4 transition-transform', isInWishlist && 'fill-current scale-110')} />
            </button>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm">
            <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-amber-950 uppercase tracking-wider font-display shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Desktop Quick View Overlay on Hover */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) onQuickView(product);
              else if (productHref) navigate(productHref);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-xs py-2.5 px-3 text-xs font-bold text-amber-950 shadow-md hover:bg-amber-900 hover:text-white transition-colors border border-amber-900/10"
          >
            <FiEye className="h-4 w-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between font-display">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 truncate block">
            {displayCategory}
          </span>

          <h3
            onClick={handleCardClick}
            className="font-heading text-sm sm:text-base font-semibold text-dark-charcoal leading-snug line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] cursor-pointer group-hover:text-royal-blue transition-colors mt-0.5"
          >
            {name}
          </h3>

          <div className="mt-1 flex items-center gap-1">
            {averageRating > 0 ? (
              <Rating rating={averageRating} size="xs" count={reviewCount} />
            ) : (
              <span className="text-[11px] text-amber-800/80 font-bold">Handcrafted New</span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-3 pt-2.5 border-t border-amber-900/10">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-heading text-base sm:text-lg font-semibold text-dark-charcoal">
              ₹{Number(finalPrice).toFixed(0)}
            </span>
            {originalPrice && (
              <span className="text-xs text-stone-400 line-through font-normal font-sans">
                ₹{Number(originalPrice).toFixed(0)}
              </span>
            )}
            {discount && (
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 font-mono">
                {discount}% OFF
              </span>
            )}
          </div>

          {onAddToCart && !isOutOfStock && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] hover:opacity-95 text-white font-bold py-2.5 sm:py-3 px-3 text-xs sm:text-sm shadow-[0_12px_28px_rgba(15,36,64,0.2)] active:scale-95 transition-all focus:outline-none min-h-[44px]"
            >
              <FiShoppingBag className="h-4 w-4 flex-shrink-0 text-amber-200" />
              <span className="truncate">Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
