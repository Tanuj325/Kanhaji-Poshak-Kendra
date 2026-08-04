import { memo } from 'react';
import Rating from '@/components/ui/Rating';
import { FiCheckCircle, FiXCircle, FiTag, FiFeather, FiAward, FiHash } from 'react-icons/fi';

const ProductInfo = memo(function ProductInfo({ product, averageRating = 0, reviewCount = 0 }) {
  if (!product) return null;

  const categoryName =
    product.categoryName ||
    (typeof product.category === 'string' ? product.category : product.category?.name) ||
    'Meerut Sacred Collection';
  const hasStock = product.variants
    ? product.variants.some((v) => v.active !== false && v.stock > 0)
    : product.stock > 0;

  return (
    <div className="space-y-4">
      {/* Category Tag & Stock Status */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1.5 border border-amber-800/20 text-amber-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider font-display">
          <FiTag className="h-3.5 w-3.5 text-amber-800" />
          <span>{categoryName}</span>
        </div>

        {hasStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
            <FiCheckCircle className="h-4 w-4 text-emerald-600" /> In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/80">
            <FiXCircle className="h-4 w-4 text-rose-600" /> Out of Stock
          </span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="font-heading text-xl min-[390px]:text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-amber-950 leading-tight tracking-tight break-words">
        {product.name}
      </h1>

      {/* Rating & Review Count */}
      <div className="flex items-center gap-3 flex-wrap">
        {averageRating > 0 ? (
          <div className="flex items-center gap-2.5 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-900/10 shadow-2xs">
            <Rating rating={averageRating} size="sm" />
            <span className="text-xs sm:text-sm font-bold text-amber-950 font-mono">
              {Number(averageRating).toFixed(1)}
            </span>
            <span className="text-amber-800/30">|</span>
            <span className="text-xs sm:text-sm font-bold text-amber-900 font-display">
              {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100/60 px-3.5 py-2 rounded-xl border border-amber-800/20 font-display">
            <FiAward className="h-4 w-4 text-amber-700" /> Handcrafted Sacred Arrival
          </span>
        )}

        {/* SKU Display */}
        {product.sku && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-stone-500 font-mono">
            <FiHash className="h-3 w-3" /> {product.sku}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-xs sm:text-sm xl:text-base leading-relaxed text-stone-700 border-l-[3px] border-temple-gold/50 pl-3.5 sm:pl-4 py-1 font-body">
          {product.shortDescription}
        </p>
      )}

      {/* Material Highlight */}
      {product.material && (
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800 pt-1 font-body bg-amber-50/40 px-3.5 py-2.5 rounded-xl border border-amber-900/10">
          <FiFeather className="h-4 w-4 text-amber-800 shrink-0" />
          <span className="font-bold text-amber-950">Fabric:</span>
          <span className="font-medium text-stone-700">{product.material}</span>
        </div>
      )}
    </div>
  );
});

export default ProductInfo;
