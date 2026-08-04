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
    <div className="flex flex-wrap items-center gap-2 pt-1 font-display">
      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950/70 mr-1">
        Active Filters:
      </span>
      <AnimatePresence>
        {filters.map((filter) => (
          <motion.span
            key={filter.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 px-3.5 py-1 text-xs font-bold text-amber-950 border border-amber-800/20 shadow-2xs"
          >
            <span>{filter.label}</span>
            <button
              type="button"
              onClick={filter.onClear}
              aria-label={`Remove filter ${filter.label}`}
              className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-amber-200/80 transition-colors"
            >
              <FiX className="h-3 w-3" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors ml-2 hover:underline"
      >
        <FiRotateCcw className="h-3 w-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
});

export default ActiveFilterChips;
