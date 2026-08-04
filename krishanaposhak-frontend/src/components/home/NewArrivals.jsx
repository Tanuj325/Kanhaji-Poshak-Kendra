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
import { FiStar, FiArrowRight } from 'react-icons/fi';

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
  return {
    id: product.id,
    variantId: product.variantId || product.id,
    name: product.name,
    slug: product.slug,
    images: product.imageUrl ? [{ imageUrl: product.imageUrl }] : product.images || [],
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
    return new Set(items.map((item) => item.productVariantId || item.variantId || item.id));
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
    <section className="section-padding bg-lotus-white">
      <div className="container-page">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 sm:mb-8 lg:mb-10"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-temple-gold-dark bg-temple-gold/10 px-3 py-1 rounded-full border border-temple-gold/20">
              <FiStar className="h-3.5 w-3.5 text-temple-gold" /> Fresh Additions
            </span>
            <h2 className="mt-2 sm:mt-3 font-display text-2xl font-semibold text-dark-charcoal sm:text-3xl lg:text-4xl">
              New Arrivals
            </h2>
            <p className="mt-1 text-xs sm:text-sm lg:text-base text-natural-wood">
              Discover our latest sacred creations and Meerut poshak collections
            </p>
          </div>
          <Link
            to={ROUTE_PATHS.SHOP}
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-royal-blue hover:text-peacock-blue transition-colors self-start sm:self-auto group min-h-[44px]"
          >
            <span>View All Collection</span>
            <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Responsive Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-2.5 min-[480px]:gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {productList.map((product) => (
            <motion.div key={product.slug || product.id} variants={itemVariants}>
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

export default NewArrivals;
