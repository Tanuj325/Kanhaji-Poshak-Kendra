import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    sku,
  } = item;

  const targetId = cartItemId || id;
  const discountPercent = calculateDiscount(price, discountPrice);
  const isInStock = stock === undefined || stock > 0;
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;
  const imgSrc = resolveCartImage(item);
  const calculatedTotal = totalPrice || (discountPrice || price) * quantity;
  const itemSku = sku || (variantId ? `KP-V${variantId}` : null);

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xs hover:border-amber-400/30 transition-all flex gap-3 items-center group relative overflow-hidden font-display"
      >
        <Link to={`/product/${slug || productId || id}`} className="shrink-0 relative overflow-hidden rounded-lg">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={productName}
              className="h-16 w-16 object-cover bg-amber-50/10 rounded-lg group-hover:scale-105 transition-transform duration-300 border border-white/10"
              loading="lazy"
            />
          ) : (
            <div className="h-16 w-16 bg-white/5 rounded-lg flex items-center justify-center text-amber-200/40 border border-white/10">
              <FiPackage className="h-6 w-6" />
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0 space-y-1">
          <Link
            to={`/product/${slug || productId || id}`}
            className="font-bold text-xs sm:text-sm text-white hover:text-temple-gold transition-colors line-clamp-1 font-display"
          >
            {productName}
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-slate-300 flex-wrap">
            {size && (
              <span className="bg-amber-400/20 text-amber-200 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                Size: {size}
              </span>
            )}
            {item.color && (
              <span className="bg-amber-400/20 text-amber-200 font-semibold px-2 py-0.5 rounded text-[10px]">
                Color: {item.color}
              </span>
            )}
            <span className="font-semibold text-white">
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
              className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/10 min-h-[36px] min-w-[36px] flex items-center justify-center"
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
      className="group relative p-4 sm:p-5 rounded-2xl bg-white border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] hover:border-amber-400/30 transition-all duration-300 font-display"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5">
        <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Product Thumbnail */}
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
                className="h-20 w-20 min-[375px]:h-24 min-[375px]:w-24 sm:h-28 sm:w-28 object-cover rounded-lg group-hover/img:scale-108 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="h-20 w-20 min-[375px]:h-24 min-[375px]:w-24 sm:h-28 sm:w-28 rounded-lg bg-amber-50/60 flex items-center justify-center text-amber-800/40">
                <FiPackage className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
            )}

            {discountPercent > 0 && (
              <div className="absolute top-1.5 left-1.5 z-10">
                <DiscountBadge percentage={discountPercent} size="sm" />
              </div>
            )}
          </Link>

          {/* Mobile Top Info Column (Title + Size + Stock) */}
          <div className="flex-1 min-w-0 space-y-1.5 sm:hidden">
            <Link
              to={`/product/${slug || productId || id}`}
              className="font-heading text-sm font-bold text-amber-950 hover:text-amber-700 transition-colors line-clamp-2 leading-snug break-words"
            >
              {productName}
            </Link>
            <div className="flex items-center gap-1.5 flex-wrap">
              {size && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100/70 text-amber-950 border border-amber-300/40 whitespace-nowrap">
                  Size: {size}
                </span>
              )}
              {item.color && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100/70 text-amber-950 border border-amber-300/40 whitespace-nowrap">
                  Color: {item.color}
                </span>
              )}
              {itemSku && (
                <span className="text-[10px] font-mono text-stone-400 truncate max-w-[120px]">
                  SKU: {itemSku}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="pt-0.5">
              {isInStock ? (
                isLowStock ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <FiAlertCircle className="h-3 w-3 shrink-0" /> Only {stock} left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <FiCheckCircle className="h-3 w-3 text-emerald-600 shrink-0" /> In Stock
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Meta Details (Desktop & Full view) */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          <div className="hidden sm:flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/product/${slug || productId || id}`}
                className="font-heading text-base sm:text-lg font-bold text-amber-950 hover:text-amber-700 transition-colors line-clamp-2 leading-snug"
              >
                {productName}
              </Link>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                {size && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-950 border border-amber-300/40">
                    Size: {size}
                  </span>
                )}
                {item.color && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-950 border border-amber-300/40">
                    Color: {item.color}
                  </span>
                )}
                {itemSku && (
                  <span className="text-[11px] font-mono text-stone-400">
                    SKU: {itemSku}
                  </span>
                )}
              </div>
            </div>

            {/* Price (Desktop) */}
            <div className="text-right">
              <span className="font-heading font-extrabold text-amber-950 text-lg block">
                <PriceDisplay price={calculatedTotal} size="md" />
              </span>
              {quantity > 1 && (
                <span className="text-[11px] text-stone-500 font-medium font-mono">
                  {quantity} × <PriceDisplay price={discountPrice || price} size="xs" inline />
                </span>
              )}
            </div>
          </div>

          {/* Stock Status Indicator (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 text-xs">
            {isInStock ? (
              isLowStock ? (
                <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  <FiAlertCircle className="h-3.5 w-3.5" /> Only {stock} left in stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600" /> In Stock
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-800 font-bold bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 sm:pt-2 border-t border-amber-900/10 w-full">
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
                <span className="text-xs text-amber-800 font-medium animate-pulse font-mono">Updating...</span>
              )}
            </div>

            {/* Price (Mobile) */}
            <div className="sm:hidden text-right">
              <span className="text-[9px] uppercase font-bold text-stone-500 block">Total</span>
              <span className="font-heading font-extrabold text-amber-950 text-base">
                <PriceDisplay price={calculatedTotal} size="sm" />
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0">
              {onMoveToWishlist && (
                <button
                  type="button"
                  onClick={() => onMoveToWishlist(item)}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-700 hover:text-amber-900 transition-colors px-3 py-2 rounded-xl hover:bg-amber-100/50 border border-amber-900/10 min-h-[44px] flex-1 sm:flex-none"
                  title="Move to Wishlist"
                >
                  <FiHeart className="h-3.5 w-3.5 text-amber-800 shrink-0" />
                  <span>Save for Later</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onRemove?.(targetId)}
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-500 hover:text-rose-700 transition-colors px-3 py-2 rounded-xl hover:bg-rose-50 border border-amber-900/10 min-h-[44px] flex-1 sm:flex-none"
                title="Remove item from cart"
              >
                <FiTrash2 className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default CartItem;
