import { memo, useState, useEffect } from 'react';
import Checkbox from '@/components/forms/Checkbox';
import { FiSliders, FiRotateCcw, FiStar, FiTag, FiDollarSign, FiGrid, FiCheckSquare } from 'react-icons/fi';

const RATING_OPTIONS = [4, 3, 2, 1];
const DISCOUNT_OPTIONS = [
  { value: '50', label: '50% or more' },
  { value: '30', label: '30% or more' },
  { value: '20', label: '20% or more' },
  { value: '10', label: '10% or more' },
];

const FilterSidebarContent = memo(function FilterSidebarContent({
  categories = [],
  selectedCategoryId,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceReset,
  inStockOnly,
  onInStockChange,
  selectedRating,
  onRatingChange,
  selectedDiscount,
  onDiscountChange,
  onClearAll,
  hasActiveFilters,
}) {
  const [localMin, setLocalMin] = useState(minPrice || '');
  const [localMax, setLocalMax] = useState(maxPrice || '');

  useEffect(() => {
    setLocalMin(minPrice || '');
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice || '');
  }, [maxPrice]);

  const handleApplyPrice = (e) => {
    e?.preventDefault();
    onMinPriceChange(localMin);
    onMaxPriceChange(localMax);
  };

  return (
    <div className="space-y-6 font-display">
      {/* Category Filter Section */}
      <div className="pb-5 border-b border-stone-200/70">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5">
            <FiGrid className="h-3.5 w-3.5 text-[#C99A3B]" />
            <span>Categories</span>
          </h3>
          {selectedCategoryId && (
            <button
              type="button"
              onClick={() => onCategoryChange('')}
              className="text-[11px] font-bold text-[#C99A3B] hover:text-amber-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-200">
          <Checkbox
            label={<span className="text-xs font-semibold text-stone-800">All Collections</span>}
            checked={!selectedCategoryId}
            onChange={() => onCategoryChange('')}
            size="sm"
          />
          {categories.map((cat) => (
            <Checkbox
              key={cat.id}
              label={
                <span className="flex items-center justify-between gap-2 text-xs font-medium text-stone-700 w-full">
                  <span className="truncate">{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span className="text-[10px] text-stone-400 font-mono font-normal">
                      ({cat.productCount})
                    </span>
                  )}
                </span>
              }
              checked={selectedCategoryId === String(cat.id)}
              onChange={() => onCategoryChange(String(cat.id))}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Price Filter Section */}
      <div className="pb-5 border-b border-stone-200/70">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5">
            <FiDollarSign className="h-3.5 w-3.5 text-[#C99A3B]" />
            <span>Price Range (₹)</span>
          </h3>
          {(minPrice || maxPrice || localMin || localMax) && (
            <button
              type="button"
              onClick={() => {
                setLocalMin('');
                setLocalMax('');
                onPriceReset();
              }}
              className="text-[11px] font-bold text-[#C99A3B] hover:text-amber-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-600 z-10">
                ₹
              </span>
              <input
                type="number"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full rounded-xl border border-stone-200/90 bg-white py-2 pl-7 pr-2 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:border-[#C99A3B] focus:outline-none focus:ring-2 focus:ring-[#C99A3B]/20 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Minimum price in Rupees"
                min={0}
              />
            </div>
            <span className="text-stone-400 text-xs font-bold shrink-0">—</span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-600 z-10">
                ₹
              </span>
              <input
                type="number"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full rounded-xl border border-stone-200/90 bg-white py-2 pl-7 pr-2 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:border-[#C99A3B] focus:outline-none focus:ring-2 focus:ring-[#C99A3B]/20 shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Maximum price in Rupees"
                min={0}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-[#0F2440] hover:bg-[#1b3a5c] text-white py-2 px-3 text-xs font-bold transition-all min-h-[36px] shadow-xs active:scale-[0.98]"
          >
            Apply Price Filter
          </button>
        </form>
      </div>

      {/* Availability Filter Section */}
      <div className="pb-5 border-b border-stone-200/70">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5">
          <FiCheckSquare className="h-3.5 w-3.5 text-[#C99A3B]" />
          <span>Availability</span>
        </h3>
        <Checkbox
          label={<span className="text-xs font-medium text-stone-700">In Stock Items Only</span>}
          checked={inStockOnly}
          onChange={onInStockChange}
          size="sm"
        />
      </div>

      {/* Rating Filter Section */}
      <div className="pb-5 border-b border-stone-200/70">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5">
          <FiStar className="h-3.5 w-3.5 text-[#C99A3B] fill-amber-400" />
          <span>Customer Ratings</span>
        </h3>
        <div className="space-y-2">
          <Checkbox
            label={<span className="text-xs font-medium text-stone-700">All Ratings</span>}
            checked={!selectedRating}
            onChange={() => onRatingChange('')}
            size="sm"
          />
          {RATING_OPTIONS.map((stars) => (
            <Checkbox
              key={stars}
              label={
                <span className="inline-flex items-center gap-1 text-xs font-semibold">
                  <span className="text-amber-500 font-bold tracking-tight">
                    {'★'.repeat(stars)}
                    <span className="text-stone-300">{'★'.repeat(5 - stars)}</span>
                  </span>
                  <span className="text-stone-600 text-[11px] font-normal">& above</span>
                </span>
              }
              checked={selectedRating === String(stars)}
              onChange={() => onRatingChange(String(stars))}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Discount Filter Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5">
          <FiTag className="h-3.5 w-3.5 text-[#C99A3B]" />
          <span>Special Discounts</span>
        </h3>
        <div className="space-y-2">
          <Checkbox
            label={<span className="text-xs font-medium text-stone-700">All Items</span>}
            checked={!selectedDiscount}
            onChange={() => onDiscountChange('')}
            size="sm"
          />
          {DISCOUNT_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              label={<span className="text-xs font-medium text-stone-700">{opt.label}</span>}
              checked={selectedDiscount === opt.value}
              onChange={() => onDiscountChange(selectedDiscount === opt.value ? '' : opt.value)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Clear All Action */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onClearAll}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/50 py-2.5 px-4 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <FiRotateCcw className="h-3.5 w-3.5" /> Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
});

const FilterSidebar = memo(function FilterSidebar(props) {
  return (
    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0" aria-label="Catalog filters sidebar">
      <div className="sticky top-28 space-y-6 rounded-3xl bg-white p-6 border border-stone-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] font-display">
        <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200/70">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-[#0F2440] border border-amber-200/60 shadow-2xs">
            <FiSliders className="h-4 w-4 text-[#C99A3B]" />
          </div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2440] font-display">
            Refine Collection
          </h2>
        </div>
        <FilterSidebarContent {...props} />
      </div>
    </aside>
  );
});

export { FilterSidebarContent };
export default FilterSidebar;
