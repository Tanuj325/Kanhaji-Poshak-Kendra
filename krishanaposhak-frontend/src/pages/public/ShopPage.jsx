import { lazy, Suspense, useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '@/components/common/SEO';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useRootCategories } from '@/hooks/useCategories';
import { useDebounce, useMediaQuery } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/utils/cn';

import ProductCard from '@/components/cards/ProductCard';
import Pagination from '@/components/navigation/Pagination';
import ShopHero from '@/components/shop/ShopHero';
import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilterDrawer from '@/components/shop/MobileFilterDrawer';
import MobileSortBottomSheet from '@/components/shop/MobileSortBottomSheet';
import SortBar from '@/components/shop/SortBar';
import ActiveFilterChips from '@/components/shop/ActiveFilterChips';

const QuickViewModal = lazy(() => import('@/components/overlay/QuickViewModal'));
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '✨ Newest Arrivals' },
  { value: 'price,asc', label: '💰 Price: Low to High' },
  { value: 'price,desc', label: '💎 Price: High to Low' },
  { value: 'name,asc', label: '🔤 Name: A to Z' },
  { value: 'name,desc', label: '🔤 Name: Z to A' },
];

const PAGE_SIZE = 12;

function mapProductToCard(product) {
  if (!product) return null;
  return {
    ...product,
    id: product.id || product._id,
    variantId: product.variantId || product.variants?.[0]?.id || product.id,
    name: product.name,
    slug: product.slug || product.id,
    images: product.imageUrl ? [{ imageUrl: product.imageUrl }] : product.images || [],
    imageUrl: product.imageUrl || product.images?.[0]?.imageUrl || (typeof product.images?.[0] === 'string' ? product.images[0] : null),
    price: product.price || product.discountPrice || 0,
    discountPrice: product.discountPrice || null,
    averageRating: product.averageRating ?? product.rating ?? 0,
    reviewCount: product.reviewCount ?? product.numReviews ?? 0,
    stock: product.stock,
    category: product.categoryName || (typeof product.category === 'object' ? product.category?.name : product.category) || null,
    categoryName: product.categoryName || (typeof product.category === 'object' ? product.category?.name : product.category) || null,
    featured: Boolean(product.featured),
    newArrival: Boolean(product.newArrival || product.isNew),
    variants: product.variants || product.productVariants || [],
  };
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 p-1 sm:p-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-full rounded-[16px] bg-white border border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.05)] sm:rounded-xl sm:border-stone-200/70 sm:shadow-2xs sm:p-2.5 sm:font-display font-body"
        >
          <Skeleton variant="rect" className="aspect-[4/5] w-full rounded-t-[16px] sm:aspect-square sm:rounded-t-xl sm:rounded-[12px] bg-stone-100/80" />
          <div className="flex flex-col flex-1 justify-between mt-2.5 space-y-2 p-2 sm:p-0">
            <div className="space-y-1">
              <Skeleton variant="text" className="h-2.5 w-1/3 bg-stone-100/90" />
              <Skeleton variant="text" className="h-3.5 w-full bg-stone-100/90" />
              <Skeleton variant="text" className="h-3.5 w-2/3 bg-stone-100/90" />
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="space-y-1 w-1/2">
                <Skeleton variant="text" className="h-4 w-full bg-stone-100/90" />
                <Skeleton variant="text" className="h-2.5 w-2/3 bg-stone-100/90" />
              </div>
              <Skeleton variant="rect" className="h-8.5 w-8.5 rounded-full bg-stone-100/90" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 1279px)');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
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
  const discount = searchParams.get('discount') || '';

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

  const rawProductList = useMemo(() => {
    const raw = Array.isArray(productsData) ? productsData : productsData?.content || [];
    return raw.map(mapProductToCard);
  }, [productsData]);

  // Client-side fallback filter for special discounts if selected
  const productList = useMemo(() => {
    if (!discount) return rawProductList;
    const minDiscPct = parseFloat(discount);
    return rawProductList.filter((p) => {
      if (!p.price || !p.discountPrice) return false;
      const pct = Math.round(((p.price - p.discountPrice) / p.price) * 100);
      return pct >= minDiscPct;
    });
  }, [rawProductList, discount]);

  const totalPages = productsData?.totalPages || 1;
  const totalElements = productsData?.totalElements || 0;

  const wishlistVariantIds = useMemo(() => {
    if (!wishlist) return new Set();
    const items = Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || [];
    return new Set(items.map((item) => item.productVariantId || item.variantId || item.id));
  }, [wishlist]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (categoryId) count++;
    if (minPrice || maxPrice) count++;
    if (inStockOnly) count++;
    if (rating) count++;
    if (discount) count++;
    return count;
  }, [search, categoryId, minPrice, maxPrice, inStockOnly, rating, discount]);

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

  const handleDiscountChange = useCallback((value) => {
    updateSearchParam('discount', value);
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

  const categoryName = useMemo(() => {
    return categoryId ? categories.find((c) => String(c.id) === categoryId)?.name : null;
  }, [categoryId, categories]);

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Shop Catalog' },
    ];
    if (categoryName) {
      items[2] = { label: categoryName };
    }
    return items;
  }, [categoryName]);

  const shopSchemas = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Sacred Traditional Attire & Devotional Accessories Catalog',
      description: 'Explore our complete luxury collection of handcrafted Laddoo Gopal Poshak, Radha Krishna dresses, designer mukuts, and temple ornaments from Meerut.',
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

  const filterSidebarProps = {
    categories,
    selectedCategoryId: categoryId,
    onCategoryChange: handleCategoryChange,
    minPrice,
    maxPrice,
    onMinPriceChange: handleMinPriceChange,
    onMaxPriceChange: handleMaxPriceChange,
    onPriceReset: handlePriceReset,
    inStockOnly,
    onInStockChange: handleInStockChange,
    selectedRating: rating,
    onRatingChange: handleRatingChange,
    selectedDiscount: discount,
    onDiscountChange: handleDiscountChange,
    onClearAll: clearAllFilters,
    hasActiveFilters: activeFilterCount > 0,
  };

  return (
    <>
      <SEO
        title={categoryName ? `${categoryName} - Sacred Devotional Collection` : "Sacred Traditional Attire & Devotional Accessories Catalog"}
        description="Explore our luxury collection of handcrafted Laddoo Gopal Poshak, Radha Krishna dresses, designer mukuts, and temple ornaments from Meerut."
        canonicalUrl={`${siteConfig.url}/shop`}
        jsonLd={shopSchemas}
      />

      <div className="min-h-screen bg-lotus-white font-body selection:bg-amber-100 selection:text-amber-950">
        {/* Desktop Luxury Hero Banner (Hidden on Mobile <1024px to maximize screen density) */}
        <div className="hidden lg:block">
          <ShopHero
            breadcrumbItems={breadcrumbItems}
            categoryName={categoryName}
            totalElements={totalElements}
            isLoading={isLoading}
          />
        </div>

{/* Mobile Header Banner (<1024px) — compact, dense, Myntra feel */}
        <div className="block lg:hidden bg-white px-4 pt-3 pb-2 border-b border-stone-200/60">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-temple-gold-dark block">
                Official Catalog
              </span>
              <h1 className="text-[15px] font-bold text-stone-900 leading-tight truncate">
                {categoryName || 'All Sacred Collections'}
              </h1>
            </div>
            <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200 whitespace-nowrap">
              {totalElements} Items
            </span>
          </div>
        </div>

        <div className="container-page pt-0 pb-16 sm:py-8 lg:py-10 px-0 sm:px-6 lg:px-8">
          {/* Horizontal Category Quick-Selector Pills (Desktop ONLY - Mobile uses Top Bar Chips) */}
          {categories.length > 0 && (
            <div className="hidden md:flex mb-4 sm:mb-8 gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-200 -mx-1 px-1">
              <button
                type="button"
                onClick={() => handleCategoryChange('')}
                className={cn(
                  'rounded-2xl px-3.5 sm:px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 border min-h-[44px]',
                  !categoryId
                    ? 'bg-[linear-gradient(135deg,#0f2440,#1b3a5c)] text-white border-amber-900 shadow-gold scale-102 font-bold'
                    : 'bg-white text-stone-800 border-amber-900/15 hover:border-amber-800/40 hover:bg-amber-50/50',
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
                    'rounded-2xl px-3.5 sm:px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 border min-h-[44px]',
                    categoryId === String(cat.id)
                      ? 'bg-[linear-gradient(135deg,#0f2440,#1b3a5c)] text-white border-amber-900 shadow-gold scale-102 font-bold'
                      : 'bg-white text-stone-800 border-amber-900/15 hover:border-amber-800/40 hover:bg-amber-50/50',
                  )}
                >
                  {cat.name}
                  {cat.productCount !== undefined && ` (${cat.productCount})`}
                </button>
              ))}
            </div>
          )}

          {/* Sticky Mobile Filter & Sort Bar */}
          <SortBar
            searchInput={searchInput}
            onSearchChange={(e) => setSearchInput(e.target.value)}
            onSearchClear={() => {
              setSearchInput('');
              updateSearchParam('search', '');
            }}
            sort={sort}
            onSortChange={handleSortChange}
            sortOptions={SORT_OPTIONS}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            onOpenMobileSort={() => setMobileSortOpen(true)}
            activeFilterCount={activeFilterCount}
            totalElements={totalElements}
            isLoading={isLoading}
            isMobile={isMobile}
          />

          {/* Active Filter Chips Row */}
          <div className="mt-1.5 sm:mt-3 px-3 sm:px-0">
            <ActiveFilterChips
              search={search}
              categoryId={categoryId}
              minPrice={minPrice}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              rating={rating}
              discount={discount}
              categories={categories}
              onClearSearch={() => { setSearchInput(''); updateSearchParam('search', ''); }}
              onClearCategory={() => updateSearchParam('categoryId', '')}
              onClearPrice={handlePriceReset}
              onClearStock={() => updateSearchParam('inStock', '')}
              onClearRating={() => updateSearchParam('minRating', '')}
              onClearDiscount={() => updateSearchParam('discount', '')}
              onClearAll={clearAllFilters}
            />
          </div>

