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
      <section id="featured-categories" className="section-padding bg-[#FAF7F2]">
        <div className="container-page">
          <div className="mb-8 text-center sm:mb-10">
            <Skeleton className="h-4 w-32 mx-auto rounded-full bg-amber-100/60" />
            <Skeleton className="h-8 w-64 mx-auto mt-2 rounded-xl bg-amber-100/60" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
      <section id="featured-categories" className="section-padding bg-[#FAF7F2]">
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
    <section id="featured-categories" className="section-padding bg-[#FAF7F2] relative font-display">
      <div className="container-page">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-8 text-center sm:mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-900 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-800/20 font-display">
            <FiGrid className="h-3.5 w-3.5 text-amber-800" /> Sacred Collections
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-950">
            Shop By Divine Category
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-md mx-auto font-body">
            Explore our handcrafted collections of divine dresses, mukuts & spiritual accessories
          </p>
          <Link
            to={ROUTE_PATHS.SHOP}
            className="mt-3.5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-900 hover:text-amber-700 transition-colors group font-display"
          >
            <span>View All Categories</span>
            <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        >
          {categoryList.map((category) => (
            <motion.div key={category.slug} variants={itemVariants}>
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default CategoriesSection;
