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
    <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs backdrop-blur-md">
      {/* Mobile Top Sticky Bar + App Toolbar (<768px) */}
      {isMobile ? (
        <div className="flex flex-col gap-2.5">
          {/* Search Input */}
          <SearchInput
            placeholder="Search poshak, size, mukut, color..."
            value={searchInput}
            onChange={onSearchChange}
            onClear={onSearchClear}
            size="md"
            className="w-full h-12 rounded-full"
          />

          {/* App-Style Dual Action Toolbar */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-stone-50/90 text-xs font-bold text-stone-900 shadow-2xs active-tap-scale min-h-[44px]"
              aria-label="Open filter menu"
            >
              <FiFilter className="h-4 w-4 text-amber-800 shrink-0" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-amber-300 ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenMobileSort}
              className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/90 text-xs font-bold text-stone-900 shadow-2xs active-tap-scale min-h-[44px] px-3 overflow-hidden"
              aria-label="Open sort menu"
            >
              <FiArrowDown className="h-4 w-4 text-amber-800 shrink-0" />
              <span className="truncate">{currentSortLabel}</span>
            </button>
          </div>
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
