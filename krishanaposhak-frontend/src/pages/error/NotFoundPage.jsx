import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import { FiHome, FiShoppingBag, FiSearch } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';

export default function NotFoundPage() {
  const canonicalUrl = `${siteConfig.url}/404`;

  const notFoundSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '404 - Page Not Found | Krishana Poshak',
    description: 'The page you are looking for does not exist or has been moved. Browse our handcrafted divine poshak collection.',
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }), [canonicalUrl]);

  return (
    <>
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved. Browse our handcrafted divine Laddu Gopal poshak, mukut shringar, and devotional attire collection from Meerut."
        canonicalUrl={canonicalUrl}
        jsonLd={notFoundSchema}
      />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          {/* Animated 404 */}
          <div className="relative mb-6">
            <motion.div
              className="font-serif text-[120px] font-bold leading-none text-transparent sm:text-[150px]"
              style={{
                WebkitTextStroke: '2px rgba(251,191,36,0.15)',
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              404
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/5 shadow-lg shadow-amber-500/10">
                <FiSearch className="h-8 w-8 text-amber-400" />
              </div>
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-dark-charcoal sm:text-3xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-natural-wood/70">
            The page you are looking for doesn&apos;t exist or has been moved. Let us help you find
            what you need.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to={ROUTE_PATHS.HOME}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <FiHome className="h-4 w-4" />
              Go Home
            </Link>
            <Link
              to={ROUTE_PATHS.SHOP}
              className="inline-flex items-center gap-2 rounded-xl border border-royal-blue/30 bg-royal-blue/5 px-6 py-3 text-sm font-semibold text-royal-blue transition-all hover:bg-royal-blue/10"
            >
              <FiShoppingBag className="h-4 w-4" />
              Browse Shop
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
