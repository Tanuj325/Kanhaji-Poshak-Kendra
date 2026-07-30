import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import { FiHome, FiLock } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';

export default function ForbiddenPage() {
  const canonicalUrl = `${siteConfig.url}/403`;

  const forbiddenSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '403 - Access Denied | Krishana Poshak',
    description: 'You do not have permission to access this page on Krishana Poshak.',
    url: canonicalUrl,
  }), [canonicalUrl]);

  return (
    <>
      <SEO
        title="403 - Access Denied"
        description="You do not have permission to access this page on Krishana Poshak. Please contact support if you believe this is an error."
        canonicalUrl={canonicalUrl}
        jsonLd={forbiddenSchema}
      />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          <div className="relative mb-6">
            <motion.div
              className="font-serif text-[120px] font-bold leading-none text-transparent sm:text-[150px]"
              style={{ WebkitTextStroke: '2px rgba(239,68,68,0.12)' }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              403
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/5 shadow-lg shadow-rose-500/10">
                <FiLock className="h-8 w-8 text-rose-400" />
              </div>
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-dark-charcoal sm:text-3xl">
            Access Denied
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-natural-wood/70">
            You do not have permission to access this page. Please contact support if you believe
            this is an error.
          </p>

          <div className="mt-8">
            <Link
              to={ROUTE_PATHS.HOME}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <FiHome className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
