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
      className={`fixed top-0 left-0 right-0 z-40 md:hidden bg-gradient-to-b from-deep-navy via-deep-navy to-[#142d4d] text-lotus-white shadow-lg transition-transform duration-300 ease-in-out pt-safe ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* ─── ROW 1: TOP APP BAR ─────────────────────────────────── */}
      <div className="flex items-center justify-between h-[52px] px-3 max-w-full">
        {/* Left: Brand Icon Logo ONLY (Text hidden on mobile) */}
        <Link
          to="/"
          aria-label="Kanhaji Poshak Kendra Home"
          className="touch-target flex items-center justify-center active-tap-scale rounded-full p-1"
        >
          <img
            src="/favicon.svg"
            alt="Kanhaji Poshak Kendra Logo"
            className="w-8 h-8 object-contain rounded-full bg-lotus-white/10 p-1 border border-temple-gold/40 shadow-sm"
            onError={(e) => {
              // Fallback to text initials icon if SVG fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-8 h-8 rounded-full bg-temple-gold text-deep-navy font-display font-bold text-xs items-center justify-center shadow-sm">
            KP
          </div>
        </Link>

        {/* Right: Wishlist, Cart & Menu Drawer Icons */}
        <div className="flex items-center gap-1">
          {/* Wishlist Link with Badge */}
          <Link
            to={ROUTE_PATHS.WISHLIST || '/customer/wishlist'}
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="touch-target relative text-lotus-white hover:text-temple-gold active-tap-scale rounded-full p-2"
          >
            <FiHeart className="w-5 h-5" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-temple-gold text-deep-navy text-[10px] font-bold rounded-full border border-deep-navy animate-badge-pop">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link with Badge */}
          <Link
            to={ROUTE_PATHS.CART || '/cart'}
            aria-label={`Cart (${cartCount} items)`}
            className="touch-target relative text-lotus-white hover:text-temple-gold active-tap-scale rounded-full p-2"
          >
            <FiShoppingBag className="w-5 h-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-temple-gold text-deep-navy text-[10px] font-bold rounded-full border border-deep-navy animate-badge-pop">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* App Menu Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open App Navigation Drawer"
            className="touch-target text-lotus-white hover:text-temple-gold active-tap-scale rounded-full p-2"
          >
            <FiMenu className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ─── ROW 2: SEARCH BAR WITH AUTOCOMPLETE ───────────────── */}
      <div className="px-3 pb-2 relative" ref={searchContainerRef}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch();
          }}
          role="search"
          className="relative flex items-center w-full"
        >
          <div className="relative flex items-center w-full h-[48px] bg-white rounded-full shadow-md overflow-hidden border border-muted-sand/50 focus-within:ring-2 focus-within:ring-temple-gold transition-all">
            {/* Search Icon */}
            <div className="pl-4 pr-2 text-natural-wood flex items-center justify-center">
              <FiSearch className="w-5 h-5" aria-hidden="true" />
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
              placeholder="Search Laddu Gopal Poshak, Mukut, Accessories..."
              aria-label="Search items"
              aria-autocomplete="list"
              aria-expanded={isSearchOpen}
              className="w-full h-full bg-transparent text-dark-charcoal placeholder:text-natural-wood/70 text-sm font-medium focus:outline-none pr-10"
            />

            {/* Loading Indicator or Clear Button */}
            {isSearchLoading ? (
              <div className="absolute right-3 text-temple-gold animate-spin">
                <FiLoader className="w-5 h-5" aria-hidden="true" />
              </div>
            ) : query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  if (searchInputRef.current) searchInputRef.current.focus();
                }}
                aria-label="Clear search input"
                className="touch-target absolute right-1 text-natural-wood hover:text-dark-charcoal p-2 active-tap-scale"
              >
                <FiX className="w-5 h-5" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </form>

        {/* ── Search Autocomplete & Recent Suggestions Dropdown ── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-3 right-3 top-[56px] z-50 bg-white rounded-2xl shadow-2xl border border-muted-sand/40 overflow-hidden text-dark-charcoal max-h-[70vh] flex flex-col"
            >
              {/* Active Search Live Product Results */}
              {debouncedQuery.length >= 2 ? (
                <div className="overflow-y-auto p-2">
                  <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-natural-wood">
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
                          className={`touch-target w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors active-tap-scale ${
                            selectedIndex === idx ? 'bg-temple-gold/15 text-deep-navy font-semibold' : 'hover:bg-warm-cream/60'
                          }`}
                        >
                          {/* Product Image Thumbnail */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-lotus-white shrink-0 border border-muted-sand/30">
                            <OptimizedImage
                              src={product.images?.[0]?.url || product.primaryImage || '/ogImage.jpeg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Name and Price */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-dark-charcoal">
                              {highlightMatch(product.name, debouncedQuery)}
                            </p>
                            <p className="text-[11px] font-bold text-temple-gold-dark">
                              {formatPrice(product.discountPrice || product.price)}
                            </p>
                          </div>

                          <FiArrowRight className="w-4 h-4 text-natural-wood shrink-0" aria-hidden="true" />
                        </button>
                      ))}

                      {/* View All Search Results Button */}
                      <button
                        type="button"
                        onClick={() => executeSearch()}
                        className="touch-target w-full py-2.5 px-3 bg-temple-gold/10 text-temple-gold-dark font-bold text-xs rounded-xl flex items-center justify-center gap-2 active-tap-scale mt-1"
                      >
                        <span>View all results for "{debouncedQuery}"</span>
                        <FiArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : !isSearchLoading ? (
                    <div className="p-4 text-center text-xs text-natural-wood">
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
                        <span className="text-[11px] font-bold uppercase tracking-wider text-natural-wood flex items-center gap-1.5">
                          <FiClock className="w-3.5 h-3.5" aria-hidden="true" />
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={clearAllSearches}
                          className="text-[11px] text-error hover:underline flex items-center gap-1 font-medium p-1"
                        >
                          <FiTrash2 className="w-3 h-3" aria-hidden="true" />
                          Clear all
                        </button>
                      </div>

                      <div className="space-y-1">
                        {recentSearches.map((term, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-warm-cream/60 group"
                          >
                            <button
                              type="button"
                              onClick={() => executeSearch(term)}
                              className="flex-1 flex items-center gap-2 text-xs text-dark-charcoal text-left font-medium active-tap-scale"
                            >
                              <FiClock className="w-3.5 h-3.5 text-natural-wood shrink-0" aria-hidden="true" />
                              <span className="truncate">{term}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSearchTerm(term)}
                              aria-label={`Remove search term ${term}`}
                              className="touch-target p-1 text-natural-wood hover:text-error rounded"
                            >
                              <FiX className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-natural-wood">
                      Start typing to search Poshak, Mukut & Devotional Accessories
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── ROW 3: HORIZONTAL SCROLL CATEGORY CHIPS ─────────────── */}
      <div className="w-full bg-deep-navy/80 border-t border-lotus-white/10 px-2 py-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory flex items-center gap-2">
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
              className={`snap-start shrink-0 touch-target h-[36px] min-w-[48px] px-3.5 rounded-full text-xs font-medium transition-all duration-150 active-tap-scale flex items-center justify-center ${
                isActive
                  ? 'bg-temple-gold text-deep-navy font-bold shadow-md scale-105'
                  : 'bg-white/10 text-lotus-white hover:bg-white/20 border border-white/15'
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
