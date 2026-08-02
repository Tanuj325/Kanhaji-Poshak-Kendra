import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollToTop from '@/components/common/ScrollToTop';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';

const floatingOrbs = [
  { size: 280, x: '10%', y: '20%', delay: 0, color: 'from-amber-400/8 to-amber-600/4' },
  { size: 200, x: '70%', y: '60%', delay: 2, color: 'from-blue-400/6 to-indigo-500/3' },
  { size: 160, x: '85%', y: '15%', delay: 4, color: 'from-amber-300/6 to-yellow-500/3' },
  { size: 120, x: '25%', y: '75%', delay: 1, color: 'from-blue-300/5 to-sky-400/3' },
];

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#0f2440_0%,#081427_55%,#060e1a_100%)]">
      <ScrollToTop />

      {/* ─── Animated Background Orbs ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {floatingOrbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
            style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
            animate={{
              y: [0, -30, 0, 30, 0],
              x: [0, 15, 0, -15, 0],
              scale: [1, 1.1, 1, 0.95, 1],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          />
        ))}
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ─── Left Panel: Brand Showcase (lg+) ─── */}
      <div className="relative hidden w-[45%] shrink-0 lg:flex lg:flex-col lg:items-center lg:justify-center xl:w-[48%]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex max-w-md flex-col items-center px-8 text-center xl:max-w-lg xl:px-12"
        >
          {/* Logo Mark */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-5">
              <div className="h-20 w-20 rounded-[28px] bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] p-[2px] shadow-[0_18px_44px_rgba(201,154,59,0.24)]">
                <div className="flex h-full w-full items-center justify-center rounded-[26px] bg-deep-navy">
                  <span className="font-display text-3xl font-bold text-temple-gold-light">K</span>
                </div>
              </div>
              <motion.div
                className="absolute -inset-2 rounded-[28px] bg-temple-gold/20 blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-wide text-white xl:text-4xl">
              {siteConfig.name}
            </h1>
            <div className="mt-3 h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          </div>

          {/* Tagline */}
          <p className="text-sm leading-relaxed text-slate-300/80 xl:text-base">
            {siteConfig.tagline}
          </p>
          <p className="mt-2 text-xs text-slate-400/60">
            Handcrafted divine poshaks from sacred Meerut
          </p>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: '✦', label: '100% Authentic' },
              { icon: '🛡', label: 'Secure Payments' },
              { icon: '📦', label: 'Free Shipping 8,000+' },
            ].map((badge) => (
              <span
                key={badge.label}
                className="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 text-[10px] font-semibold text-amber-300/80"
              >
                <span>{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Decorative vertical divider */}
        <div className="absolute right-0 top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />
      </div>

      {/* ─── Right Panel: Form Content ─── */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex shrink-0 items-center justify-between px-5 py-4 lg:px-8 lg:py-5">
          <Link
            to={ROUTE_PATHS.HOME}
            className="group flex items-center gap-2.5"
            aria-label={siteConfig.name}
          >
            <div className="h-8 w-8 rounded-[14px] bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] p-[1.5px] shadow-[0_10px_24px_rgba(201,154,59,0.2)]">
              <div className="flex h-full w-full items-center justify-center rounded-[13px] bg-deep-navy font-display text-sm font-bold text-temple-gold-light">
                K
              </div>
            </div>
            <span className="font-display text-sm font-semibold tracking-wide text-white sm:text-base lg:hidden">
              {siteConfig.name}
            </span>
          </Link>
          <Link
            to={ROUTE_PATHS.HOME}
            className="min-h-[44px] inline-flex items-center rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-white"
          >
            ← Back to Store
          </Link>
        </header>

        {/* Form Area */}
        <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[440px]"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 px-5 py-4 lg:px-8">
          <p className="text-center text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
