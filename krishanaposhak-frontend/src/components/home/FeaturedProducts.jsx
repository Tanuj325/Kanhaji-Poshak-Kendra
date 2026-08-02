import { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeaturedProducts } from '@/hooks/useProducts';
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
    category: product.categoryName || product.category?.name || null,
    featured: product.featured,
    newArrival: product.newArrival,
  };
}

const FeaturedProducts = memo(function FeaturedProducts() {
  const { data: products, isLoading, isError, refetch } = useFeaturedProducts();
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
    return raw.map(mapProductToCard);
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
            <Skeleton className="h-4 w-32 mx-auto rounded-full bg-amber-100/60" />
            <Skeleton className="h-8 w-64 mx-auto mt-2 rounded-xl bg-amber-100/60" />
          </div>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl bg-amber-100/40" />
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
            title="Failed to load products"
            message="We couldn't fetch featured products right now."
            onRetry={refetch}
          />
        </div>
      </section>
    );
  }

  if (!productList.length) return null;

  return (
    <section className="section-padding bg-lotus-white font-display">
      <div className="container-page">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-8 text-center sm:mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-temple-gold-dark bg-temple-gold/10 px-3.5 py-1.5 rounded-full border border-temple-gold/20">
            <FiStar className="h-3.5 w-3.5 text-amber-800" /> Curated Selection
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-dark-charcoal">
            Featured Products
          </h2>
          <p className="mt-2 text-sm sm:text-base text-natural-wood max-w-md mx-auto font-body">
            Handpicked devotional treasures and sacred Meerut attire
          </p>
          <Link
            to={ROUTE_PATHS.SHOP}
            className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-royal-blue hover:text-peacock-blue transition-colors group"
          >
            <span>Explore All Featured</span>
            <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
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

export default FeaturedProducts;
