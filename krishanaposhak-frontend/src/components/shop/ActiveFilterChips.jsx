import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiRotateCcw } from 'react-icons/fi';

const ActiveFilterChips = memo(function ActiveFilterChips({
  search,
  categoryId,
  minPrice,
  maxPrice,
  inStockOnly,
  rating,
  discount,
  categories = [],
  onClearSearch,
  onClearCategory,
  onClearPrice,
  onClearStock,
  onClearRating,
  onClearDiscount,
  onClearAll,
}) {
  const categoryName = categoryId
    ? categories.find((c) => String(c.id) === categoryId)?.name
    : null;

  const filters = [
    { id: 'search', label: `Search: "${search}"`, show: !!search, onClear: onClearSearch },
    { id: 'category', label: `Category: ${categoryName}`, show: !!categoryName, onClear: onClearCategory },
    { id: 'price', label: minPrice || maxPrice ? `Price: ₹${minPrice || '0'} - ₹${maxPrice || '∞'}` : null, show: !!(minPrice || maxPrice), onClear: onClearPrice },
    { id: 'stock', label: 'In Stock Only', show: inStockOnly, onClear: onClearStock },
    { id: 'rating', label: rating ? `Rating: ${rating}★ & above` : null, show: !!rating, onClear: onClearRating },
    { id: 'discount', label: discount ? `${discount}% Off or more` : null, show: !!discount, onClear: onClearDiscount },
  ].filter((f) => f.show);

  if (!filters.length) return null;

  return (
    <div className="flex items-center gap-2 pt-1 font-display overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-amber-200 sm:flex-wrap">
      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950/70 mr-1 shrink-0">
        Active Filters:
      </span>
      <div className="flex items-center gap-2 shrink-0 sm:shrink sm:flex-wrap">
        <AnimatePresence>
          {filters.map((filter) => (
            <motion.span
              key={filter.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 px-3 py-1 text-xs font-bold text-amber-950 border border-amber-800/20 shadow-2xs whitespace-nowrap"
            >
              <span>{filter.label}</span>
              <button
                type="button"
                onClick={filter.onClear}
                aria-label={`Remove filter ${filter.label}`}
                className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-amber-900 hover:bg-amber-200/80 transition-colors focus:outline-none min-h-[44px] min-w-[44px] -my-2 -mr-1.5"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors ml-1 hover:underline whitespace-nowrap min-h-[44px] px-1"
        >
          <FiRotateCcw className="h-3 w-3" />
          <span>Clear All</span>
        </button>
      </div>
    </div>
  );
});

export default ActiveFilterChips;
