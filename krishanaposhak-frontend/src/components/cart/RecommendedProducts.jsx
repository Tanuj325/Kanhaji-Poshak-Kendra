import { memo } from 'react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/cards/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import { FiStar } from 'react-icons/fi';

const RecommendedProducts = memo(function RecommendedProducts({ title = "Complete Your Deity's Shringar", limit = 4 }) {
  const { data: featuredData, isLoading } = useFeaturedProducts();

  const products = Array.isArray(featuredData)
    ? featuredData
    : featuredData?.data || featuredData?.content || [];

  if (isLoading) {
    return (
      <div className="space-y-4 pt-6 font-display">
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
            <FiStar className="h-5 w-5 text-amber-700" /> {title}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 font-body">Handcrafted recommendations suited for sacred occasions</p>
        </div>
        <span className="text-[11px] font-bold text-amber-900 tracking-wider uppercase bg-amber-100/60 px-3 py-1 rounded-full border border-amber-300/40">
          Handcrafted Selection
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.slice(0, limit).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
});

export default RecommendedProducts;