{/* Dense E-Commerce Mobile Results Count Bar (<1024px) */}
          <div className="block lg:hidden px-4 pt-2 pb-1">
            <div className="flex items-center justify-between text-[12px] font-semibold text-stone-500">
              <span>
                {!isLoading
                  ? `${totalElements} ${totalElements === 1 ? 'Product' : 'Products'}`
                  : 'Loading...'}
              </span>
            </div>
          </div>

          {/* Main Layout Grid Area */}
          <div className="mt-0 sm:mt-8 flex gap-6 lg:gap-8">
            {/* Desktop Filter Sidebar */}
            <FilterSidebar {...filterSidebarProps} />

            {/* Catalog Grid Container */}
            <div className="flex-1 min-w-0">
              {isLoading && !productList.length ? (
                <SkeletonGrid />
              ) : isError ? (
                <ErrorState
                  title="Unable to Load Devotional Catalog"
                  message={error?.message || 'Something went wrong while connecting to our catalog servers.'}
                  onRetry={refetch}
                  fullPage
                />
              ) : !productList.length ? (
                <EmptyState
                  title="No Devotional Creations Found"
                  message={
                    activeFilterCount > 0
                      ? 'Try resetting your price bounds, rating, or search parameters.'
                      : 'No items are currently listed in this collection.'
                  }
                  action={
                    activeFilterCount > 0 ? (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="rounded-2xl bg-[linear-gradient(135deg,#0f2440,#1b3a5c)] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-gold hover:opacity-95 min-h-[44px]"
                      >
                        Reset All Filters
                      </button>
                    ) : undefined
                  }
                />
              ) : (
                <>
                  {/* Dense 2-Column Mobile Product Grid (<1024px) / Multi-Column Desktop Grid */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.04 },
                      },
                    }}
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 p-1 sm:p-0"
                  >
                    {productList.map((product) => (
                      <motion.div
                        key={product.slug || product.id}
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                        }}
                        className="h-full flex flex-col"
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

                  {/* Pagination Controls Footer */}
                  {totalPages > 1 && (
                    <div className="mt-8 sm:mt-14 mb-8 flex justify-center px-4">
                      <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        siblingCount={1}
                        showFirstLast
                        showPrevNext
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter & Sort Bottom Sheets */}
      {isMobile && (
        <>
          <MobileFilterDrawer
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            {...filterSidebarProps}
          />
          <MobileSortBottomSheet
            isOpen={mobileSortOpen}
            onClose={() => setMobileSortOpen(false)}
            currentSort={sort}
            onSortChange={handleSortChange}
            sortOptions={SORT_OPTIONS}
          />
        </>
      )}

      {/* Quick View Popup Modal */}
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
