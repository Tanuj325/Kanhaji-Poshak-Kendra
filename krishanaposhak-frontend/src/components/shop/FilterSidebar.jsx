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
      <div className="pb-5 border-b border-stone-200/70 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5 font-display">
            <FiGrid className="h-3.5 w-3.5 text-[#C99A3B]" />
            <span>Categories</span>
          </h3>
          {selectedCategoryId && (
            <button
              type="button"
              onClick={() => onCategoryChange('')}
              className="text-[11px] font-bold text-[#C99A3B] hover:text-[#0F2440] transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-200">
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
                    <span className="text-[10px] text-stone-500 font-mono font-semibold bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/60 shrink-0">
                      {cat.productCount}
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
      <div className="pb-5 border-b border-stone-200/70 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5 font-display">
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
              className="text-[11px] font-bold text-[#C99A3B] hover:text-[#0F2440] transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#0F2440] z-10 font-mono">
                ₹
              </span>
              <input
                type="number"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-2.5 pl-4 pr-2 text-xs font-extrabold text-[#0F2440] placeholder:text-stone-400 focus:border-[#C99A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C99A3B]/20 transition-all shadow-2xs font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Minimum price in Rupees"
                min={0}
              />
            </div>
            <span className="text-stone-300 text-xs font-bold shrink-0">—</span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#0F2440] z-10 font-mono">
                ₹
              </span>
              <input
                type="number"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-2.5 pl-5 pr-2 text-xs font-extrabold text-[#0F2440] placeholder:text-stone-400 focus:border-[#C99A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C99A3B]/20 transition-all shadow-2xs font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Maximum price in Rupees"
                min={0}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-[#0F2440] via-[#1B3A5C] to-[#0F2440] hover:from-[#1B3A5C] hover:to-[#1B3A5C] text-white py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider transition-all min-h-[40px] shadow-xs active:scale-[0.98] border border-[#0F2440]"
          >
            Apply Price Filter
          </button>
        </form>
      </div>

      {/* Availability Filter Section */}
      <div className="pb-5 border-b border-stone-200/70 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5 font-display">
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
      <div className="pb-5 border-b border-stone-200/70 space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5 font-display">
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
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-amber-500 font-bold tracking-tight">
                    {'★'.repeat(stars)}
                    <span className="text-stone-300">{'★'.repeat(5 - stars)}</span>
                  </span>
                  <span className="text-stone-600 text-[11px] font-medium">& above</span>
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
        <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#0F2440] flex items-center gap-1.5 font-display">
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
              label={
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-xs font-medium text-stone-700">{opt.label}</span>
                </span>
              }
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/80 py-2.5 px-4 text-xs font-bold text-rose-800 transition-all shadow-2xs active:scale-[0.98]"
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
      <div className="sticky top-28 space-y-6 rounded-3xl bg-white p-6 border border-stone-200/80 shadow-[0_6px_30px_rgba(15,23,42,0.05)] font-display">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0F2440] text-[#F5E4B5] shadow-xs shrink-0">
              <FiSliders className="h-4.5 w-4.5 text-[#C99A3B]" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2440] font-display">
                Refine Collection
              </h2>
              <span className="text-[10px] text-stone-400 font-medium block">Filter catalog</span>
            </div>
          </div>
        </div>
        <FilterSidebarContent {...props} />
      </div>
    </aside>
  );
});

export { FilterSidebarContent };
export default FilterSidebar;
