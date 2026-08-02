import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiX,
  FiClock,
  FiTrash2,
  FiFolder,
  FiArrowRight,
  FiChevronDown,
  FiGrid,
  FiTrendingUp,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useDebounce } from '@/hooks/useDebounce';
import { highlightMatch } from '@/utils/highlightMatch';
import { formatPrice } from '@/utils/formatPrice';
import { ROUTE_PATHS } from '@/routes/routePaths';

/**
 * Premium ecommerce search bar.
 *
 * Modes:
 *  - isMobileDrawer: compact inline form used inside the mobile drawer.
 *  - default: large luxury search bar with category dropdown + gold search
 *    button. Adapts responsively — on < md it becomes a full-width inline
 *    bar and suggestions open as a full-screen overlay.
 *
 * Backend integrations (unchanged): real product search via useProducts,
 * real category suggestions via useCategoryDropdown, recent searches via
 * useRecentSearches, ⌘K + "/" shortcuts, arrow-key navigation.
 */
export default function HeaderSearch({ isMobileDrawer = false, onCloseMobileDrawer, className = '' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState(null); // { id, name }
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const debouncedQuery = useDebounce(query.trim(), 300);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const modalInputRef = useRef(null);
  const catButtonRef = useRef(null);

  const { recentSearches, addSearchTerm, removeSearchTerm, clearAllSearches } = useRecentSearches();

  // Fetch real backend products matching debounced search term
  const { data: searchData, isLoading: isSearchLoading } = useProducts(
    debouncedQuery.length >= 2
      ? {
          search: debouncedQuery,
          page: 0,
          size: 6,
          ...(selectedCategory ? { categoryId: selectedCategory.id } : {}),
        }
      : null
  );

  // Fetch real categories from backend
  const { data: categoriesData } = useCategoryDropdown();

  // Format backend products response
  const searchResults = useMemo(() => {
    if (!searchData) return [];
    if (Array.isArray(searchData)) return searchData;
    return searchData.content || searchData.items || searchData.data || [];
  }, [searchData]);

  // Format backend categories for the category dropdown + suggestions
  const categoryList = useMemo(() => {
    const categories = Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData?.data || categoriesData?.content || [];
    return categories;
  }, [categoriesData]);

  // Filter matching categories for suggestions
  const matchingCategories = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    const q = debouncedQuery.toLowerCase();
    return categoryList
      .filter((cat) => cat.name?.toLowerCase().includes(q) || cat.slug?.toLowerCase().includes(q))
      .slice(0, 4);
  }, [categoryList, debouncedQuery]);

  // Combined flat list of focusable interactive items for keyboard navigation
  const selectableItems = useMemo(() => {
    const items = [];

    if (!debouncedQuery && recentSearches.length > 0) {
      recentSearches.forEach((term) => {
        items.push({ type: 'recent', term });
      });
    }

    if (debouncedQuery.length >= 2) {
      matchingCategories.forEach((cat) => {
        items.push({ type: 'category', category: cat });
      });

      searchResults.forEach((prod) => {
        items.push({ type: 'product', product: prod });
      });

      items.push({ type: 'view-all', query: debouncedQuery });
    }

    return items;
  }, [debouncedQuery, recentSearches, matchingCategories, searchResults]);

  // Handle Search Submission
  const executeSearch = useCallback(
    (searchTerm) => {
      const q = (searchTerm || query).trim();
      const params = new URLSearchParams();
      if (q) {
        params.set('search', encodeURIComponent(q));
        addSearchTerm(q);
      }
      if (selectedCategory) params.set('categoryId', selectedCategory.id);
      const qs = params.toString();
      navigate(qs ? `${ROUTE_PATHS.SHOP}?${qs}` : ROUTE_PATHS.SHOP);
      setIsOpen(false);
      setActiveIndex(-1);
      setCatDropdownOpen(false);
      if (onCloseMobileDrawer) onCloseMobileDrawer();
    },
    [query, selectedCategory, addSearchTerm, navigate, onCloseMobileDrawer]
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (activeIndex >= 0 && activeIndex < selectableItems.length) {
      const selected = selectableItems[activeIndex];
      if (selected.type === 'recent') executeSearch(selected.term);
      else if (selected.type === 'category') {
        navigate(`${ROUTE_PATHS.SHOP}?categoryId=${selected.category.id}`);
        setIsOpen(false);
      } else if (selected.type === 'product') {
        navigate(`/product/${selected.product.slug || selected.product.id}`);
        setIsOpen(false);
      } else if (selected.type === 'view-all') {
        executeSearch(selected.query);
      }
    } else {
      executeSearch();
    }
  };

  // Keyboard navigation & Shortcuts (⌘K, /, Escape, ArrowUp, ArrowDown)
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => (inputRef.current || modalInputRef.current)?.focus(), 50);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => (inputRef.current || modalInputRef.current)?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Handle local keys inside search component
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      setCatDropdownOpen(false);
      inputRef.current?.blur();
      modalInputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < selectableItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : selectableItems.length - 1));
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close category dropdown on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && catDropdownOpen) {
        setCatDropdownOpen(false);
        catButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [catDropdownOpen]);

  const hasNoResults =
    debouncedQuery.length >= 2 &&
    !isSearchLoading &&
    searchResults.length === 0 &&
    matchingCategories.length === 0;

  const activeCategoryName = selectedCategory?.name || 'All';

  /* ─────────────────── Shared suggestion content ─────────────────── */

  const renderSuggestions = ({ isModal = false, onNavigate } = {}) => {
    const close = () => {
      setIsOpen(false);
      setActiveIndex(-1);
      onNavigate?.();
    };

    return (
      <div className="space-y-4">
        {/* Loading Indicator */}
        {isSearchLoading && debouncedQuery.length >= 2 && (
          <div className="flex items-center justify-center gap-2 py-4 text-temple-gold-dark">
            <div className="h-4 w-4 rounded-full border-2 border-temple-gold border-t-transparent animate-spin" />
            <span className="text-xs font-semibold">Searching divine catalog...</span>
          </div>
        )}

        {/* State 1: Empty Query - Show Recent Searches */}
        {!debouncedQuery && (
          <div className="space-y-3">
            {recentSearches.length > 0 ? (
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <span className="text-[11px] font-bold text-temple-gold-dark uppercase tracking-wider flex items-center gap-1.5">
                    <FiClock className="h-3.5 w-3.5" /> Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearAllSearches}
                    className="text-[10px] text-natural-wood hover:text-rose-600 flex items-center gap-1"
                  >
                    <FiTrash2 className="h-3 w-3" /> Clear All
                  </button>
                </div>

                <div className="space-y-1">
                  {recentSearches.map((term, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <div
                        key={term}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-temple-gold/15 text-temple-gold-dark border border-temple-gold/40'
                            : 'text-dark-charcoal hover:bg-warm-cream/60 hover:text-deep-navy'
                        }`}
                        onClick={() => {
                          executeSearch(term);
                          close();
                        }}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="flex items-center gap-2">
                          <FiClock className="h-3.5 w-3.5 text-natural-wood" />
                          <span>{term}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearchTerm(term);
                          }}
                          className="text-natural-wood hover:text-rose-600 p-1"
                          title="Remove term"
                        >
                          <FiX className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-natural-wood space-y-2">
                <FiSearch className="h-6 w-6 text-temple-gold/40 mx-auto" />
                <p className="text-xs">
                  Type a keyword like <strong className="text-temple-gold-dark">Poshak</strong>,{' '}
                  <strong className="text-temple-gold-dark">Mukut</strong>, or{' '}
                  <strong className="text-temple-gold-dark">Bansuri</strong> to search.
                </p>
              </div>
            )}
          </div>
        )}

        {/* State 2: Query active - Show Category & Product Matches */}
        {debouncedQuery.length >= 2 && !isSearchLoading && (
          <div className="space-y-4">
            {/* Category Suggestions */}
            {matchingCategories.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-temple-gold-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FiFolder className="h-3.5 w-3.5" /> Matching Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        addSearchTerm(cat.name);
                        navigate(`${ROUTE_PATHS.SHOP}?categoryId=${cat.id}`);
                        close();
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-royal-blue hover:border-temple-gold/50 hover:bg-temple-gold/10 transition-colors"
                    >
                      <FiFolder className="h-3 w-3 text-temple-gold" />
                      <span>{highlightMatch(cat.name, debouncedQuery)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Suggestions */}
            {searchResults.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-temple-gold-dark uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Products ({searchResults.length})</span>
                  <span className="text-[10px] text-natural-wood font-normal">Select to view details</span>
                </div>

                <div className="space-y-2">
                  {searchResults.map((product, pIdx) => {
                    const globalIndex = matchingCategories.length + pIdx;
                    const isSelected = activeIndex === globalIndex;
                    const mainVariant = product.variants?.[0] || {};
                    const price = product.price || mainVariant.price || 0;
                    const discountPrice = product.discountPrice || mainVariant.discountPrice;
                    const inStock = (product.stockQuantity ?? mainVariant.stockQuantity ?? 1) > 0;

                    return (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug || product.id}`}
                        onClick={() => {
                          addSearchTerm(query);
                          close();
                        }}
                        className={`flex items-center gap-3 rounded-xl p-2.5 transition-all border ${
                          isSelected
                            ? 'bg-temple-gold/15 border-temple-gold/50 shadow-md'
                            : 'border-slate-200/80 bg-white hover:bg-warm-cream/50 hover:border-temple-gold/30'
                        }`}
                      >
                        <OptimizedImage
                          src={product.imageUrl}
                          alt={product.name}
                          aspectRatio="aspect-square"
                          className="h-12 w-12 rounded-lg object-cover bg-warm-cream border border-slate-200 shrink-0"
                          width={96}
                          height={96}
                        />
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-dark-charcoal text-xs truncate">
                              {highlightMatch(product.name, debouncedQuery)}
                            </span>
                            {product.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-temple-gold-dark bg-temple-gold/15 px-1.5 py-0.5 rounded-full border border-temple-gold/30 whitespace-nowrap">
                                <HiSparkles /> Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            {product.categoryName && (
                              <span className="text-natural-wood">{product.categoryName}</span>
                            )}
                            <span className={inStock ? 'text-success font-medium' : 'text-error font-medium'}>
                              {inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-temple-gold-dark">
                            {formatPrice(discountPrice || price)}
                          </div>
                          {discountPrice && discountPrice < price && (
                            <div className="text-[10px] text-natural-wood line-through">
                              {formatPrice(price)}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View All Search Results Button */}
            {searchResults.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  executeSearch(query);
                  close();
                }}
                className="w-full rounded-xl bg-temple-gold/10 border border-temple-gold/40 py-2.5 px-4 text-xs font-bold text-temple-gold-dark hover:bg-temple-gold hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span>View all matching results for "{query}"</span>
                <FiArrowRight className="h-4 w-4" />
              </button>
            )}

            {/* State 3: Empty Results Illustration */}
            {hasNoResults && (
              <div className="text-center py-8 space-y-3">
                <div className="relative mx-auto h-12 w-12 rounded-full bg-temple-gold/10 flex items-center justify-center border border-temple-gold/25 text-temple-gold">
                  <FiSearch className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-dark-charcoal">No divine items found</p>
                  <p className="text-xs text-natural-wood max-w-xs mx-auto">
                    We couldn't find anything matching "{query}".
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-natural-wood space-y-1 bg-warm-cream/60 p-3 rounded-xl border border-slate-200 max-w-xs mx-auto text-left">
                  <p className="font-bold text-temple-gold-dark">Search Tips:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Check your spelling for typos</li>
                    <li>Try generic terms like <strong className="text-dark-charcoal">Poshak</strong>, <strong className="text-dark-charcoal">Mukut</strong></li>
                    <li>Browse shop categories directly</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ─────────────────── Category dropdown trigger ─────────────────── */

  const categoryDropdownTrigger = (
    <button
      ref={catButtonRef}
      type="button"
      onClick={() => setCatDropdownOpen((v) => !v)}
      className="flex h-full shrink-0 items-center gap-1.5 rounded-l-full border-r border-slate-200 px-3 sm:px-4 text-xs font-bold text-royal-blue bg-warm-cream/40 hover:bg-warm-cream transition-colors min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-temple-gold/60"
      aria-expanded={catDropdownOpen}
      aria-haspopup="listbox"
      aria-label="Select search category"
      title="Filter search by category"
    >
      <FiGrid className="h-4 w-4 text-temple-gold" />
      <span className="hidden min-[420px]:inline max-w-[6.5rem] truncate">{activeCategoryName}</span>
      <FiChevronDown
        className={`h-3 w-3 text-natural-wood transition-transform duration-200 ${catDropdownOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const categoryDropdownPanel = (
    <AnimatePresence>
      {catDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_24px_60px_rgba(15,36,64,0.18)]"
          role="listbox"
          aria-label="Search categories"
        >
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setCatDropdownOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              !selectedCategory ? 'bg-temple-gold/10 text-temple-gold-dark' : 'text-dark-charcoal hover:bg-warm-cream/60'
            }`}
          >
            <FiGrid className="h-3.5 w-3.5" /> All Categories
          </button>
          {categoryList.length === 0 && (
            <p className="px-3 py-2 text-[10px] text-natural-wood">Loading categories...</p>
          )}
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory({ id: cat.id, name: cat.name });
                setCatDropdownOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                selectedCategory?.id === cat.id
                  ? 'bg-temple-gold/10 text-temple-gold-dark font-bold'
                  : 'text-dark-charcoal hover:bg-warm-cream/60'
              }`}
            >
              <FiFolder className="h-3.5 w-3.5 text-natural-wood" /> {cat.name}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ─────────────────── Search input bar (shared) ─────────────────── */

  const searchInputBar = (isModal = false) => (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="group relative flex w-full items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,36,64,0.06)] transition-all duration-300 focus-within:border-temple-gold focus-within:shadow-[0_8px_28px_rgba(201,154,59,0.16)] focus-within:ring-2 focus-within:ring-temple-gold/30 hover:shadow-[0_4px_18px_rgba(15,36,64,0.1)]"
    >
      {/* Category dropdown */}
      <div className="relative shrink-0">
        {categoryDropdownTrigger}
        {categoryDropdownPanel}
      </div>

      {/* Search input */}
      <div className="relative flex-1 min-w-0">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-natural-wood" />
        <input
          ref={isModal ? modalInputRef : inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Search products, categories, brands and more"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products, categories, brands and more..."
          className="h-full w-full min-w-0 border-0 bg-transparent py-2.5 pl-9 pr-9 text-sm text-dark-charcoal placeholder:text-natural-wood/70 focus:outline-none focus:ring-0"
        />
        {isSearchLoading && debouncedQuery.length >= 2 ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 rounded-full border-2 border-temple-gold border-t-transparent animate-spin" />
          </div>
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              (isModal ? modalInputRef : inputRef).current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-natural-wood hover:text-rose-600 p-1"
            aria-label="Clear search query"
          >
            <FiX className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="flex h-[44px] shrink-0 items-center gap-2 rounded-r-full bg-gradient-to-br from-temple-gold-light via-temple-gold to-temple-gold-dark px-4 sm:px-5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:brightness-105 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-temple-gold/60"
        aria-label="Search"
      >
        <FiSearch className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );

  /* ─────────────────── Mobile drawer compact version ─────────────────── */

  if (isMobileDrawer) {
    return (
      <div className="relative my-2 w-full">
        <form
          onSubmit={handleSubmit}
          className="group relative flex items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,36,64,0.05)] transition-all duration-300 focus-within:border-temple-gold focus-within:ring-2 focus-within:ring-temple-gold/25"
        >
          <FiSearch className="pointer-events-none absolute left-3.5 h-4 w-4 text-temple-gold" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search divine attire, mukuts, accessories..."
            className="w-full rounded-full border-0 bg-transparent py-3 pl-10 pr-9 text-sm text-dark-charcoal placeholder:text-natural-wood/70 focus:outline-none focus:ring-0"
            aria-label="Search catalog"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 text-natural-wood hover:text-rose-600"
              aria-label="Clear search query"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Mobile Suggestions Accordion */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 w-full rounded-[24px] border border-slate-200 bg-white p-3 text-xs shadow-[0_20px_48px_rgba(15,36,64,0.18)] space-y-3 max-h-80 overflow-y-auto"
            >
              {!debouncedQuery && recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-temple-gold-dark uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <FiClock /> Recent Searches
                    </span>
                    <button onClick={clearAllSearches} className="text-natural-wood hover:text-rose-600">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => executeSearch(term)}
                        className="flex items-center gap-1 bg-temple-gold/10 border border-temple-gold/25 px-2.5 py-1 rounded-lg text-temple-gold-dark hover:bg-temple-gold/20"
                      >
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {debouncedQuery.length >= 2 && (
                <div className="space-y-2">
                  {isSearchLoading && (
                    <div className="flex items-center justify-center gap-2 py-3 text-temple-gold-dark text-xs font-semibold">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-temple-gold border-t-transparent animate-spin" />
                      Searching...
                    </div>
                  )}
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.slug || prod.id}`}
                      onClick={() => {
                        addSearchTerm(query);
                        setIsOpen(false);
                        if (onCloseMobileDrawer) onCloseMobileDrawer();
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-lotus-white border border-slate-200 hover:border-temple-gold/40 text-dark-charcoal"
                    >
                      <img src={prod.imageUrl || '/placeholder.svg'} alt={prod.name} className="h-9 w-9 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate text-xs">{highlightMatch(prod.name, debouncedQuery)}</div>
                        <div className="text-[11px] text-temple-gold-dark font-bold">{formatPrice(prod.price)}</div>
                      </div>
                    </Link>
                  ))}
                  {hasNoResults && (
                    <div className="text-center py-4 text-natural-wood text-xs">
                      No results for "{query}"
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ─────────────────── Desktop inline + mobile modal ─────────────────── */

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Inline premium search bar (visible at all sizes) */}
      {searchInputBar(false)}

      {/* Desktop/Tablet floating suggestions panel (md+) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="hidden md:block absolute left-0 right-0 top-full mt-2 z-50 max-h-[75vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 text-xs text-dark-charcoal shadow-[0_24px_70px_rgba(15,36,64,0.22)]"
            role="listbox"
            aria-label="Search suggestions"
          >
            {renderSuggestions()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile full-screen search modal (< md) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-deep-navy/85 px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-3 backdrop-blur-md sm:px-4 sm:pt-16 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: -12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[28px] bg-white border border-slate-200 p-4 shadow-[0_28px_70px_rgba(15,36,64,0.34)] space-y-4 max-h-[calc(100dvh-1.5rem)] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-royal-blue uppercase tracking-wider flex items-center gap-2">
                  <FiTrendingUp className="h-4 w-4 text-temple-gold" /> Search Krishana Poshak
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 text-natural-wood transition-colors hover:border-temple-gold/40 hover:bg-warm-cream/60 hover:text-royal-blue"
                  aria-label="Close search overlay"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {searchInputBar(true)}

              <div className="max-h-[60vh] overflow-y-auto space-y-3 pt-2">
                {renderSuggestions({
                  onNavigate: () => {
                    if (onCloseMobileDrawer) onCloseMobileDrawer();
                  },
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

