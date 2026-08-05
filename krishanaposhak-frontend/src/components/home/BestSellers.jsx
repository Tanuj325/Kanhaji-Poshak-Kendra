import { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBestSellers } from '@/hooks/useBestSellers';
import ProductCard from '@/components/cards/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { useAuth } from '@/context/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiAward, FiArrowRight } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

function mapProductToCard(product) {
  return {
    id: product.id,
    variantId: product.variantId || product.id,
    name: product.name,
    slug: product.slug,
    images: product.imageUrl ? [{ imageUrl: product.imageUrl }] : [],
    price: product.price || product.discountPrice,
    discountPrice: product.discountPrice,
    averageRating: product.averageRating || 0,
    reviewCount: product.reviewCount || 0,
    stock: product.stock ?? 10,
    category: product.categoryName || (product.category?.name) || null,
    featured: product.featured,
    newArrival: product.newArrival,
  };
}

const BestSellers = memo(function BestSellers() {
  const { data, isLoading, isError, refetch } = useBestSellers();
  const { isAuthenticated } = useAuth();
  const { data: wishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const wishlistVariantIds = useMemo(() => {
    if (!wishlist) return new Set();
    const items = Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || [];
    return new Set(items.map((item) => item.productVariantId || item.variantId || item.id));
  }, [wishlist]);

  const productList = useMemo(() => {
    const raw = Array.isArray(data) ? data : data?.content || data?.data || [];
    return raw.map(mapProductToCard);
  }, [data]);

  const handleAddToCart = useCallback(
    (product) => {
      const targetVariantId = product?.variantId || product?.id;
      if (!targetVariantId) return;
      addToCartMutation.mutate({ productVariantId: targetVariantId, quantity: 1 });
    },
    [addToCartMutation],
  );

  const handleWishlistToggle = useCallback(
    (product) => {
      if (!isAuthenticated) return;
      const variantId = product?.variantId || product?.id;
      if (!variantId) return;
      if (wishlistVariantIds.has(variantId)) {
        removeFromWishlistMutation.mutate(variantId);
      } else {
        addToWishlistMutation.mutate({ productId: variantId });
      }
    },
    [isAuthenticated, wishlistVariantIds, addToWishlistMutation, removeFromWishlistMutation],
  );

  if (isLoading) {
    return (
      <section className="section-padding bg-warm-cream/50">
        <div className="container-page">
          <div className="mb-8 text-center sm:mb-10">
            <Skeleton className="h-4 w-32 mx-auto rounded-full" />
            <Skeleton className="h-8 w-64 mx-auto mt-2 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 min-[480px]:gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section-padding bg-warm-cream/50">
        <div className="container-page">
          <ErrorState
            title="Failed to load best sellers"
            message="We couldn't fetch best sellers right now."
            onRetry={refetch}
          />
        </div>
      </section>
    );
  }

  if (!productList.length) return null;

  return (
    <section className="py-6 sm:py-10 bg-warm-cream/50">
      <div className="container-page">
        {/* Mobile App Section Header */}
        <div className="flex items-center justify-between mb-3.5 sm:mb-8 text-left sm:text-center px-4 sm:px-0">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-temple-gold-dark bg-temple-gold/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-temple-gold/20">
              <FiAward className="h-3.5 w-3.5" /> Customer Favorites
            </span>
            <h2 className="mt-1 sm:mt-3 font-display text-xl sm:text-3xl lg:text-4xl font-semibold text-dark-charcoal">
              Best Sellers
            </h2>
          </div>
          <Link
            to={ROUTE_PATHS.SHOP}
            className="touch-target inline-flex items-center gap-1 text-xs font-semibold text-royal-blue hover:text-peacock-blue transition-colors group shrink-0 active-tap-scale"
          >
            <span>View All</span>
            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Carousel on Mobile with Edge Padding, Grid on Desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-3 px-4 pb-2 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-4"
        >
          {productList.map((product) => (
            <motion.div
              key={product.slug || product.id}
              variants={itemVariants}
              className="snap-start w-[160px] xs:w-[185px] shrink-0 md:w-auto"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={isAuthenticated ? handleWishlistToggle : undefined}
                isInWishlist={wishlistVariantIds.has(product.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default BestSellers;
