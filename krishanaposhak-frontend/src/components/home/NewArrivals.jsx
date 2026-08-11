import { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNewArrivals } from '@/hooks/useProducts';
import ProductCard from '@/components/cards/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { useAuth } from '@/context/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiStar, FiArrowRight, FiZap } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
};

function mapProductToCard(product) {
  if (!product) return null;
  return {
    ...product,
    id: product.id || product._id,
    variantId: product.variantId || product.variants?.[0]?.id || product.id,
    name: product.name,
    slug: product.slug || product.id,
    images: product.imageUrl ? [{ imageUrl: product.imageUrl }] : product.images || [],
    price: product.price || product.discountPrice || 0,
    discountPrice: product.discountPrice || null,
    averageRating: product.averageRating ?? product.rating ?? 0,
    reviewCount: product.reviewCount ?? product.numReviews ?? 0,
    stock: product.stock,
    category: product.categoryName || (typeof product.category === 'object' ? product.category?.name : product.category) || null,
    featured: Boolean(product.featured),
    newArrival: Boolean(product.newArrival || product.isNew),
  };
}

const NewArrivals = memo(function NewArrivals() {
  const { data: products, isLoading, isError, refetch } = useNewArrivals();
  const { isAuthenticated } = useAuth();
  const { data: wishlist } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const wishlistVariantIds = useMemo(() => {
    if (!wishlist) return new Set();
    const items = Array.isArray(wishlist) ? wishlist : wishlist?.items || wishlist?.data || [];
    const set = new Set();
    items.forEach((item) => {
      if (item.productId) set.add(Number(item.productId));
      if (item.variantId) set.add(Number(item.variantId));
      if (item.productVariantId) set.add(Number(item.productVariantId));
      if (item.id) set.add(Number(item.id));
    });
    return set;
  }, [wishlist]);

  const productList = useMemo(() => {
    const raw = Array.isArray(products) ? products : products?.data || products?.content || [];
    return raw.slice(0, 8).map(mapProductToCard);
  }, [products]);

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
      const targetId = product?.variantId || product?.id;
      if (!targetId) return;
      const isWishlisted = wishlistVariantIds.has(Number(product.id)) || (product.variantId && wishlistVariantIds.has(Number(product.variantId)));
      if (isWishlisted) {
        removeFromWishlistMutation.mutate(targetId);
      } else {
        addToWishlistMutation.mutate({ productId: targetId });
      }
    },
    [isAuthenticated, wishlistVariantIds, addToWishlistMutation, removeFromWishlistMutation],
  );

  if (isLoading) {
    return (
      <section className="section-padding bg-lotus-white">
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
      <section className="section-padding bg-lotus-white">
        <div className="container-page">
          <ErrorState
            title="Failed to load new arrivals"
            message="We couldn't fetch new arrivals right now."
            onRetry={refetch}
          />
        </div>
      </section>
    );
  }

  if (!productList.length) return null;

  return (
    <section className="py-4 lg:py-10 bg-white font-display">
      <div className="container-page">
        {/* ─── NEW MOBILE UI (<1024px) ─── */}
        <div className="block lg:hidden">
          {/* Header: Title left 16px, View All right 12px */}
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="text-[16px] font-semibold text-stone-900 leading-none">
              New Arrivals
            </h2>
            <Link
              to={ROUTE_PATHS.SHOP}
              className="text-[12px] font-medium text-amber-900 active-tap-scale flex items-center gap-1"
            >
              <span>View All</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Horizontal Product Strip with Edge Padding 16px (px-4) */}
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-2.5 px-4 pb-1">
            {productList.map((product) => (
              <div
                key={product.slug || product.id}
                className="snap-start w-[146px] shrink-0"
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={isAuthenticated ? handleWishlistToggle : undefined}
                  isInWishlist={wishlistVariantIds.has(Number(product.id)) || (product.variantId && wishlistVariantIds.has(Number(product.variantId)))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ─── OLD DESKTOP UI (>=1024px - 100% UNTOUCHED) ─── */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-8 text-center px-0">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-amber-900 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-800/20 font-display">
                <FiZap className="h-3.5 w-3.5 text-amber-800" /> Fresh Creations
              </span>
              <h2 className="mt-3 font-heading text-3xl lg:text-4xl font-semibold text-amber-950">
                New Arrivals
              </h2>
            </div>
            <Link
              to={ROUTE_PATHS.SHOP}
              className="touch-target inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-amber-950 transition-colors group shrink-0 active-tap-scale font-display"
            >
              <span>View All</span>
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4"
          >
            {productList.map((product) => (
              <motion.div key={product.slug || product.id} variants={itemVariants}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={isAuthenticated ? handleWishlistToggle : undefined}
                  isInWishlist={wishlistVariantIds.has(Number(product.id)) || (product.variantId && wishlistVariantIds.has(Number(product.variantId)))}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default NewArrivals;
