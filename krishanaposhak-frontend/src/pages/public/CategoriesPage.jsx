import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGrid, FiShoppingBag, FiLayers } from 'react-icons/fi';
import { useCategories } from '@/hooks/useCategories';
import { ROUTE_PATHS } from '@/routes/routePaths';
import SEO from '@/components/common/SEO';
import OptimizedImage from '@/components/ui/OptimizedImage';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

/**
 * CategoriesPage
 * Native Shopping App Experience for browsing all categories (<768px & Desktop).
 * Displays backend category catalog in a high-density, touch-friendly grid.
 * Clicking any category navigates to /shop?categoryId={id}.
 */
export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useCategories({ page: 0, size: 50 });

  const categories = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.content || data.items || data.data || [];
  }, [data]);

  const handleCategoryClick = (categoryId) => {
    if (!categoryId || categoryId === 'all') {
      navigate(ROUTE_PATHS.SHOP);
    } else {
      navigate(`${ROUTE_PATHS.SHOP}?categoryId=${categoryId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-bottom-nav md:pb-12 font-display">
      <SEO
        title="All Categories | Kanhaji Poshak"
        description="Explore our complete collection of handcrafted Laddu Gopal Poshak, Mukut, Jewellery, Bansuri, and Sacred Shringar Accessories from Meerut."
      />

      {/* ─── PAGE HEADER BANNER ───────────────────────────────────── */}
      <div className="bg-gradient-to-b from-deep-navy via-deep-navy to-[#142d4d] text-white px-4 pt-4 pb-6 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <FiLayers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Devotional Catalog</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Shop By Category
          </h1>
          <p className="text-xs text-stone-300 max-w-md mx-auto">
            Discover handcrafted Poshak, Shringar, and sacred adornments for Kanhaji
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">
        {/* ─── QUICK SHORTCUT: ALL PRODUCTS CARD ─────────────────── */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(ROUTE_PATHS.SHOP)}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/5 border border-amber-500/30 shadow-xs hover:shadow-md transition-all active-tap-scale"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-temple-gold text-dark-charcoal flex items-center justify-center font-bold shadow-xs">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-sm font-bold text-dark-charcoal block">
                All Products Catalog
              </span>
              <span className="text-[11px] font-medium text-natural-wood">
                Browse complete devotional attire collection
              </span>
            </div>
          </div>
          <FiArrowRight className="w-5 h-5 text-temple-gold-dark shrink-0" />
        </motion.button>

        {/* ─── LOADING SKELETON STATE ────────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2 p-2 bg-white rounded-2xl border border-stone-200/80">
                <Skeleton variant="image" className="w-full aspect-square rounded-xl" />
                <Skeleton variant="text" className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* ─── ERROR STATE ────────────────────────────────────────── */}
        {isError && (
          <div className="py-8">
            <ErrorState
              title="Failed to load categories"
              message={error?.message || 'Could not fetch category list right now.'}
              onRetry={refetch}
            />
          </div>
        )}

        {/* ─── CATEGORIES GRID DISPLAY ────────────────────────────── */}
        {!isLoading && !isError && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-natural-wood flex items-center gap-1.5">
                <FiGrid className="w-3.5 h-3.5" />
                All Categories ({categories.length})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => handleCategoryClick(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.id)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-amber-500/40 transition-all duration-200 cursor-pointer active-tap-scale"
                >
                  {/* Category Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                    <OptimizedImage
                      src={cat.imageUrl || cat.image || '/ogImage.jpeg'}
                      alt={cat.name}
                      aspectRatio="aspect-square"
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-stone-900 group-hover:bg-temple-gold transition-colors">
                      <FiArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="p-3 text-center flex-1 flex flex-col justify-center">
                    <h3 className="text-xs sm:text-sm font-bold text-dark-charcoal line-clamp-1 group-hover:text-amber-700 transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[10px] text-natural-wood line-clamp-1 mt-0.5 font-medium">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
