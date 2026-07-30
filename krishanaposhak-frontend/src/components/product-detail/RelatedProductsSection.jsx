import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/cards/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { FiArrowRight, FiGrid } from 'react-icons/fi';

export default function RelatedProductsSection({ categoryId, currentProductSlug, currentProductId }) {
  const { data: relatedData, isLoading } = useProducts(
    categoryId ? { categoryId, size: 8, page: 0 } : undefined,
  );

  const relatedProducts = useMemo(() => {
    if (!categoryId || !relatedData) return [];
    const raw =
      relatedData?.content ||
      relatedData?.data?.content ||
      relatedData?.data ||
      (Array.isArray(relatedData) ? relatedData : []);
    return raw
      .filter((p) => p.slug !== currentProductSlug && p.id !== currentProductId)
      .slice(0, 4)
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

  if (!categoryId || (!isLoading && relatedProducts.length === 0)) return null;

  return (
    <div className="mt-12 space-y-6 font-display">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiGrid className="h-5 w-5 text-amber-700" />
            <span>You May Also Adore</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Handcrafted creations from the same sacred category
          </p>
        </div>

        <Link
          to={ROUTE_PATHS.SHOP}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-700 transition-colors"
        >
          View Collection <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid of Related Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id || product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
