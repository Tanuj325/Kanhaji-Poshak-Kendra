import { memo } from 'react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/cards/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import { FiStar } from 'react-icons/fi';

const RecommendedProducts = memo(function RecommendedProducts({ title = "You May Also Divine Love", limit = 4 }) {
  const { data: featuredData, isLoading } = useFeaturedProducts();

  const products = Array.isArray(featuredData)
    ? featuredData
    : featuredData?.data || featuredData?.content || [];

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6">
        <Skeleton variant="text" className="h-6 w-56 bg-amber-100/50" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, i) => (
            <Skeleton key={i} variant="card" className="h-64 w-full rounded-2xl bg-amber-100/40" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-5 pt-8 border-t border-amber-900/10 font-display">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-950 flex items-center gap-2">
          <FiStar className="h-5 w-5 text-amber-600" /> {title}
        </h2>
        <span className="text-xs text-amber-900 font-semibold tracking-wider uppercase">Handcrafted Selection</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, limit).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
});

export default RecommendedProducts;
