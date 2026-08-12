import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiX,
  FiClock,
  FiTrash2,
  FiArrowRight,
  FiChevronDown,
} from 'react-icons/fi';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useDebounce } from '@/hooks/useDebounce';
import { highlightMatch } from '@/utils/highlightMatch';
import { formatPrice } from '@/utils/formatPrice';
import { ROUTE_PATHS } from '@/routes/routePaths';

export default function HeaderSearch({ isMobileDrawer = false, mobileRow = false, onCloseMobileDrawer, className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query.trim(), 300);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const { recentSearches, addSearchTerm, removeSearchTerm, clearAllSearches } = useRecentSearches();

  // Fetch backend products matching search
  const { data: searchData, isLoading: isSearchLoading } = useProducts(
    debouncedQuery.length >= 2 ? { search: debouncedQuery, page: 0, size: 6 } : null
  );

  // Fetch backend categories for dropdown
  const { data: categoriesData } = useCategoryDropdown();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const categoryOptions = useMemo(() => {
    const raw = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || categoriesData?.content || [];
    return raw.map((cat) => ({ id: cat.id, name: cat.name }));
  }, [categoriesData]);

  const searchResults = useMemo(() => {
    if (!searchData) return [];
    if (Array.isArray(searchData)) return searchData;
    return searchData.content || searchData.items || searchData.data || [];
  }, [searchData]);

  const executeSearch = useCallback(
    (searchTerm) => {
      const q = (searchTerm || query).trim();
      if (q) addSearchTerm(q);
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (selectedCategoryId) params.set('categoryId', selectedCategoryId);
      const qs = params.toString();
      navigate({ pathname: ROUTE_PATHS.SHOP, search: qs ? `?${qs}` : '' });
      setIsOpen(false);
      if (onCloseMobileDrawer) onCloseMobileDrawer();
    },
    [query, selectedCategoryId, addSearchTerm, navigate, onCloseMobileDrawer]
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    executeSearch();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasNoResults = debouncedQuery.length >= 2 && !isSearchLoading && searchResults.length === 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Luxury Pill Search Container */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="group relative flex h-[44px] w-full items-center overflow-hidden rounded-full border border-slate-200/90 bg-slate-50/80 pl-3.5 pr-1 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:shadow-xs focus-within:bg-white focus-within:border-[#C99A3B] focus-within:ring-2 focus-within:ring-[#C99A3B]/20"
      >
        {/* Left Search Icon */}
        <div className="flex shrink-0 items-center text-slate-400 transition-colors group-focus-within:text-[#C99A3B]">
          <FiSearch className="h-4 w-4" />
        </div>

        {/* Input & Clear Button Area */}
        <div className="relative flex h-full flex-1 min-w-0 items-center px-2.5">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for Poshak, Mukut, Jewellery..."
            className="h-full w-full border-0 bg-transparent py-2.5 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400/90 focus:outline-none focus:ring-0 pr-7"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-1 flex items-center justify-center p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 rounded-full transition-colors"
              aria-label="Clear input"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Floating Temple Gold Search Button */}
        <button
          type="submit"
          className="flex h-[36px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B8860B] px-4 sm:px-5 text-slate-950 shadow-2xs transition-all duration-150 hover:brightness-105 hover:shadow-xs active:scale-[0.97]"
          aria-label="Submit search"
        >
          <FiSearch className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
          <span className="font-extrabold text-[11px] sm:text-xs tracking-wider uppercase whitespace-nowrap">
            Search
          </span>
        </button>
      </form>

      {/* Floating Suggestions Panel */}
      <AnimatePresence>
        {isOpen && (debouncedQuery.length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl text-xs text-slate-800"
          >
            {/* Loading State */}
            {isSearchLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-[#C99A3B]">
                <div className="h-4 w-4 rounded-full border-2 border-[#C99A3B] border-t-transparent animate-spin" />
                <span className="font-medium text-slate-700">Searching catalog...</span>
              </div>
            )}

            {/* Recent Searches */}
            {!debouncedQuery && recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <FiClock className="h-3.5 w-3.5 text-[#C99A3B]" /> Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearAllSearches}
                    className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-[10px]"
                  >
                    <FiTrash2 className="h-3 w-3" /> Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => executeSearch(term)}
                      className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-amber-100 hover:text-amber-900 cursor-pointer transition-colors"
                    >
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSearchTerm(term);
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Product Matches */}
            {debouncedQuery.length >= 2 && !isSearchLoading && searchResults.length > 0 && (
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Products ({searchResults.length})
                </div>
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug || product.id}`}
                      onClick={() => {
                        addSearchTerm(query);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-200"
                    >
                      <OptimizedImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        width={80}
                        height={80}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-xs truncate">
                          {highlightMatch(product.name, debouncedQuery)}
                        </p>
                        <p className="text-[11px] text-[#B8860B] font-bold">
                          {formatPrice(product.discountPrice || product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => executeSearch(query)}
                  className="w-full rounded-xl bg-amber-50/80 border border-amber-200/80 py-2.5 text-xs font-bold text-amber-950 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View all matching results for "{query}"</span>
                  <FiArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Empty state */}
            {hasNoResults && (
              <div className="text-center py-6 text-slate-500 space-y-1">
                <p className="font-bold text-slate-800">No items found</p>
                <p className="text-xs text-slate-500">We couldn't find anything matching "{query}".</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
