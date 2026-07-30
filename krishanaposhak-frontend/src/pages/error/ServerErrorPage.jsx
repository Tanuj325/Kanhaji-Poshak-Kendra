import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { siteConfig } from '@/config/siteConfig';

export default function ServerErrorPage() {
  const canonicalUrl = `${siteConfig.url}/500`;

  const serverErrorSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '500 - Server Error | Krishana Poshak',
    description: 'Krishana Poshak encountered a temporary server error. Please try again later.',
    url: canonicalUrl,
  }), [canonicalUrl]);

  return (
    <>
      <SEO
        title="500 - Server Error"
        description="Krishana Poshak encountered a temporary server error. Our team has been notified. Please try again later."
        canonicalUrl={canonicalUrl}
        jsonLd={serverErrorSchema}
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
              style={{ WebkitTextStroke: '2px rgba(249,115,22,0.12)' }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              500
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/5 shadow-lg shadow-orange-500/10">
                <FiAlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-dark-charcoal sm:text-3xl">
            Server Error
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-natural-wood/70">
            We encountered an unexpected error. Our team has been notified. Please try again later.
          </p>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <FiRefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
