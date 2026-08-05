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
import { cn } from '@/utils/cn';

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '✨ Newest Arrivals' },
  { value: 'price,asc', label: '💰 Price: Low to High' },
  { value: 'price,desc', label: '💎 Price: High to Low' },
  { value: 'name,asc', label: '🔤 Name: A to Z' },
  { value: 'name,desc', label: '🔤 Name: Z to A' },
];

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5 rounded-[22px] sm:rounded-[26px] bg-white p-2.5 sm:p-3 border border-amber-900/10 shadow-2xs">
          <Skeleton variant="rect" className="aspect-[4/5] w-full rounded-2xl bg-amber-100/50" />
          <Skeleton variant="text" className="h-3 w-1/3 bg-amber-100/60" />
          <Skeleton variant="text" className="h-3.5 w-4/5 bg-amber-100/60" />
          <Skeleton variant="text" className="h-3.5 w-1/2 bg-amber-100/60" />
          <Skeleton variant="rect" className="h-9 sm:h-10 w-full rounded-xl bg-amber-100/50 mt-1" />
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
        {/* Desktop Luxury Hero Banner (Hidden on Mobile <768px to maximize screen density) */}
        <div className="hidden md:block">
          <ShopHero
            breadcrumbItems={breadcrumbItems}
            categoryName={categoryName}
            totalElements={totalElements}
            isLoading={isLoading}
          />
        </div>

        <div className="container-page py-2 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8">
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

          {/* Compact Mobile & Desktop Controls Bar */}
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

          {/* Active Filter Chips */}
          <div className="mt-1.5 sm:mt-3">
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

          {/* Main Layout Grid */}
          <div className="mt-2.5 sm:mt-8 flex gap-6 lg:gap-8">
            {/* Desktop Filter Sidebar */}
            <FilterSidebar {...filterSidebarProps} />

            {/* Catalog Grid Area */}
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
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5"
                  >
                    {productList.map((product) => (
                      <motion.div
                        key={product.slug || product.id}
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
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

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-10 sm:mt-14 flex justify-center">
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

      {/* Mobile Bottom Sheets (Filter & Sort) */}
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
