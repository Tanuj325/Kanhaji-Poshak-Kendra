import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRootCategories } from '@/hooks/useCategories';
import CategoryCard from '@/components/cards/CategoryCard';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiGrid, FiArrowRight } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const CategoriesSection = memo(function CategoriesSection() {
  const { data: categories, isLoading, isError, refetch } = useRootCategories();

  const categoryList = useMemo(() => {
    const raw = Array.isArray(categories) ? categories : categories?.data || categories?.content || [];
    return raw.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      image: cat.imageUrl,
      description: cat.shortDescription || cat.description,
      productCount: cat.productCount,
    }));
  }, [categories]);

  if (isLoading) {
    return (
      <section id="featured-categories" className="section-padding bg-lotus-white">
        <div className="container-page">
          <div className="mb-8 text-center sm:mb-10">
            <Skeleton className="h-4 w-32 mx-auto rounded-full bg-amber-100/60" />
            <Skeleton className="h-8 w-64 mx-auto mt-2 rounded-xl bg-amber-100/60" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 min-[480px]:gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl bg-amber-100/40" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="featured-categories" className="section-padding bg-lotus-white">
        <div className="container-page">
          <ErrorState
            title="Failed to load categories"
            message="We couldn't fetch categories right now."
            onRetry={refetch}
          />
        </div>
      </section>
    );
  }

  if (!categoryList.length) return null;

  return (
    <section id="featured-categories" className="py-4 lg:py-10 bg-white relative font-display">
      <div className="container-page">
        {/* ─── NEW MOBILE UI (<1024px) ─── */}
        <div className="block lg:hidden">
          {/* Header: Title left 16px, View All right 12px */}
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="text-[16px] font-semibold text-stone-900 leading-none">
              Featured Collections
            </h2>
            <Link
              to={ROUTE_PATHS.CATEGORIES || '/categories'}
              className="text-[12px] font-medium text-amber-900 active-tap-scale flex items-center gap-1"
            >
              <span>View All</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Horizontal Snap Scroll Category Strip */}
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-3 px-1 pb-1">
            {categoryList.map((category) => (
              <Link
                key={category.slug}
                to={`${ROUTE_PATHS.SHOP}?category=${category.slug}`}
                className="snap-start w-[80px] shrink-0 group flex flex-col items-center text-center active-tap-scale"
              >
                <div className="w-[80px] h-[80px] rounded-xl bg-stone-50 overflow-hidden border border-stone-100 mb-1.5 relative">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-800 font-semibold text-base">
                      {category.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-medium text-stone-700 line-clamp-1 leading-tight text-center w-full">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── OLD DESKTOP UI (>=1024px - 100% UNTOUCHED) ─── */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-8 text-center px-0">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-temple-gold-dark bg-temple-gold/10 px-3 py-1.5 rounded-full border border-temple-gold/20 font-display">
                <FiGrid className="h-3.5 w-3.5 text-amber-800" /> Sacred Collections
              </span>
              <h2 className="mt-3 font-display text-3xl lg:text-5xl font-semibold text-dark-charcoal">
                Shop By Divine Category
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
          >
            {categoryList.map((category) => (
              <motion.div key={category.slug} variants={itemVariants}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default CategoriesSection;
