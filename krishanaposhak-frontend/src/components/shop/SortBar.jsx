import { memo } from 'react';
import SearchInput from '@/components/forms/SearchInput';
import Select from '@/components/forms/Select';
import { FiFilter, FiArrowDown, FiCheckCircle } from 'react-icons/fi';

const SortBar = memo(function SortBar({
  searchInput,
  onSearchChange,
  onSearchClear,
  sort,
  onSortChange,
  sortOptions,
  onOpenMobileFilters,
  onOpenMobileSort,
  activeFilterCount = 0,
  totalElements = 0,
  isLoading = false,
  isMobile = false,
}) {
  const currentSortLabel = sortOptions?.find((o) => o.value === sort)?.label || 'Sort';

  return (
    <div className="bg-transparent sm:bg-white p-0 sm:p-4 rounded-none sm:rounded-3xl border-0 sm:border border-stone-200/80 shadow-none sm:shadow-xs">
      {/* Mobile Sticky Compact Filter Chips Bar (<768px) */}
      {isMobile ? (
        <div className="sticky top-[116px] z-30 bg-stone-50/95 backdrop-blur-md py-1.5 -mx-3 px-3 border-b border-stone-200/50 shadow-2xs overflow-x-auto scrollbar-hide flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileSort}
            className="shrink-0 h-[36px] px-3.5 rounded-[12px] border border-stone-200/80 bg-white text-[12px] font-semibold text-stone-900 shadow-2xs active-tap-scale flex items-center gap-1.5"
            aria-label="Open sort menu"
          >
            <FiArrowDown className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="truncate max-w-[110px]">{currentSortLabel}</span>
          </button>

          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="shrink-0 h-[36px] px-3.5 rounded-[12px] border border-stone-200/80 bg-white text-[12px] font-semibold text-stone-900 shadow-2xs active-tap-scale flex items-center gap-1.5"
            aria-label="Open filter menu"
          >
            <FiFilter className="w-4 h-4 text-amber-800 shrink-0" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-amber-300 ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="shrink-0 h-[36px] px-3.5 rounded-[12px] border border-stone-200/80 bg-white text-[12px] font-medium text-stone-700 shadow-2xs active-tap-scale flex items-center gap-1"
          >
            <span>Price</span>
          </button>

          <button
            type="button"
            onClick={() => onSortChange && onSortChange('createdAt,desc')}
            className="shrink-0 h-[36px] px-3.5 rounded-[12px] border border-stone-200/80 bg-white text-[12px] font-medium text-stone-700 shadow-2xs active-tap-scale flex items-center gap-1"
          >
            <span>Newest</span>
          </button>
        </div>
      ) : (
        /* Desktop Layout (>=768px) - UNTOUCHED */
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SearchInput
              placeholder="Search poshak, size, mukut, color..."
              value={searchInput}
              onChange={onSearchChange}
              onClear={onSearchClear}
              size="md"
              className="flex-1"
            />
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-2.5 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-stone-200/80">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>
                {!isLoading ? `${totalElements} ${totalElements === 1 ? 'Item' : 'Items'}` : 'Searching...'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-1 min-[400px]:flex-initial justify-end max-w-[200px] sm:max-w-none">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 whitespace-nowrap hidden min-[540px]:inline">
                Sort By:
              </span>
              <Select
                value={sort}
                onChange={onSortChange}
                options={sortOptions}
                size="sm"
                className="w-full sm:w-56 text-xs min-h-[44px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default SortBar;
