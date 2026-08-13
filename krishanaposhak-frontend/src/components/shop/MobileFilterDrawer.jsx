import { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiSearch } from 'react-icons/fi';
import { cn } from '@/utils/cn';

const RATING_OPTIONS = [4, 3, 2, 1];
const DISCOUNT_OPTIONS = [
  { value: '10', label: '10% & above' },
  { value: '20', label: '20% & above' },
  { value: '30', label: '30% & above' },
  { value: '40', label: '40% & above' },
  { value: '50', label: '50% & above' },
];

const MobileFilterDrawer = memo(function MobileFilterDrawer({
  isOpen,
  onClose,
  categories = [],
  brands = [],
  selectedCategoryId,
  onCategoryChange,
  minPrice = '',
  maxPrice = '',
  onMinPriceChange,
  onMaxPriceChange,
  onPriceRangeChange,
  onPriceReset,
  inStockOnly = false,
  onInStockChange,
  selectedRating = '',
  onRatingChange,
  selectedDiscount = '',
  onDiscountChange,
  onClearAll,
}) {
  const [localMin, setLocalMin] = useState(minPrice || '');
  const [localMax, setLocalMax] = useState(maxPrice || '');
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Apply price handler
  const handleApplyPrice = (e) => {
    e?.preventDefault();
    if (onPriceRangeChange) {
      onPriceRangeChange(localMin, localMax);
    } else {
      if (onMinPriceChange) onMinPriceChange(localMin);
      if (onMaxPriceChange) onMaxPriceChange(localMax);
    }
  };

  const handleApplyAllAndClose = () => {
    if (onPriceRangeChange) {
      onPriceRangeChange(localMin, localMax);
    } else {
      if (onMinPriceChange) onMinPriceChange(localMin);
      if (onMaxPriceChange) onMaxPriceChange(localMax);
    }
    onClose();
  };

  // Derive dynamic brand items (strictly from props/categories, NO hardcoded preset strings)
  const dynamicBrandList = useMemo(() => {
    if (Array.isArray(brands) && brands.length > 0) return brands;
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.map((c) => c.name).filter(Boolean);
    }
    return [];
  }, [brands, categories]);

  // Filtered brands by user search query
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return dynamicBrandList;
    return dynamicBrandList.filter((b) =>
      typeof b === 'string' && b.toLowerCase().includes(brandSearch.toLowerCase().trim())
    );
  }, [brandSearch, dynamicBrandList]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop Overlay (40% Black, 4px Blur, z-[60] to sit above MobileBottomNav) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[4px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 2. Native Mobile Drawer Shell (90vh Height, 28px Rounded Top Corners) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[60] flex h-[90vh] flex-col rounded-t-[28px] bg-white shadow-2xl overflow-hidden font-body"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile catalog filter drawer"
          >
            {/* ─── STICKY HEADER (60px Height) ─── */}
            <div className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between px-5 border-b border-black/[0.06] bg-white">
              {/* Left: Close Icon */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 hover:text-stone-900 active:scale-90 transition-transform"
              >
                <FiX className="h-5 w-5" />
              </button>

              {/* Center: Filters Title */}
              <h2 className="text-[16px] font-bold text-stone-900 tracking-tight">
                Filters
              </h2>

              {/* Right: Reset All */}
              <button
                type="button"
                onClick={() => {
                  setLocalMin('');
                  setLocalMax('');
                  setSelectedBrand('');
                  if (onClearAll) onClearAll();
                }}
                className="text-[13px] font-semibold text-amber-900 hover:text-amber-950 active:scale-95 transition-all"
              >
                Reset All
              </button>
            </div>

            {/* ─── SCROLLABLE BODY (Padding 20px, Gap 20px, Hidden Scrollbar) ─── */}
            <div className="flex-1 overflow-y-auto p-[20px] space-y-[20px] scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              
              {/* ─── SECTION 1: CATEGORIES (Pill Chips) ─── */}
              {categories.length > 0 && (
                <div className="pb-5 border-b border-black/[0.06]">
                  <h3 className="text-[14px] font-bold text-stone-900 mb-3">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => onCategoryChange && onCategoryChange('')}
                      className={cn(
                        'h-[36px] px-4 rounded-full text-xs transition-all duration-200 flex items-center justify-center whitespace-nowrap',
                        !selectedCategoryId
                          ? 'bg-temple-gold border border-temple-gold text-stone-950 font-bold shadow-xs'
                          : 'bg-white border border-[#E7E7E7] text-stone-700 font-semibold hover:border-stone-300'
                      )}
                    >
                      All Collections
                    </motion.button>
                    {categories.map((cat) => {
                      const isActive = selectedCategoryId === String(cat.id) || selectedCategoryId === cat.slug;
                      return (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          key={cat.id}
                          type="button"
                          onClick={() => onCategoryChange && onCategoryChange(isActive ? '' : String(cat.id))}
                          className={cn(
                            'h-[36px] px-4 rounded-full text-xs transition-all duration-200 flex items-center justify-center gap-1 whitespace-nowrap',
                            isActive
                              ? 'bg-temple-gold border border-temple-gold text-stone-950 font-bold shadow-xs'
                              : 'bg-white border border-[#E7E7E7] text-stone-700 font-semibold hover:border-stone-300'
                          )}
                        >
                          <span>{cat.name}</span>
                          {cat.productCount !== undefined && (
                            <span className={cn('text-[10px]', isActive ? 'text-stone-900' : 'text-stone-400')}>
                              ({cat.productCount})
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─── SECTION 2: PRICE RANGE (Dual 48px Rounded Inputs) ─── */}
              <div className="pb-5 border-b border-black/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-bold text-stone-900">
                    Price Range (₹)
                  </h3>
                  {(minPrice || maxPrice || localMin || localMax) && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalMin('');
                        setLocalMax('');
                        if (onPriceReset) onPriceReset();
                      }}
                      className="text-[11px] font-semibold text-amber-900 hover:text-amber-950"
                    >
                      Clear Price
                    </button>
                  )}
                </div>

                <form onSubmit={handleApplyPrice} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        className="h-[48px] w-full rounded-xl border border-[#E7E7E7] bg-stone-50 pl-7 pr-3 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white focus:outline-none transition-all"
                        min={0}
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        className="h-[48px] w-full rounded-xl border border-[#E7E7E7] bg-stone-50 pl-7 pr-3 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:border-amber-800 focus:bg-white focus:outline-none transition-all"
                        min={0}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-[40px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition-all"
                  >
                    Apply Price Filter
                  </button>
                </form>
              </div>

              {/* ─── SECTION 3: AVAILABILITY (iOS Style Switch) ─── */}
              <div className="pb-5 border-b border-black/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-stone-900">
                    In Stock Only
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={onInStockChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              </div>

              {/* ─── SECTION 4: RATING (Rating Cards) ─── */}
              <div className="pb-5 border-b border-black/[0.06]">
                <h3 className="text-[14px] font-bold text-stone-900 mb-3">
                  Customer Rating
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {RATING_OPTIONS.map((stars) => {
                    const isActive = selectedRating === String(stars);
                    return (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        key={stars}
                        type="button"
                        onClick={() => onRatingChange && onRatingChange(isActive ? '' : String(stars))}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-semibold',
                          isActive
                            ? 'bg-amber-50/90 border-amber-800 text-amber-950 font-bold shadow-2xs'
                            : 'bg-white border-[#E7E7E7] text-stone-700 hover:border-stone-300'
                        )}
                      >
                        <span className="flex items-center gap-1">
                          <span className="text-amber-500 font-bold text-sm">{'★'.repeat(stars)}</span>
                          <span className="text-stone-300 font-normal">{'★'.repeat(5 - stars)}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-stone-600">& above</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* ─── SECTION 5: DISCOUNT (Myntra Style Chips) ─── */}
              <div className="pb-5 border-b border-black/[0.06]">
                <h3 className="text-[14px] font-bold text-stone-900 mb-3">
                  Discount
                </h3>
                <div className="flex flex-wrap gap-2">
                  {DISCOUNT_OPTIONS.map((opt) => {
                    const isActive = selectedDiscount === opt.value;
                    return (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={opt.value}
                        type="button"
                        onClick={() => onDiscountChange && onDiscountChange(isActive ? '' : opt.value)}
                        className={cn(
                          'h-[36px] px-4 rounded-full text-xs transition-all duration-200 flex items-center justify-center whitespace-nowrap',
                          isActive
                            ? 'bg-temple-gold border border-temple-gold text-stone-950 font-bold shadow-xs'
                            : 'bg-white border border-[#E7E7E7] text-stone-700 font-semibold hover:border-stone-300'
                        )}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* ─── SECTION 6: BRAND / COLLECTION (Dynamic Filter Chips) ─── */}
              {dynamicBrandList.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-bold text-stone-900 mb-3">
                    Brand / Collection
                  </h3>
                  {/* Search input on top */}
                  <div className="relative mb-3">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search brand or collection..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="h-[42px] w-full rounded-xl border border-[#E7E7E7] bg-stone-50 pl-10 pr-3 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-amber-800 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Dynamic Brand Chips */}
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                    {filteredBrands.map((b) => {
                      const isActive = selectedBrand === b;
                      return (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          key={b}
                          type="button"
                          onClick={() => setSelectedBrand(isActive ? '' : b)}
                          className={cn(
                            'h-[32px] px-3 rounded-lg text-[11px] transition-all duration-200 flex items-center justify-center whitespace-nowrap',
                            isActive
                              ? 'bg-stone-900 text-white font-bold'
                              : 'bg-stone-100 text-stone-700 font-medium hover:bg-stone-200'
                          )}
                        >
                          {b}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* ─── STICKY FOOTER (72px Height + Safe Area Bottom Inset) ─── */}
            <div className="sticky bottom-0 z-20 flex min-h-[72px] shrink-0 items-center gap-3 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-black/[0.06] bg-white">
              {/* Left: Reset Outlined Button */}
              <button
                type="button"
                onClick={() => {
                  setLocalMin('');
                  setLocalMax('');
                  setSelectedBrand('');
                  if (onClearAll) onClearAll();
                }}
                className="flex-1 flex h-[48px] items-center justify-center rounded-[16px] border border-stone-300 bg-white text-xs font-bold text-stone-800 active:scale-95 transition-all"
              >
                Reset
              </button>

              {/* Right: Apply Filters Temple Gold Button */}
              <button
                type="button"
                onClick={handleApplyAllAndClose}
                className="flex-[2] flex h-[48px] items-center justify-center gap-1.5 rounded-[16px] bg-temple-gold hover:bg-temple-gold-dark text-xs font-extrabold text-stone-950 shadow-md active:scale-95 transition-all"
              >
                <FiCheck className="w-4 h-4 stroke-[3]" />
                <span>Apply Filters</span>
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default MobileFilterDrawer;
