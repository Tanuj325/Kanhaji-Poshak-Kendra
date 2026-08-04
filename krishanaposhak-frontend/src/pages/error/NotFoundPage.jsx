import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import Button from '@/components/ui/Button';
import { FiHome, FiShoppingBag, FiSearch, FiArrowRight } from 'react-icons/fi';
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

      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#FAF7F2] font-display">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto space-y-6 px-6 py-12 sm:py-16 rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border border-amber-900/10 shadow-[0_8px_30px_rgba(212,175,55,0.08)] relative overflow-hidden"
        >
          {/* Glowing Background Accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-300/20 to-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated 404 Display */}
          <div className="relative mx-auto">
            <span className="font-heading text-7xl sm:text-9xl font-black text-amber-900/15 tracking-widest font-mono">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-lg border border-amber-700/30">
                <FiSearch className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/50">
              ✦ Page Not Found ✦
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-amber-950 pt-2">
              The Path You Seek Does Not Exist
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-body">
              The requested creation or page may have been moved or is temporarily unavailable. Let us help you navigate back to our divine collection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Link to={ROUTE_PATHS.HOME} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<FiHome className="h-5 w-5 text-amber-200" />}
                className="w-full sm:w-auto shadow-md font-bold px-7 rounded-2xl min-h-[48px] bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white border border-amber-500/20"
              >
                Return to Home
              </Button>
            </Link>
            <Link to={ROUTE_PATHS.SHOP} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<FiShoppingBag className="h-5 w-5 text-amber-800" />}
                rightIcon={<FiArrowRight className="h-5 w-5 text-amber-800" />}
                className="w-full sm:w-auto font-bold px-6 rounded-2xl border-amber-900/20 text-amber-950 hover:bg-amber-50 min-h-[48px]"
              >
                Explore Collection
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
