import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';

const VariantSelector = memo(function VariantSelector({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) return null;

  const activeVariants = variants.filter((v) => v.active !== false);

  return (
    <div className="space-y-2.5 font-display">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <span>Select Poshak Size</span>
          {selectedVariant && (
            <span className="text-[#C99A3B] font-extrabold normal-case">
              — Size {selectedVariant.size}
            </span>
          )}
        </label>
        <button
          type="button"
          className="text-xs text-[#0F2440] hover:text-[#C99A3B] font-bold underline cursor-pointer transition-colors uppercase tracking-wide"
        >
          Size Guide
        </button>
      </div>

      {/* Variant Pills Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none flex-wrap" role="radiogroup" aria-label="Select poshak size variant">
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
              whileHover={!isOutOfStock ? { scale: 1.02 } : undefined}
              whileTap={!isOutOfStock ? { scale: 0.97 } : undefined}
              className={cn(
                'relative flex-shrink-0 flex flex-col items-center justify-center min-w-[3.5rem] min-h-[44px] px-3.5 py-1.5 rounded-xl border-2 transition-all duration-150 focus:outline-none font-display cursor-pointer',
                isSelected
                  ? 'border-[#C99A3B] bg-amber-50/70 text-[#0F2440] font-bold shadow-2xs ring-2 ring-[#C99A3B]/20'
                  : 'border-slate-200/90 bg-white text-stone-700 hover:border-slate-300 font-medium',
                isOutOfStock && 'opacity-35 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400',
              )}
            >
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="text-xs font-bold uppercase">{variant.size}</span>
                {isSelected && <FiCheck className="h-3.5 w-3.5 text-[#C99A3B] shrink-0" />}
              </div>

              {variantPrice && (
                <span className={cn(
                  'text-[10px] font-semibold font-mono whitespace-nowrap',
                  isSelected ? 'text-[#C99A3B]' : 'text-stone-500',
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
          className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80 w-fit"
        >
          <FiAlertCircle className="h-3.5 w-3.5 text-[#C99A3B]" /> Only {selectedVariant.stock} left in stock!
        </motion.div>
      )}

      {/* SKU Display */}
      {selectedVariant?.sku && (
        <span className="text-stone-500 font-mono text-xs block">
          SKU: <strong className="text-[#0F2440]">{selectedVariant.sku}</strong>
        </span>
      )}
    </div>
  );
});

export default VariantSelector;
