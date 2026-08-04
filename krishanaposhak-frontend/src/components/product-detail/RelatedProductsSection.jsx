import { useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/cards/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function RelatedProductsSection({ categoryId, currentProductSlug, currentProductId }) {
  const { data: relatedData, isLoading } = useProducts(
    categoryId ? { categoryId, size: 8, page: 0 } : undefined,
  );

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const relatedProducts = useMemo(() => {
    if (!categoryId || !relatedData) return [];
    const raw =
      relatedData?.content ||
      relatedData?.data?.content ||
      relatedData?.data ||
      (Array.isArray(relatedData) ? relatedData : []);
    return raw
      .filter((p) => p.slug !== currentProductSlug && p.id !== currentProductId)
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        images: p.imageUrl ? [{ imageUrl: p.imageUrl }] : p.images || [],
        imageUrl: p.imageUrl,
        price: p.price || p.discountPrice,
        discountPrice: p.discountPrice,
        averageRating: p.averageRating || 0,
        reviewCount: p.reviewCount || 0,
        stock: p.stock ?? 10,
        category: p.categoryName || p.category?.name || 'Collection',
      }));
  }, [relatedData, categoryId, currentProductSlug, currentProductId]);

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  const scroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstChild?.offsetWidth || 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth - 16 : cardWidth + 16,
      behavior: 'smooth',
    });
  }, []);

  if (!categoryId || (!isLoading && relatedProducts.length === 0)) return null;

  return (
    <div className="space-y-6 font-display">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl xl:text-3xl font-bold text-amber-950 font-heading">
            You May Also Adore
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-body">
            Handcrafted creations from the same sacred collection
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop scroll arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-900/15 bg-white text-amber-900 transition-all hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed min-h-[36px]"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-900/15 bg-white text-amber-900 transition-all hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed min-h-[36px]"
              aria-label="Scroll right"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            to={ROUTE_PATHS.SHOP}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-700 transition-colors"
          >
            View All <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth -mx-1 px-1"
      >
        {relatedProducts.map((product) => (
          <div
            key={product.id || product.slug}
            className="snap-start shrink-0 w-[calc(50%-6px)] min-[480px]:w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
