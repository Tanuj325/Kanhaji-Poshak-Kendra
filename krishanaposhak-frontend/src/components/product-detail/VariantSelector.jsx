import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';

const VariantSelector = memo(function VariantSelector({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) return null;

  const activeVariants = variants.filter((v) => v.active !== false);

  return (
    <div className="space-y-3 font-display">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
          <span>Select Poshak Size</span>
          {selectedVariant && (
            <span className="text-deep-navy font-extrabold normal-case">
              — Size {selectedVariant.size}
            </span>
          )}
        </label>
        <button
          type="button"
          className="text-[11px] sm:text-xs text-deep-navy hover:text-royal-blue font-bold underline cursor-pointer transition-colors uppercase tracking-wide"
        >
          Size Guide
        </button>
      </div>

      {/* Variant Pills Grid */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5" role="radiogroup" aria-label="Select poshak size variant">
        {activeVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock <= 0;
          const variantPrice = variant.discountPrice || variant.price;

          return (
            <motion.button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Size ${variant.size}${isOutOfStock ? ' - Out of stock' : ''}`}
              disabled={isOutOfStock}
              onClick={() => onSelect(variant)}
              whileHover={!isOutOfStock ? { scale: 1.05 } : undefined}
              whileTap={!isOutOfStock ? { scale: 0.97 } : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center min-w-[3.5rem] sm:min-w-[4rem] min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/50 font-display',
                isSelected
                  ? 'border-amber-800 bg-amber-900 text-amber-50 font-bold shadow-md ring-2 ring-amber-800/20'
                  : 'border-amber-900/15 bg-white text-stone-800 hover:border-amber-700/50 hover:bg-amber-50/50',
                isOutOfStock && 'opacity-35 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400',
              )}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm font-bold uppercase">{variant.size}</span>
                {isSelected && <FiCheck className="h-3.5 w-3.5 text-amber-200" />}
              </div>

              {variantPrice && (
                <span className={cn(
                  'text-[10px] sm:text-[11px] font-semibold mt-0.5 font-mono',
                  isSelected ? 'text-amber-200/80' : 'text-stone-500',
                )}>
                  ₹{Number(variantPrice).toFixed(0)}
                </span>
              )}

              {isOutOfStock && (
                <span className="absolute -top-1.5 -right-1 text-[7px] font-extrabold uppercase bg-rose-700 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                  OOS
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Stock Warning */}
      {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-800/20 w-fit"
        >
          <FiAlertCircle className="h-3.5 w-3.5 text-amber-800" /> Only {selectedVariant.stock} left in stock!
        </motion.div>
      )}

      {/* SKU Display */}
      {selectedVariant?.sku && (
        <span className="text-stone-500 font-mono text-[11px] block">
          SKU: <strong className="text-amber-950">{selectedVariant.sku}</strong>
        </span>
      )}
    </div>
  );
});

export default VariantSelector;
