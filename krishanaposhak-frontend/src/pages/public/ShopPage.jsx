import { lazy, Suspense, useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '@/components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useRootCategories } from '@/hooks/useCategories';
import { useDebounce, useIsMobile } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { siteConfig } from '@/config/siteConfig';
import ProductCard from '@/components/cards/ProductCard';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Pagination from '@/components/navigation/Pagination';
import SearchInput from '@/components/forms/SearchInput';
import Select from '@/components/forms/Select';
import Checkbox from '@/components/forms/Checkbox';

const QuickViewModal = lazy(() => import('@/components/overlay/QuickViewModal'));
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';
import { FiFilter, FiX, FiSliders, FiStar, FiCheckCircle } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '✨ Newest Arrivals' },
  { value: 'price,asc', label: '💰 Price: Low to High' },
  { value: 'price,desc', label: '💎 Price: High to Low' },
  { value: 'name,asc', label: '🔤 Name: A to Z' },
  { value: 'name,desc', label: '🔤 Name: Z to A' },
];

const RATING_OPTIONS = [4, 3, 2, 1];
const PAGE_SIZE = 12;

function mapProductToCard(product) {
  return {
    id: product.id,
    variantId: product.variantId || product.variants?.[0]?.id || product.id,
    name: product.name,
    slug: product.slug,
    images: product.imageUrl ? [{ imageUrl: product.imageUrl }] : product.images || [],
    imageUrl: product.imageUrl,
    price: product.price || product.discountPrice,
    discountPrice: product.discountPrice,
    averageRating: product.averageRating || 0,
    reviewCount: product.reviewCount || 0,
    stock: product.stock ?? 10,
    category: product.categoryName || (product.category?.name) || null,
    categoryName: product.categoryName || (product.category?.name) || null,
    featured: product.featured,
    newArrival: product.newArrival,
    variants: product.variants || product.productVariants || [],
  };
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl bg-white p-3 border border-amber-900/10 shadow-xs">
          <Skeleton variant="rect" className="aspect-[4/5] w-full rounded-xl bg-amber-100/40" />
          <Skeleton variant="text" className="h-4 w-1/3 bg-amber-100/60" />
          <Skeleton variant="text" className="h-5 w-4/5 bg-amber-100/60" />
          <Skeleton variant="text" className="h-4 w-1/2 bg-amber-100/60" />
        </div>
      ))}
    </div>
  );
}

