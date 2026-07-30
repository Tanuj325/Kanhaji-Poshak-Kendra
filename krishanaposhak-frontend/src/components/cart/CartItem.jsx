import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import QuantitySelector from '@/components/ui/QuantitySelector';
import PriceDisplay from '@/components/ui/PriceDisplay';
import DiscountBadge from '@/components/ui/DiscountBadge';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { calculateDiscount } from '@/utils/calculateDiscount';
import { FiTrash2, FiHeart, FiPackage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const resolveCartImage = (item) => {
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

const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  isUpdating,
  compact = false,
}) {
  const {
    cartItemId,
    id,
    productId,
    variantId,
    productName,
    slug,
    size,
    price,
    discountPrice,
    quantity,
    totalPrice,
    stock,
  } = item;

  const targetId = cartItemId || id;
  const discountPercent = calculateDiscount(price, discountPrice);
  const isInStock = stock === undefined || stock > 0;
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;
  const imgSrc = resolveCartImage(item);
  const calculatedTotal = totalPrice || (discountPrice || price) * quantity;

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="p-3 sm:p-4 rounded-xl bg-white border border-amber-900/10 shadow-xs hover:shadow-md transition-all flex gap-3 items-center group relative overflow-hidden"
      >
        <Link to={`/product/${slug || productId || id}`} className="shrink-0 relative overflow-hidden rounded-lg">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={productName}
              className="h-16 w-16 object-cover bg-amber-50/50 rounded-lg group-hover:scale-105 transition-transform duration-300 border border-amber-950/10"
              loading="lazy"
            />
          ) : (
            <div className="h-16 w-16 bg-amber-50 rounded-lg flex items-center justify-center text-amber-800/40 border border-amber-950/10">
              <FiPackage className="h-7 w-7" />
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0 space-y-1">
          <Link
            to={`/product/${slug || productId || id}`}
            className="font-bold text-xs sm:text-sm text-stone-900 hover:text-amber-700 transition-colors line-clamp-1 font-display"
          >
            {productName}
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            {size && (
              <span className="bg-amber-100/60 text-amber-950 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                Size: {size}
              </span>
            )}
            <span className="font-semibold text-stone-900">
              <PriceDisplay price={discountPrice || price} size="xs" />
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <QuantitySelector
              value={quantity}
              min={1}
              max={stock || 99}
              onChange={(newQty) => onUpdateQuantity?.(targetId, newQty)}
              size="sm"
              isDisabled={isUpdating || !isInStock}
            />

            <button
              type="button"
              onClick={() => onRemove?.(targetId)}
              disabled={isUpdating}
              className="text-stone-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50"
              title="Remove item"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group relative p-4 sm:p-5 rounded-2xl bg-white border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] hover:border-amber-400/30 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        {/* Large Luxury Product Thumbnail */}
        <Link
          to={`/product/${slug || productId || id}`}
          className="shrink-0 relative overflow-hidden rounded-xl border border-amber-950/10 bg-gradient-to-br from-amber-50/50 to-stone-50 p-1 group/img"
        >
          {imgSrc ? (
            <OptimizedImage
              src={imgSrc}
              alt={productName}
              loading="lazy"
              aspectRatio="aspect-square"
              className="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-lg group-hover/img:scale-108 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-lg bg-amber-50/60 flex items-center justify-center text-amber-800/40">
              <FiPackage className="h-9 w-9" />
            </div>
          )}

          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <DiscountBadge percentage={discountPercent} size="sm" />
            </div>
          )}
        </Link>

        {/* Product Meta Details */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/product/${slug || productId || id}`}
                className="font-heading text-base sm:text-lg font-bold text-stone-950 hover:text-amber-800 transition-colors line-clamp-2 leading-snug"
              >
                {productName}
              </Link>
              {size && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-950 border border-amber-300/40">
                    Size: {size}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Price */}
            <div className="text-right hidden sm:block">
              <span className="font-heading font-extrabold text-stone-950 text-lg block">
                {<PriceDisplay price={calculatedTotal} size="md" />}
              </span>
              {quantity > 1 && (
                <span className="text-[11px] text-stone-500 font-medium">
                  {quantity} × {<PriceDisplay price={discountPrice || price} size="xs" inline />}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-3 text-xs">
            {isInStock ? (
              isLowStock ? (
                <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <FiAlertCircle className="h-3.5 w-3.5" /> Only {stock} left in stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <FiCheckCircle className="h-3.5 w-3.5" /> In Stock
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-900/10">
            <div className="flex items-center gap-3">
              <QuantitySelector
                value={quantity}
                min={1}
                max={stock || 99}
                onChange={(newQty) => onUpdateQuantity?.(targetId, newQty)}
                size="sm"
                isDisabled={isUpdating || !isInStock}
              />
              {isUpdating && (
                <span className="text-xs text-amber-800 font-medium animate-pulse">Updating...</span>
              )}
            </div>

            {/* Price on Mobile */}
            <div className="sm:hidden text-right">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Total</span>
              <span className="font-heading font-extrabold text-stone-950 text-base">
                <PriceDisplay price={calculatedTotal} size="sm" />
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onMoveToWishlist && (
                <button
                  type="button"
                  onClick={() => onMoveToWishlist(item)}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-800 transition-colors px-3 py-1.5 rounded-xl hover:bg-amber-100/50 border border-amber-900/10 min-h-[38px]"
                  title="Move to Wishlist"
                >
                  <FiHeart className="h-3.5 w-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Save for Later</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onRemove?.(targetId)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-rose-700 transition-colors px-3 py-1.5 rounded-xl hover:bg-rose-50 border border-amber-900/10 min-h-[38px]"
                title="Remove item from cart"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default CartItem;
