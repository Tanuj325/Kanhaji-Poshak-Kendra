import { memo } from 'react';
import Rating from '@/components/ui/Rating';
import { FiCheckCircle, FiXCircle, FiTag, FiFeather, FiAward } from 'react-icons/fi';

const ProductInfo = memo(function ProductInfo({ product, averageRating = 0, reviewCount = 0 }) {
  if (!product) return null;

  const categoryName =
    product.categoryName ||
    (typeof product.category === 'string' ? product.category : product.category?.name) ||
    'Meerut Collection';
  const hasStock = product.variants
    ? product.variants.some((v) => v.active !== false && v.stock > 0)
    : product.stock > 0;

  return (
    <div className="space-y-4">
      {/* Category Tag & Stock Status Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1 border border-amber-800/20 text-amber-950 font-bold text-xs uppercase tracking-wider font-display">
          <FiTag className="h-3.5 w-3.5 text-amber-800" />
          <span>{categoryName}</span>
        </div>

        {/* Stock Badge */}
        {hasStock ? (
          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200/80">
            <FiCheckCircle className="h-4 w-4 text-emerald-600" /> In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-rose-800 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200/80">
            <FiXCircle className="h-4 w-4 text-rose-600" /> Out of Stock
          </span>
        )}
      </div>

      {/* Product Title - Scaled fluently across breakpoints */}
      <h1 className="font-heading text-2xl sm:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-amber-950 leading-snug tracking-tight break-words">
        {product.name}
      </h1>

      {/* Rating & Review Summary Pill */}
      <div className="flex items-center gap-3 pt-0.5">
        {averageRating > 0 ? (
          <div className="flex items-center gap-2 bg-amber-50/80 px-3.5 py-1.5 rounded-xl border border-amber-900/10 shadow-[0_2px_6px_rgba(44,40,36,0.02)]">
            <Rating rating={averageRating} size="xs" />
            <span className="text-xs sm:text-sm font-bold text-amber-950 font-mono">
              {Number(averageRating).toFixed(1)}
            </span>
            <span className="text-xs text-amber-800/40">|</span>
            <span className="text-xs sm:text-sm font-bold text-amber-900 font-display">
              {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100/60 px-3.5 py-1.5 rounded-xl border border-amber-800/20 font-display">
            <FiAward className="h-4 w-4 text-amber-700" /> Handcrafted Sacred Arrival
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-xs sm:text-sm xl:text-base leading-relaxed text-stone-700 border-l-2 border-amber-700/40 pl-3.5 sm:pl-4 py-0.5 font-body">
          {product.shortDescription}
        </p>
      )}

      {/* Fabric & Material Highlight */}
      {product.material && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-800 pt-1 font-body">
          <FiFeather className="h-4 w-4 text-amber-800 shrink-0" />
          <span className="font-bold text-amber-950">Fabric & Material:</span>
          <span className="font-medium text-stone-900">{product.material}</span>
        </div>
      )}
    </div>
  );
});

export default ProductInfo;
