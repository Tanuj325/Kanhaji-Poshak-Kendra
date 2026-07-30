import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { useCategoryBySlug } from '@/hooks/useCategories';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';
import SEO from '@/components/common/SEO';
import { FiArrowRight } from 'react-icons/fi';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useCategoryBySlug(slug);
  const category = data?.data || data;

  useEffect(() => {
    if (category?.id) {
      navigate(buildPath.shopCategory(category.id), { replace: true });
    }
  }, [category, navigate]);

  const categorySchemas = useMemo(() => {
    const categoryName = category?.name || slug?.replace(/-/g, ' ') || 'Sacred Category';
    const categoryUrl = `${siteConfig.url}/category/${slug}`;

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${categoryName} Collection | Krishana Poshak`,
        description: category?.description || `Explore our handcrafted collection of divine ${categoryName} from Meerut.`,
        url: categoryUrl,
        image: category?.imageUrl ? `${category.imageUrl}` : `${siteConfig.url}${siteConfig.ogImage}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'Shop Catalog', item: `${siteConfig.url}/shop` },
          { '@type': 'ListItem', position: 3, name: categoryName, item: categoryUrl },
        ],
      },
    ];
  }, [category, slug]);

  if (isLoading || category?.id) {
    return (
      <div className="container-page py-16">
        <SEO
          title={`${category?.name || slug || 'Category'} Collection`}
          description={category?.description || `Explore our handcrafted collection of divine ${category?.name || 'attire'} from Meerut.`}
          canonicalUrl={`${siteConfig.url}/category/${slug}`}
          ogImage={category?.imageUrl}
          jsonLd={categorySchemas}
        />
        <div className="space-y-6 max-w-xl mx-auto text-center">
          <Skeleton variant="text" className="h-10 w-2/3 mx-auto" />
          <Skeleton variant="text" className="h-5 w-full mx-auto" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
            <Skeleton variant="card" className="h-64" />
            <Skeleton variant="card" className="h-64" />
            <Skeleton variant="card" className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-page py-16">
        <ErrorState
          title="Failed to Load Category"
          message={error?.message || 'We could not load this category right now.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-page py-16"
    >
      <EmptyState
        title="Category Not Found"
        message="This sacred category may have been moved, renamed, or is currently unavailable."
        action={
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.SHOP)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-royal-blue to-deep-navy px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-soft hover:shadow-royal-blue/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Explore Complete Shop Catalog</span>
            <FiArrowRight className="h-4 w-4" />
          </button>
        }
      />
    </motion.div>
  );
}
