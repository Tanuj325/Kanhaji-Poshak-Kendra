import { memo } from 'react';
import { cn } from '@/utils/cn';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';

const VariantSelector = memo(function VariantSelector({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) return null;

  const activeVariants = variants.filter((v) => v.active !== false);

  return (
    <div className="space-y-3 font-display">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
          <span>Select Poshak Size</span>
          {selectedVariant && (
            <span className="text-amber-800 font-extrabold normal-case">
              — Size {selectedVariant.size}
            </span>
          )}
        </label>
        <button
          type="button"
          className="text-xs text-amber-900 hover:text-amber-700 font-bold underline cursor-pointer transition-colors"
        >
          Size Guide
        </button>
      </div>

      {/* Variant Pills Grid - Minimum 44px touch target on mobile */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3" role="radiogroup" aria-label="Select poshak size variant">
        {activeVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock <= 0;
          const variantPrice = variant.discountPrice || variant.price;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Size ${variant.size}${isOutOfStock ? ' - Out of stock' : ''}`}
              disabled={isOutOfStock}
              onClick={() => onSelect(variant)}
              className={cn(
                'relative flex flex-col items-center justify-center min-w-[3.75rem] sm:min-w-[4.25rem] min-h-[44px] px-3.5 py-2 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/50 font-display',
                isSelected
                  ? 'border-amber-800 bg-amber-100/80 text-amber-950 font-bold shadow-sm ring-2 ring-amber-800/20 scale-[1.02]'
                  : 'border-amber-900/15 bg-white text-stone-800 hover:border-amber-700/50 hover:bg-amber-50/50',
                isOutOfStock && 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400',
              )}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-bold uppercase">{variant.size}</span>
                {isSelected && <FiCheck className="h-3.5 w-3.5 text-amber-800" />}
              </div>

              {variantPrice && (
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 mt-0.5 font-mono">
                  ₹{Number(variantPrice).toFixed(0)}
                </span>
              )}

              {isOutOfStock && (
                <span className="absolute -top-1.5 -right-1 text-[8px] font-extrabold uppercase bg-rose-700 text-white px-1.5 py-0.2 rounded-md shadow-xs">
                  OOS
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Variant Stock & SKU Status */}
      {selectedVariant && (
        <div className="flex items-center justify-between text-xs sm:text-sm pt-1 flex-wrap gap-2">
          {selectedVariant.sku && (
            <span className="text-stone-500 font-mono text-xs">
              SKU: <strong className="text-amber-950">{selectedVariant.sku}</strong>
            </span>
          )}

          {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-lg border border-amber-800/20">
              <FiAlertCircle className="h-3.5 w-3.5 text-amber-800" /> Only {selectedVariant.stock} left in stock!
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export default VariantSelector;
