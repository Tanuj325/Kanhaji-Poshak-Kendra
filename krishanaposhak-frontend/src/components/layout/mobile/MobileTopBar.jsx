import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiSearch,
  FiX,
  FiHeart,
  FiShoppingBag,
  FiClock,
  FiTrash2,
  FiArrowRight,
  FiLoader,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useDebounce } from '@/hooks/useDebounce';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { highlightMatch } from '@/utils/highlightMatch';
import { formatPrice } from '@/utils/formatPrice';
import OptimizedImage from '@/components/ui/OptimizedImage';

/**
 * MobileTopBar (Phase M1 Redesign)
 * Native E-Commerce Shopping App Header (<768px) with 3 Rows:
 * Row 1: Logo (icon only, text hidden) + Action Icons (Wishlist, Cart, Menu) with animated badges
 * Row 2: Full-width 48-52px rounded Search Bar with Autocomplete & Keyboard Navigation
 * Row 3: Scrollable Horizontal Category Chips with active gold styling
 * Behavior: Smart sticky scroll (hides on scroll down, reveals on scroll up)
 */
export default function MobileTopBar({ onOpenDrawer }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get('categoryId') || searchParams.get('category') || 'all';

  const isVisible = useScrollDirection(60);
  const { cartCount } = useCartContext();
  const { wishlistCount } = useWishlistContext();

  // Search State
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query.trim(), 300);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { recentSearches, addSearchTerm, removeSearchTerm, clearAllSearches } = useRecentSearches();

  // Backend Products Search
  const { data: searchData, isLoading: isSearchLoading } = useProducts(
    debouncedQuery.length >= 2 ? { search: debouncedQuery, page: 0, size: 6 } : null
  );

  // Backend Category Chips
  const { data: categoriesData } = useCategoryDropdown();

  const categoryChips = useMemo(() => {
    const raw = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || categoriesData?.content || [];
    const items = raw.map((cat) => ({ id: cat.id, name: cat.name, slug: cat.slug }));
    return [{ id: 'all', name: 'All' }, ...items];
  }, [categoriesData]);

  const searchResults = useMemo(() => {
    if (!searchData) return [];
    if (Array.isArray(searchData)) return searchData;
    return searchData.content || searchData.items || searchData.data || [];
  }, [searchData]);

  const executeSearch = useCallback(
    (searchTerm) => {
      const q = (searchTerm !== undefined ? searchTerm : query).trim();
      if (q) addSearchTerm(q);
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      const qs = params.toString();
      navigate({ pathname: ROUTE_PATHS.SHOP, search: qs ? `?${qs}` : '' });
      setIsSearchOpen(false);
      if (searchInputRef.current) searchInputRef.current.blur();
    },
    [query, addSearchTerm, navigate]
  );

  const handleCategorySelect = (cat) => {
    if (cat.id === 'all') {
      navigate(ROUTE_PATHS.SHOP);
    } else {
      navigate(`${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`);
    }
  };

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e) => {
    if (!isSearchOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        const item = searchResults[selectedIndex];
        navigate(ROUTE_PATHS.PRODUCT_DETAIL.replace(':slug', item.slug || item.id));
        setIsSearchOpen(false);
      } else {
        executeSearch();
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  // Outside click to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 md:hidden bg-gradient-to-b from-deep-navy via-deep-navy to-[#142d4d] text-white shadow-md transition-transform duration-300 ease-in-out pt-safe ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* ─── ROW 1: APP HEADER BAR (Height: 46px) ─────────────── */}
      <div className="flex items-center justify-between h-[46px] px-4 max-w-full">
        {/* Left: Drawer Trigger Menu Icon */}
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open Navigation Drawer"
          className="flex h-10 w-10 items-center justify-center text-white hover:text-amber-300 active-tap-scale rounded-full"
        >
          <FiMenu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Center: "Kanhaji Poshak" Title ONLY */}
        <Link
          to="/"
          aria-label="Kanhaji Poshak Home"
          className="flex items-center active-tap-scale truncate"
        >
          <span className="font-heading text-sm font-extrabold text-white tracking-tight truncate">
            Kanhaji Poshak
          </span>
        </Link>

        {/* Right: Wishlist Icon ONLY */}
        <div className="flex items-center">
          <Link
            to={ROUTE_PATHS.WISHLIST || '/customer/wishlist'}
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="relative flex h-10 w-10 items-center justify-center text-white hover:text-amber-300 active-tap-scale rounded-full"
          >
            <FiHeart className="w-5 h-5" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 flex items-center justify-center bg-amber-400 text-stone-950 text-[9px] font-extrabold rounded-full border border-deep-navy shadow-xs">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ─── ROW 2: SEARCH BAR (Height: 36px) ────────────────── */}
      <div className="px-4 pb-1.5 relative" ref={searchContainerRef}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch();
          }}
          role="search"
          className="relative flex items-center w-full"
        >
          <div className="relative flex items-center w-full h-[36px] min-h-[36px] bg-white rounded-full shadow-xs overflow-hidden border border-stone-200/60 focus-within:ring-2 focus-within:ring-amber-500 transition-all">
            {/* Search Icon */}
            <div className="pl-3 pr-2 text-stone-400 flex items-center justify-center">
              <FiSearch className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
            </div>

            {/* Search Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search Poshak, Mukut, Size..."
              aria-label="Search items"
              aria-autocomplete="list"
              aria-expanded={isSearchOpen}
              className="w-full h-full bg-transparent text-stone-900 placeholder:text-stone-400 text-[11px] font-medium focus:outline-none pr-7"
            />

            {/* Loading Indicator or Clear Button */}
            {isSearchLoading ? (
              <div className="absolute right-2.5 text-amber-600 animate-spin">
                <FiLoader className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  if (searchInputRef.current) searchInputRef.current.focus();
                }}
                aria-label="Clear search input"
                className="absolute right-1.5 text-stone-400 hover:text-stone-900 p-1 active-tap-scale"
              >
                <FiX className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </form>

        {/* ── Search Autocomplete Dropdown ── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-4 right-4 top-[42px] z-50 bg-white rounded-2xl shadow-2xl border border-stone-200/80 overflow-hidden text-stone-900 max-h-[65vh] flex flex-col"
            >
              {/* Active Search Live Product Results */}
              {debouncedQuery.length >= 2 ? (
                <div className="overflow-y-auto p-2">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Matching Products ({searchResults.length})
                  </p>

                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((product, idx) => (
                        <button
                          key={product.id || idx}
                          type="button"
                          onClick={() => {
                            navigate(ROUTE_PATHS.PRODUCT_DETAIL.replace(':slug', product.slug || product.id));
                            setIsSearchOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors active-tap-scale ${
                            selectedIndex === idx ? 'bg-amber-500/15 text-stone-950 font-semibold' : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <OptimizedImage
                              src={product.images?.[0]?.url || product.primaryImage || '/ogImage.jpeg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-stone-900">
                              {highlightMatch(product.name, debouncedQuery)}
                            </p>
                            <p className="text-[11px] font-bold text-amber-700">
                              {formatPrice(product.discountPrice || product.price)}
                            </p>
                          </div>
                          <FiArrowRight className="w-4 h-4 text-stone-400 shrink-0" aria-hidden="true" />
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => executeSearch()}
                        className="w-full py-2 px-3 bg-amber-500/10 text-amber-900 font-bold text-xs rounded-xl flex items-center justify-center gap-2 active-tap-scale mt-1"
                      >
                        <span>View all results for "{debouncedQuery}"</span>
                        <FiArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : !isSearchLoading ? (
                    <div className="p-4 text-center text-xs text-stone-400">
                      No products found for "{debouncedQuery}"
                    </div>
                  ) : null}
                </div>
              ) : (
                /* Recent Searches Section */
                <div className="p-3">
                  {recentSearches.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between pb-2 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                          <FiClock className="w-3.5 h-3.5" aria-hidden="true" />
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={clearAllSearches}
                          className="text-[10px] text-rose-600 hover:underline flex items-center gap-1 font-medium p-1"
                        >
                          <FiTrash2 className="w-3 h-3" aria-hidden="true" />
                          Clear all
                        </button>
                      </div>

                      <div className="space-y-1">
                        {recentSearches.map((term, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-stone-50 group"
                          >
                            <button
                              type="button"
                              onClick={() => executeSearch(term)}
                              className="flex-1 flex items-center gap-2 text-xs text-stone-900 text-left font-medium active-tap-scale"
                            >
                              <FiClock className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
                              <span className="truncate">{term}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSearchTerm(term)}
                              aria-label={`Remove search term ${term}`}
                              className="p-1 text-stone-400 hover:text-rose-600 rounded"
                            >
                              <FiX className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-stone-400">
                      Start typing to search Poshak, Mukut & Accessories
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── ROW 3: CATEGORY CHIPS (Height: 24-26px Ultra Compact Strip) ── */}
      <div className="w-full bg-deep-navy/95 border-t border-white/10 px-3.5 py-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory flex items-center gap-1.5">
        {categoryChips.map((chip) => {
          const isActive =
            chip.id === 'all'
              ? activeCategoryParam === 'all' || !activeCategoryParam
              : String(chip.id) === String(activeCategoryParam);

          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => handleCategorySelect(chip)}
              className={`snap-start shrink-0 h-6 min-h-[24px] px-3 rounded-full text-[11px] font-semibold transition-all duration-150 active-tap-scale flex items-center justify-center ${
                isActive
                  ? 'bg-temple-gold text-dark-charcoal font-bold shadow-xs'
                  : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/15'
              }`}
            >
              <span className="truncate max-w-[120px]">{chip.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
