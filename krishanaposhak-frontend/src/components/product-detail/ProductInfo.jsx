import { memo } from 'react';
import Rating from '@/components/ui/Rating';
import { FiCheckCircle, FiXCircle, FiTag, FiFeather, FiAward, FiHash, FiDroplet } from 'react-icons/fi';

const ProductInfo = memo(function ProductInfo({ product, averageRating = 0, reviewCount = 0 }) {
  if (!product) return null;

  const effectiveReviewCount = Math.max(
    reviewCount || 0,
    product.reviewCount || 0,
    product.numReviews || 0,
    product.reviews?.length || 0
  );

  const effectiveAverageRating = averageRating > 0
    ? averageRating
    : (product.averageRating > 0 ? product.averageRating : 0);

  const categoryName =
    product.categoryName ||
    (typeof product.category === 'string' ? product.category : product.category?.name) ||
    'Meerut Sacred Collection';
  const hasStock = product.variants
    ? product.variants.some((v) => v.active !== false && v.stock > 0)
    : product.stock > 0;

  return (
    <div className="space-y-3 font-display">
      {/* Category Tag & Stock Status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 border border-amber-200/80 text-[#C99A3B] font-bold text-xs uppercase tracking-wider font-display max-w-[70%] truncate">
          <FiTag className="h-3.5 w-3.5 text-[#C99A3B] shrink-0" />
          <span className="truncate">{categoryName}</span>
        </div>

        {hasStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 whitespace-nowrap">
            <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/80 whitespace-nowrap">
            <FiXCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" /> Out of Stock
          </span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-[#0F2440] leading-snug tracking-tight break-words">
        {product.name}
      </h1>

      {/* Rating & Review Count & SKU */}
      <div className="flex items-center gap-3 flex-wrap">
        {effectiveAverageRating > 0 || effectiveReviewCount > 0 ? (
          <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <Rating rating={effectiveAverageRating || 5} size="xs" />
            <span className="text-xs font-bold text-[#0F2440] font-mono">
              {Number(effectiveAverageRating || 5).toFixed(1)}
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-bold text-stone-600 font-display">
              {effectiveReviewCount} {effectiveReviewCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/60 font-display">
            <FiAward className="h-3.5 w-3.5 text-[#C99A3B] shrink-0" /> Handcrafted Sacred Arrival
          </span>
        )}

        {/* SKU Display */}
        {product.sku && (
          <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-mono">
            <FiHash className="h-3 w-3 shrink-0" /> {product.sku}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm leading-relaxed text-stone-600 border-l-2 border-[#C99A3B]/60 pl-3 py-0.5 font-body">
          {product.shortDescription}
        </p>
      )}

      {/* Material Highlight */}
      {product.material && (
        <div className="flex items-center gap-2 text-xs text-stone-700 font-body bg-stone-50 px-3 py-2 rounded-lg border border-slate-200/60">
          <FiFeather className="h-3.5 w-3.5 text-[#C99A3B] shrink-0" />
          <span className="font-bold text-[#0F2440]">Fabric:</span>
          <span className="font-medium text-stone-600">{product.material}</span>
        </div>
      )}
    </div>
  );
});

export default ProductInfo;
