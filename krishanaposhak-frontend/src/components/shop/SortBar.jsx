import { memo } from 'react';
import SearchInput from '@/components/forms/SearchInput';
import Select from '@/components/forms/Select';
import { FiFilter, FiCheckCircle } from 'react-icons/fi';

const SortBar = memo(function SortBar({
  searchInput,
  onSearchChange,
  onSearchClear,
  sort,
  onSortChange,
  sortOptions,
  onOpenMobileFilters,
  activeFilterCount = 0,
  totalElements = 0,
  isLoading = false,
  isMobile = false,
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between bg-white/95 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-amber-900/10 shadow-[0_2px_14px_rgba(44,40,36,0.03)] backdrop-blur-md">
      {/* Search Input and Mobile Filter Toggle */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SearchInput
          placeholder="Search poshak, size, mukut, color..."
          value={searchInput}
          onChange={onSearchChange}
          onClear={onSearchClear}
          size="md"
          className="flex-1"
        />

        {isMobile && (
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="flex h-12 sm:h-11 shrink-0 items-center justify-center gap-1.5 px-3 sm:px-4 rounded-2xl border border-amber-900/20 text-xs font-bold text-amber-950 bg-amber-50/90 shadow-2xs hover:bg-amber-100/80 active:scale-95 transition-all whitespace-nowrap min-h-[44px] min-w-[44px]"
            aria-label="Open filter sidebar"
          >
            <FiFilter className="h-4 w-4 text-amber-800 shrink-0" />
            <span className="hidden min-[360px]:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-900 text-[10px] font-bold text-white ml-0.5 shrink-0">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Item Count & Sort Selector */}
      <div className="flex items-center justify-between lg:justify-end gap-2.5 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-amber-900/10">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            {!isLoading ? `${totalElements} ${totalElements === 1 ? 'Item' : 'Items'}` : 'Searching...'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 min-[400px]:flex-initial justify-end max-w-[200px] sm:max-w-none">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-950 whitespace-nowrap hidden min-[540px]:inline">
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
  );
});

export default SortBar;
