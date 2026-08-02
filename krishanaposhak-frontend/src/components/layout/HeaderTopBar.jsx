import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTruck,
  FiDownload,
  FiPackage,
  FiHeadphones,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';

/**
 * Premium thin top bar (dark navy).
 * Left: free shipping offer · Center: tagline · Right: app / track / support.
 * Extras collapse gracefully on small screens.
 */
export default function HeaderTopBar() {
  const rightLinks = [
    {
      label: 'Download App',
      to: ROUTE_PATHS.HOME,
      icon: FiDownload,
      className: 'hidden min-[520px]:inline-flex',
    },
    {
      label: 'Track Order',
      to: ROUTE_PATHS.ORDERS,
      icon: FiPackage,
      className: 'hidden min-[380px]:inline-flex',
    },
    {
      label: 'Support',
      to: ROUTE_PATHS.CONTACT,
      icon: FiHeadphones,
      className: 'inline-flex',
    },
  ];

  return (
    <div className="relative z-[60] bg-[linear-gradient(90deg,#0A1A2E,#162E4A_45%,#0A1A2E)] text-lotus-white/90">
      <div className="mx-auto flex h-8 w-full max-w-[1600px] items-center justify-between gap-2 px-3 min-[400px]:px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
        {/* Left — Free shipping offer */}
        <div className="flex min-w-0 items-center gap-1.5">
          <FiTruck className="h-3.5 w-3.5 shrink-0 text-temple-gold" aria-hidden="true" />
          <p className="truncate text-[10px] font-semibold tracking-wide text-lotus-white/90 sm:text-[11px]">
            <span className="text-temple-gold-light font-bold">FREE SHIPPING</span>
            <span className="hidden sm:inline"> on orders above </span>
            <span className="hidden sm:inline text-temple-gold-light font-bold">₹999</span>
          </p>
        </div>

        {/* Center — Tagline */}
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="hidden text-[10px] font-medium tracking-[0.22em] uppercase text-temple-gold-light md:block lg:text-[11px]"
          aria-label="Brand tagline"
        >
          ✨ Pure <span className="text-lotus-white/80">•</span> Traditional{' '}
          <span className="text-lotus-white/80">•</span> Divine ✨
        </motion.p>

        {/* Right — Utility links */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {rightLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`min-h-[32px] items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold text-lotus-white/85 transition-all duration-200 hover:bg-white/10 hover:text-temple-gold-light ${link.className}`}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
          <span className="hidden items-center gap-1.5 rounded-full border border-temple-gold/25 bg-temple-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-temple-gold-light lg:inline-flex">
            <HiSparkles className="h-2.5 w-2.5" /> Meerut Seva
          </span>
        </div>
      </div>

      {/* Gold hairline */}
      <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(201,154,59,0.5),transparent)]" />

      {/* Contact info micro-row (optional, ultra-compact) */}
      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-10 xl:px-12 2xl:px-16 py-0.5">
          <a
            href={`tel:${siteConfig.phone}`}
            className="text-[9px] font-medium text-lotus-white/60 hover:text-temple-gold-light transition-colors"
          >
            Call Seva: {siteConfig.phone}
          </a>
          <span className="text-[9px] font-medium text-lotus-white/60">
            Handcrafted with devotion • Pan-India Delivery
          </span>
        </div>
      </div>
    </div>
  );
}