function FilterSidebar({
  categories,
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
  isMobile,
  isOpen,
  onClose,
}) {
  const content = (
    <div className="space-y-6 font-display">
      {/* Category Filter Section */}
      <div className="pb-5 border-b border-amber-900/10">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center justify-between">
          <span>Categories</span>
          {selectedCategoryId && (
            <button
              type="button"
              onClick={() => onCategoryChange('')}
              className="text-[11px] font-bold text-amber-800 hover:underline lowercase"
            >
              reset
            </button>
          )}
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
          <Checkbox
            label="All Categories"
            checked={!selectedCategoryId}
            onChange={() => onCategoryChange('')}
            size="sm"
          />
          {categories.map((cat) => (
            <Checkbox
              key={cat.id}
              label={`${cat.name}${cat.productCount ? ` (${cat.productCount})` : ''}`}
              checked={selectedCategoryId === String(cat.id)}
              onChange={() => onCategoryChange(String(cat.id))}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Price Filter Section */}
      <div className="pb-5 border-b border-amber-900/10">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-950">
          Price Range (₹)
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-bold">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full rounded-xl border border-amber-900/15 py-2 pl-6 pr-2 text-xs font-bold text-amber-950 focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 bg-amber-50/30"
              aria-label="Minimum price"
              min={0}
            />
          </div>
          <span className="text-stone-400 text-xs font-bold">—</span>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-500 font-bold">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full rounded-xl border border-amber-900/15 py-2 pl-6 pr-2 text-xs font-bold text-amber-950 focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700/20 bg-amber-50/30"
              aria-label="Maximum price"
              min={0}
            />
          </div>
        </div>
        {(minPrice || maxPrice) && (
          <button
            type="button"
            onClick={onPriceReset}
            className="mt-2 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
          >
            Reset Price Range
          </button>
        )}
      </div>

      {/* Availability Filter Section */}
      <div className="pb-5 border-b border-amber-900/10">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-950">
          Availability
        </h3>
        <Checkbox
          label="In Stock Only"
          checked={inStockOnly}
          onChange={onInStockChange}
          size="sm"
        />
      </div>

      {/* Rating Filter Section */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-950">
          Customer Rating
        </h3>
        <div className="space-y-2">
          <Checkbox
            label="All Ratings"
            checked={!selectedRating}
            onChange={() => onRatingChange('')}
            size="sm"
          />
          {RATING_OPTIONS.map((stars) => (
            <Checkbox
              key={stars}
              label={
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-amber-500 font-bold">
                    {'★'.repeat(stars)}
                    <span className="text-stone-300">{'★'.repeat(5 - stars)}</span>
                  </span>
                  <span className="text-stone-600">& above</span>
                </span>
              }
              checked={selectedRating === String(stars)}
              onChange={() => onRatingChange(String(stars))}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-xs"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Filter products catalog"
            >
              <div>
                <div className="mb-6 flex items-center justify-between pb-4 border-b border-amber-900/10">
                  <div className="flex items-center gap-2">
                    <FiSliders className="h-5 w-5 text-amber-800" />
                    <h2 className="text-lg font-bold text-amber-950 font-display">Refine Catalog</h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:text-amber-950 hover:bg-amber-50 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                {content}
              </div>

              <div className="pt-6 border-t border-amber-900/10 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md min-h-[44px]"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-28 space-y-6 rounded-3xl bg-white p-6 border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] backdrop-blur-md">
        <div className="flex items-center gap-2.5 pb-4 border-b border-amber-900/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100/80 text-amber-900">
            <FiSliders className="h-4 w-4" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950 font-display">
            Catalog Filters
          </h2>
        </div>
        {content}
      </div>
    </aside>
  );
}

function ActiveFilters({
  search,
  categoryId,
  minPrice,
  maxPrice,
  inStockOnly,
  rating,
  categories,
  onClearSearch,
  onClearCategory,
  onClearPrice,
  onClearStock,
  onClearRating,
  onClearAll,
}) {
  const categoryName = categoryId
    ? categories.find((c) => String(c.id) === categoryId)?.name
    : null;

  const filters = [
    { label: `Search: "${search}"`, show: !!search, onClear: onClearSearch },
    { label: `Category: ${categoryName}`, show: !!categoryName, onClear: onClearCategory },
    { label: minPrice || maxPrice ? `Price: ₹${minPrice || '0'} - ₹${maxPrice || '∞'}` : null, show: !!(minPrice || maxPrice), onClear: onClearPrice },
    { label: 'In Stock Only', show: inStockOnly, onClear: onClearStock },
    { label: rating ? `Rating: ${rating}★ & above` : null, show: !!rating, onClear: onClearRating },
  ].filter((f) => f.show);

  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 font-display">
      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Active Filters:</span>
      {filters.map((filter, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1 text-xs font-bold text-amber-950 border border-amber-800/20 shadow-2xs"
        >
          {filter.label}
          <button
            type="button"
            onClick={filter.onClear}
            className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 hover:bg-amber-200/60 transition-colors"
          >
            <FiX className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-rose-700 hover:underline transition-colors ml-1"
      >
        Clear All
      </button>
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { isAuthenticated } = useAuth();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const rating = searchParams.get('minRating') || '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set('search', debouncedSearch);
        } else {
          next.delete('search');
        }
        next.set('page', '1');
        return next;
      }, { replace: true });
    }
  }, [debouncedSearch]);

  const queryParams = useMemo(() => {
    const params = {
      page: page - 1,
      size: PAGE_SIZE,
      sort,
      active: true,
    };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (inStockOnly) params.inStock = true;
    if (rating) params.minRating = rating;
    return params;
  }, [page, sort, search, categoryId, minPrice, maxPrice, inStockOnly, rating]);

  const { data: productsData, isLoading, isError, error, refetch } = useProducts(queryParams);
  const { data: categoriesData } = useRootCategories();
  const { data: wishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const categories = useMemo(() => {
    const raw = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || categoriesData?.content || [];
    return raw.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productCount: cat.productCount,
    }));
  }, [categoriesData]);

  const productList = useMemo(() => {
    const raw = Array.isArray(productsData) ? productsData : productsData?.content || [];
    return raw.map(mapProductToCard);
  }, [productsData]);

  const totalPages = productsData?.totalPages || 1;
  const totalElements = productsData?.totalElements || 0;

  const wishlistVariantIds = useMemo(() => {
    if (!wishlist) return new Set();
    const items = Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || [];
    return new Set(items.map((item) => item.productVariantId || item.variantId || item.id));
  }, [wishlist]);

  const updateSearchParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== 'page') next.set('page', '1');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
    setSearchInput('');
  }, [setSearchParams]);

  const handleCategoryChange = useCallback((value) => {
    updateSearchParam('categoryId', value);
  }, [updateSearchParam]);

  const handleMinPriceChange = useCallback((value) => {
    updateSearchParam('minPrice', value);
  }, [updateSearchParam]);

  const handleMaxPriceChange = useCallback((value) => {
    updateSearchParam('maxPrice', value);
  }, [updateSearchParam]);

  const handlePriceReset = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('minPrice');
      next.delete('maxPrice');
      next.set('page', '1');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleInStockChange = useCallback(() => {
    updateSearchParam('inStock', inStockOnly ? '' : 'true');
  }, [updateSearchParam, inStockOnly]);

  const handleRatingChange = useCallback((value) => {
    updateSearchParam('minRating', value);
  }, [updateSearchParam]);

  const handleSortChange = useCallback((e) => {
    updateSearchParam('sort', e.target.value);
  }, [updateSearchParam]);

  const handlePageChange = useCallback((newPage) => {
    updateSearchParam('page', String(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateSearchParam]);

  const handleAddToCart = useCallback(
    (product) => {
      const targetVariantId = product?.variantId || product?.variants?.[0]?.id || product?.id;
      if (!targetVariantId) return;
      addToCartMutation.mutate({ productVariantId: targetVariantId, quantity: 1 });
    },
    [addToCartMutation],
  );

  const handleWishlistToggle = useCallback(
    (product) => {
      if (!isAuthenticated) return;
      const variantId = product?.variantId || product?.variants?.[0]?.id || product?.id;
      if (!variantId) return;
      if (wishlistVariantIds.has(variantId)) {
        removeFromWishlistMutation.mutate(variantId);
      } else {
        addToWishlistMutation.mutate({ productId: variantId });
      }
    },
    [isAuthenticated, wishlistVariantIds, addToWishlistMutation, removeFromWishlistMutation],
  );

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Shop Catalog' },
    ];
    const categoryName = categoryId ? categories.find((c) => String(c.id) === categoryId)?.name : null;
    if (categoryName) {
      items[2] = { label: categoryName };
    }
    return items;
  }, [categoryId, categories]);

  const shopSchemas = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Sacred Traditional Attire & Devotional Accessories Catalog',
      description: 'Explore our complete collection of handcrafted Laddoo Gopal Poshak, Radha Krishna dresses, designer mukuts, and temple ornaments from Meerut.',
      url: `${siteConfig.url}/shop`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Shop Catalog', item: `${siteConfig.url}/shop` },
      ],
    },
  ], []);

  return (
    <>
      <SEO
        title="Sacred Traditional Attire & Devotional Accessories Catalog"
        description="Explore our complete collection of handcrafted Laddoo Gopal Poshak, Radha Krishna dresses, designer mukuts, and temple ornaments from Meerut."
        canonicalUrl={`${siteConfig.url}/shop`}
        jsonLd={shopSchemas}
      />

      <div className="min-h-screen bg-lotus-white font-body">
        {/* Hero Banner Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-royal-blue-800 to-deep-navy text-lotus-white py-12 sm:py-16 px-4 shadow-elevated border-b border-temple-gold/20">
          <div className="container-page relative z-10">
            <Breadcrumb items={breadcrumbItems} className="mb-4 text-temple-gold-light/80" />
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-temple-gold/20 px-3.5 py-1 text-xs font-bold text-temple-gold border border-temple-gold/30">
                  <FiStar className="h-3.5 w-3.5 text-temple-gold fill-temple-gold" /> Authentic Meerut Handcrafts
                </span>
                <h1 className="text-3xl font-heading font-bold sm:text-4xl lg:text-5xl text-lotus-white tracking-tight leading-tight">
                  {categoryId
                    ? categories.find((c) => String(c.id) === categoryId)?.name || 'Sacred Collection'
                    : 'Devotional Attire Catalog'}
                </h1>
                <p className="text-xs sm:text-sm text-muted-sand leading-relaxed font-body">
                  Handcrafted Laddoo Gopal Poshak, Radha Krishna dresses, designer mukuts, and sacred ornaments crafted with devotion.
                </p>
              </div>

              {!isLoading && (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-bold text-temple-gold border border-temple-gold/20 shadow-gold">
                  <FiCheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>{totalElements} Sacred Items Listed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container-page py-8">
          {/* Horizontal Category Pill Bar */}
          {categories.length > 0 && (
            <div className="mb-8 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
              <button
                type="button"
                onClick={() => handleCategoryChange('')}
                className={cn(
                  'rounded-2xl px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-200 border min-h-[44px]',
                  !categoryId
                    ? 'bg-temple-gold text-dark-charcoal border-temple-gold shadow-gold scale-105 font-bold'
                    : 'bg-white text-dark-charcoal border-temple-gold/15 hover:border-temple-gold/40 hover:bg-warm-cream/50',
                )}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(String(cat.id))}
                  className={cn(
                    'rounded-2xl px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-200 border min-h-[44px]',
                    categoryId === String(cat.id)
                      ? 'bg-temple-gold text-dark-charcoal border-temple-gold shadow-gold scale-105 font-bold'
                      : 'bg-white text-dark-charcoal border-temple-gold/15 hover:border-temple-gold/40 hover:bg-warm-cream/50',
                  )}
                >
                  {cat.name}
                  {cat.productCount ? ` (${cat.productCount})` : ''}
                </button>
              ))}
            </div>
          )}

          {/* Controls Bar: Search & Sorting */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-3xl border border-amber-900/10 shadow-[0_2px_12px_rgba(44,40,36,0.03)]">
            <div className="flex items-center gap-3 flex-1">
              <SearchInput
                placeholder="Search by poshak, size, mukut, color..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onClear={() => { setSearchInput(''); updateSearchParam('search', ''); }}
                size="md"
                className="flex-1"
              />
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex h-11 items-center gap-2 px-4 rounded-2xl border border-amber-900/20 text-xs font-bold text-amber-950 bg-amber-50/60 shadow-xs hover:bg-amber-100/80 transition-all whitespace-nowrap min-h-[44px]"
                >
                  <FiFilter className="h-4 w-4 text-amber-800" /> Filters
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-900/10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950 whitespace-nowrap">
                Sort By:
              </span>
              <Select
                value={sort}
                onChange={handleSortChange}
                options={SORT_OPTIONS}
                size="sm"
                className="w-52"
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          <ActiveFilters
            search={search}
            categoryId={categoryId}
            minPrice={minPrice}
            maxPrice={maxPrice}
            inStockOnly={inStockOnly}
            rating={rating}
            categories={categories}
            onClearSearch={() => { setSearchInput(''); updateSearchParam('search', ''); }}
            onClearCategory={() => updateSearchParam('categoryId', '')}
            onClearPrice={handlePriceReset}
            onClearStock={() => updateSearchParam('inStock', '')}
            onClearRating={() => updateSearchParam('minRating', '')}
            onClearAll={clearAllFilters}
          />

          {/* Main Shop Catalog Grid Layout */}
          <div className="mt-8 flex gap-8">
            <FilterSidebar
              categories={categories}
              selectedCategoryId={categoryId}
              onCategoryChange={handleCategoryChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={handleMinPriceChange}
              onMaxPriceChange={handleMaxPriceChange}
              onPriceReset={handlePriceReset}
              inStockOnly={inStockOnly}
              onInStockChange={handleInStockChange}
              selectedRating={rating}
              onRatingChange={handleRatingChange}
              isMobile={isMobile}
              isOpen={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            />

            <div className="flex-1 min-w-0">
              {isLoading && !productList.length ? (
                <SkeletonGrid />
              ) : isError ? (
                <ErrorState
                  title="Unable to Load Product Catalog"
                  message={error?.message || 'Something went wrong while connecting to our catalog servers.'}
                  onRetry={refetch}
                  fullPage
                />
              ) : !productList.length ? (
                <EmptyState
                  title="No Matching Devotional Creations"
                  message={
                    Object.keys(Object.fromEntries(searchParams)).length > 1
                      ? 'Try adjusting or clearing your price bounds, rating, or category filters.'
                      : 'No items are currently listed in this section.'
                  }
                  action={
                    Object.keys(Object.fromEntries(searchParams)).length > 1 ? (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="rounded-2xl bg-amber-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-amber-950 min-h-[44px]"
                      >
                        Reset All Filters
                      </button>
                    ) : undefined
                  }
                />
              ) : (
                <>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05 },
                      },
                    }}
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6"
                  >
                    {productList.map((product) => (
                      <motion.div
                        key={product.slug || product.id}
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                        }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          onAddToWishlist={isAuthenticated ? handleWishlistToggle : undefined}
                          onQuickView={setQuickViewProduct}
                          isInWishlist={wishlistVariantIds.has(product.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        siblingCount={1}
                        showFirstLast
                        showPrevNext
                        size="md"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <QuickViewModal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
        />
      </Suspense>
    </>
  );
}
