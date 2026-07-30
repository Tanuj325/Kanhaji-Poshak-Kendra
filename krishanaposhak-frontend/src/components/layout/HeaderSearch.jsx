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
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiAward,
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

export default function HeaderSearch({ isMobileDrawer = false, onCloseMobileDrawer }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query.trim(), 300);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const modalInputRef = useRef(null);

  const { recentSearches, addSearchTerm, removeSearchTerm, clearAllSearches } = useRecentSearches();

  // Fetch real backend products matching debounced search term
  const { data: searchData, isLoading: isSearchLoading } = useProducts(
    debouncedQuery.length >= 2 ? { search: debouncedQuery, page: 0, size: 6 } : null
  );

  // Fetch real categories from backend
  const { data: categoriesData } = useCategoryDropdown();

  // Format backend products response
  const searchResults = useMemo(() => {
    if (!searchData) return [];
    if (Array.isArray(searchData)) return searchData;
    return searchData.content || searchData.items || searchData.data || [];
  }, [searchData]);

  // Format backend categories & filter matching ones
  const matchingCategories = useMemo(() => {
    const categories = Array.isArray(categoriesData)
      ? categoriesData
      : categoriesData?.data || categoriesData?.content || [];

    if (!debouncedQuery || debouncedQuery.length < 2) return [];

    const q = debouncedQuery.toLowerCase();
    return categories
      .filter((cat) => cat.name?.toLowerCase().includes(q) || cat.slug?.toLowerCase().includes(q))
      .slice(0, 4);
  }, [categoriesData, debouncedQuery]);

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
      if (q) {
        addSearchTerm(q);
        navigate(`${ROUTE_PATHS.SHOP}?search=${encodeURIComponent(q)}`);
      } else {
        navigate(ROUTE_PATHS.SHOP);
      }
      setIsOpen(false);
      setActiveIndex(-1);
      if (onCloseMobileDrawer) onCloseMobileDrawer();
    },
    [query, addSearchTerm, navigate, onCloseMobileDrawer]
  );

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (activeIndex >= 0 && activeIndex < selectableItems.length) {
      const selected = selectableItems[activeIndex];
      if (selected.type === 'recent') executeSearch(selected.term);
      else if (selected.type === 'category') {
        navigate(`${ROUTE_PATHS.SHOP}?category=${selected.category.id}`);
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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasNoResults =
    debouncedQuery.length >= 2 &&
    !isSearchLoading &&
    searchResults.length === 0 &&
    matchingCategories.length === 0;

  // Render Mobile Inline Version for Drawer
  if (isMobileDrawer) {
    return (
      <div className="relative w-full my-2 font-display">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <FiSearch className="absolute left-3.5 text-amber-400/80 h-4 w-4 pointer-events-none" />
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
            className="w-full rounded-xl border border-amber-400/25 bg-black/40 pl-10 pr-9 py-2.5 text-xs text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
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
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0B1728] p-3 text-xs shadow-2xl space-y-3 max-h-80 overflow-y-auto"
            >
              {/* Recent Searches */}
              {!debouncedQuery && recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><FiClock /> Recent Searches</span>
                    <button onClick={clearAllSearches} className="text-slate-400 hover:text-rose-400">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => executeSearch(term)}
                        className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-slate-200 hover:bg-amber-400/10 hover:text-amber-300"
                      >
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Search Items */}
              {debouncedQuery.length >= 2 && (
                <div className="space-y-2">
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.slug || prod.id}`}
                      onClick={() => {
                        addSearchTerm(query);
                        setIsOpen(false);
                        if (onCloseMobileDrawer) onCloseMobileDrawer();
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-amber-400/30 text-white"
                    >
                      <img src={prod.imageUrl || '/placeholder.svg'} alt={prod.name} className="h-9 w-9 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate text-xs">{highlightMatch(prod.name, debouncedQuery)}</div>
                        <div className="text-[11px] text-amber-300 font-bold">{formatPrice(prod.price)}</div>
                      </div>
                    </Link>
                  ))}
                  {hasNoResults && (
                    <div className="text-center py-4 text-slate-400 text-xs">
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

  // Header Search: Mobile Icon Button (< lg) + Desktop Inline Search Input (≥ lg)
  return (
    <div ref={containerRef} className="relative font-body">
      {/* 1. Mobile/Tablet Icon Button (< lg) */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => modalInputRef.current?.focus(), 50);
        }}
        className="flex lg:hidden items-center justify-center min-h-[44px] min-w-[44px] h-11 w-11 rounded-full text-muted-sand hover:text-temple-gold hover:bg-white/10 transition-all focus:outline-none"
        aria-label="Search catalog"
      >
        <FiSearch className="h-5 w-5" />
      </button>

      {/* 2. Desktop Input Bar (≥ lg) */}
      <form onSubmit={handleSubmit} className="hidden lg:flex items-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-temple-gold h-4 w-4 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="w-28 lg:w-36 xl:w-48 focus:w-44 xl:focus:w-56 rounded-full border border-temple-gold/30 bg-deep-navy/80 pl-8 pr-10 py-2 text-xs text-lotus-white placeholder:text-muted-sand/70 focus:border-temple-gold focus:outline-none focus:ring-1 focus:ring-temple-gold/40 transition-all duration-300 font-body shadow-inner truncate"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-sand hover:text-lotus-white p-1"
              aria-label="Clear search query"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[9px] font-mono text-temple-gold-light/70 border border-temple-gold/20 rounded px-1.5 py-0.5 bg-temple-gold/10 pointer-events-none">
              <span>⌘K</span>
            </div>
          )}
        </div>
      </form>

      {/* Desktop Floating Suggestions Panel (≥ lg) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block absolute right-0 top-full mt-2 z-50 w-[420px] max-w-[calc(100vw-32px)] rounded-2xl border border-amber-400/30 bg-[#0B1728]/98 backdrop-blur-2xl p-4 text-xs text-slate-200 shadow-2xl space-y-4 max-h-[75vh] overflow-y-auto"
            role="listbox"
          >
            {/* Loading Indicator */}
            {isSearchLoading && debouncedQuery.length >= 2 && (
              <div className="flex items-center justify-center gap-2 py-4 text-amber-300">
                <div className="h-4 w-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                <span className="text-xs font-semibold">Searching catalog...</span>
              </div>
            )}

            {/* State 1: Empty Query - Show Recent Searches */}
            {!debouncedQuery && (
              <div className="space-y-3">
                {recentSearches.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FiClock className="h-3.5 w-3.5" /> Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={clearAllSearches}
                        className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
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
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                            onClick={() => executeSearch(term)}
                          >
                            <span className="flex items-center gap-2">
                              <FiClock className="h-3.5 w-3.5 text-slate-400" />
                              <span>{term}</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSearchTerm(term);
                              }}
                              className="text-slate-400 hover:text-rose-400 p-1"
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
                  <div className="text-center py-6 text-slate-400 space-y-2">
                    <FiSearch className="h-6 w-6 text-amber-400/40 mx-auto" />
                    <p className="text-xs">Type a keyword like <strong className="text-amber-300">Poshak</strong>, <strong className="text-amber-300">Mukut</strong>, or <strong className="text-amber-300">Bansuri</strong> to search.</p>
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
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FiFolder className="h-3.5 w-3.5" /> Matching Categories
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchingCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`${ROUTE_PATHS.SHOP}?category=${cat.id}`}
                          onClick={() => {
                            addSearchTerm(cat.name);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-amber-200 hover:border-amber-400/40 hover:bg-amber-400/10 transition-colors"
                        >
                          <FiFolder className="h-3 w-3 text-amber-400" />
                          <span>{highlightMatch(cat.name, debouncedQuery)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Suggestions */}
                {searchResults.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Products ({searchResults.length})</span>
                      <span className="text-[10px] text-slate-400 font-normal">Select to view details</span>
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
                              setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 rounded-xl p-2.5 transition-all border ${
                              isSelected
                                ? 'bg-amber-400/15 border-amber-400/40 shadow-md'
                                : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/15'
                            }`}
                          >
                            <OptimizedImage
                              src={product.imageUrl}
                              alt={product.name}
                              aspectRatio="aspect-square font-display"
                              className="h-12 w-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                            />
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs truncate">
                                  {highlightMatch(product.name, debouncedQuery)}
                                </span>
                                {product.isFeatured && (
                                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                                    <HiSparkles /> Featured
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                {product.categoryName && (
                                  <span className="text-slate-400">{product.categoryName}</span>
                                )}
                                <span className={inStock ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                                  {inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold text-amber-300">
                                {formatPrice(discountPrice || price)}
                              </div>
                              {discountPrice && discountPrice < price && (
                                <div className="text-[10px] text-slate-400 line-through">
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
                    onClick={() => executeSearch(query)}
                    className="w-full rounded-xl bg-amber-400/10 border border-amber-400/30 py-2.5 px-4 text-xs font-bold text-amber-300 hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    <span>View all matching results for "{query}"</span>
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                )}

                {/* State 3: Empty Results Illustration */}
                {hasNoResults && (
                  <div className="text-center py-8 space-y-3">
                    <div className="relative mx-auto h-12 w-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400">
                      <FiSearch className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">No divine items found</p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        We couldn't find anything matching "<strong className="text-amber-300">{query}</strong>".
                      </p>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-400 space-y-1 bg-white/5 p-3 rounded-xl border border-white/10 max-w-xs mx-auto text-left">
                      <p className="font-bold text-amber-300">Search Tips:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Check your spelling for typos</li>
                        <li>Try generic terms like <strong className="text-white">Poshak</strong>, <strong className="text-white">Mukut</strong></li>
                        <li>Browse shop categories directly</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Full Modal Search Overlay (< lg) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md pt-16 px-4 font-display"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-[#0B1728] border border-amber-400/30 p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Search Krishana Poshak
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="relative flex items-center">
                <FiSearch className="absolute left-3.5 text-amber-400/80 h-4 w-4 pointer-events-none" />
                <input
                  ref={modalInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search divine attire, mukuts..."
                  className="w-full rounded-xl border border-amber-400/30 bg-black/40 pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-white"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </form>

              {/* Mobile Suggestions in Modal */}
              <div className="max-h-[60vh] overflow-y-auto space-y-3 pt-2">
                {isSearchLoading && debouncedQuery.length >= 2 && (
                  <div className="text-center py-4 text-amber-300 text-xs font-semibold">Searching...</div>
                )}
                {!debouncedQuery && recentSearches.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase">
                      <span>Recent Searches</span>
                      <button onClick={clearAllSearches} className="text-slate-400">Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => executeSearch(term)}
                          className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-slate-200 text-xs"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {debouncedQuery.length >= 2 && !isSearchLoading && (
                  <div className="space-y-2">
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.slug || prod.id}`}
                        onClick={() => {
                          addSearchTerm(query);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                      >
                        <img src={prod.imageUrl || '/placeholder.svg'} alt={prod.name} className="h-10 w-10 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs truncate">{highlightMatch(prod.name, debouncedQuery)}</div>
                          <div className="text-[11px] text-amber-300 font-bold">{formatPrice(prod.price)}</div>
                        </div>
                      </Link>
                    ))}
                    {hasNoResults && (
                      <div className="text-center py-4 text-slate-400 text-xs">No items found matching "{query}"</div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
