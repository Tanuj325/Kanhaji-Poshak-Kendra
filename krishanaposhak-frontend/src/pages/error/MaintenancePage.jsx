import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/common/SEO';
import { FiTool } from 'react-icons/fi';
import { siteConfig } from '@/config/siteConfig';

export default function MaintenancePage() {
  const maintenanceSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Under Maintenance | Krishana Poshak',
    description: 'Krishana Poshak is currently undergoing scheduled maintenance. We will be back shortly.',
    url: siteConfig.url,
  }), []);

  return (
    <>
      <SEO
        title="Under Maintenance"
        description="Krishana Poshak is currently undergoing scheduled maintenance to improve your experience. We will be back shortly."
        jsonLd={maintenanceSchema}
        noindex
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#060E1A] px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          {/* Animated icon */}
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-400/10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/5"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FiTool className="h-9 w-9 text-amber-400" />
            </motion.div>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-wide text-white">
            Under Maintenance
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            We are currently performing scheduled maintenance to improve your experience. We will be
            back shortly.
          </p>

          {/* Status indicator */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2">
            <motion.div
              className="h-2 w-2 rounded-full bg-amber-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs font-semibold text-amber-300/80">
              Estimated return: Shortly
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
}
