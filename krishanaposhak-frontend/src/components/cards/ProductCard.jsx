import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { buildPath } from '@/routes/routePaths';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { FiHeart, FiShoppingBag, FiStar, FiCheck, FiEye } from 'react-icons/fi';

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
    rating,
    reviewCount,
    numReviews,
    stock,
    category,
    categoryName,
    brand,
  } = product;


  // Primary & secondary images strictly derived from product data
  const primaryImage =
    directImageUrl ||
    images?.[0]?.imageUrl ||
    images?.[0]?.url ||
    (typeof images?.[0] === 'string' ? images[0] : null) ||
    '';

  const secondaryImage =
    images?.[1]?.imageUrl ||
    images?.[1]?.url ||
    (typeof images?.[1] === 'string' ? images[1] : null);

  // Prices & Discounts strictly calculated from product data
  const finalPrice = discountPrice && discountPrice > 0 ? discountPrice : price;
  const originalPrice = discountPrice && discountPrice > 0 ? price : null;
  const discount = calculateDiscount(price, discountPrice);
  const isOutOfStock = stock !== undefined && stock <= 0;

  // Category / Brand title line - ONLY rendered if present in product data
  const rawCategory = categoryName || (typeof category === 'string' ? category : category?.name) || brand;
  const displayCategory = rawCategory && typeof rawCategory === 'string' && rawCategory.trim() !== '' ? rawCategory.trim() : null;

  // Ratings strictly from product data (ONLY rendered if average rating > 0)
  const ratingVal = averageRating || rating || 0;
  const totalReviews = reviewCount || numReviews || 0;
  const hasRating = Number(ratingVal) > 0;

  // Product detail path navigation
  const productIdentifier = slug || product._id || product.id;

  const handleCardClick = (e) => {
    if (e) e.stopPropagation();
    if (productIdentifier) {
      navigate(buildPath.product(productIdentifier));
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

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex flex-col h-full overflow-hidden rounded-xl bg-white border border-stone-200/70 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer select-none font-display',
        className
      )}
    >
      {/* ─── 1. IMAGE CONTAINER ─── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl bg-stone-100/70">
        <OptimizedImage
          src={primaryImage}
          alt={name || ''}
          loading="lazy"
          aspectRatio="aspect-[3/4]"
          className={cn(
            'h-full w-full object-cover object-top transition-all duration-500 ease-out group-hover:scale-105',
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
          )}
        />

        {secondaryImage && (
          <OptimizedImage
            src={secondaryImage}
            alt={name || ''}
            loading="lazy"
            aspectRatio="aspect-[3/4]"
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 ease-out',
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            )}
          />
        )}

        {/* Wishlist Button */}
        {onAddToWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            className={cn(
              'absolute right-2 top-2 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-xs shadow-2xs border border-stone-200/60 transition-transform active:scale-90 hover:bg-white',
              isInWishlist ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-stone-600 hover:text-rose-600'
            )}
          >
            <FiHeart className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', isInWishlist && 'fill-rose-600 text-rose-600')} />
          </button>
        )}

        {/* Discount Badge (Strictly derived from discount calculated from price & discountPrice) */}
        {discount > 0 && (
          <div className="absolute left-2 top-2 z-10 pointer-events-none">
            <span className="h-4.5 px-1.5 inline-flex items-center justify-center rounded-xs bg-rose-600 text-[10px] font-extrabold text-white tracking-wide uppercase shadow-2xs">
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Rating Overlay Pill (Strictly derived from product ratings data) */}
        {hasRating && (
          <div className="absolute left-2 bottom-2 z-10 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded flex items-center gap-1 shadow-2xs border border-stone-200/40 text-[10px] font-bold text-stone-900 leading-none">
            <span className="flex items-center gap-0.5 text-stone-900 font-bold">
              {Number(ratingVal).toFixed(1)}
              <FiStar className="w-2.5 h-2.5 fill-teal-600 text-teal-600 inline" />
            </span>
            {totalReviews > 0 && (
              <>
                <span className="text-stone-300 font-light">|</span>
                <span className="text-stone-500 font-medium text-[9px]">{totalReviews}</span>
              </>
            )}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs">
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold text-stone-950 uppercase tracking-wider shadow-xs">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button on Desktop Hover */}
        {onQuickView && !isOutOfStock && (
          <div className="absolute bottom-2 right-2 z-20 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-xs px-2.5 py-1.5 text-xs font-bold text-stone-800 shadow-sm hover:bg-stone-900 hover:text-white transition-colors border border-stone-200"
            >
              <FiEye className="h-3.5 w-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── 2. CONTENT DETAILS SECTION ─── */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-white space-y-1.5">
        <div className="space-y-0.5 min-w-0">
          {/* Brand / Category (Only rendered if present in product object) */}
          {displayCategory && (
            <span className="text-[11px] font-extrabold text-stone-900 uppercase tracking-wider truncate block leading-tight">
              {displayCategory}
            </span>
          )}

          {/* Product Title */}
          {name && (
            <h3
              className="text-[12px] sm:text-[13px] font-medium text-stone-700 group-hover:text-stone-900 transition-colors line-clamp-1 sm:line-clamp-2 leading-tight"
              title={name}
            >
              {name}
            </h3>
          )}
        </div>

        {/* Price Row */}
        <div className="pt-0.5">
          <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
            {finalPrice !== undefined && finalPrice !== null && (
              <span className="text-[14px] sm:text-[15px] font-extrabold text-stone-900 font-heading leading-none">
                ₹{Number(finalPrice).toFixed(0)}
              </span>
            )}
            {originalPrice && (
              <span className="text-[11px] sm:text-xs font-normal text-stone-400 line-through leading-none">
                ₹{Number(originalPrice).toFixed(0)}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[11px] sm:text-xs font-extrabold text-orange-600 leading-none">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && !isOutOfStock && (
          <div className="pt-1.5">
            <button
              type="button"
              onClick={handleAddToCartClick}
              className={cn(
                'w-full flex items-center justify-center gap-1 rounded-lg py-1.5 px-0.5 text-xs font-bold transition-all duration-200 active:scale-95 border',
                isAddedAnimation
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-stone-50 hover:bg-stone-900 text-stone-800 hover:text-white border-stone-200/80 shadow-2xs'
              )}
            >
              {isAddedAnimation ? (
                <>
                  <FiCheck className="h-3.5 w-3.5 shrink-0 text-white" />
                  <span className="truncate">Added to Bag</span>
                </>
              ) : (
                <>
                  <FiShoppingBag className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Add to Bag</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductCard;
