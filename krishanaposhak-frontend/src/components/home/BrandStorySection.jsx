import { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiTruck, FiRefreshCw, FiHeart, FiStar, FiArrowRight } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { siteConfig } from '@/config/siteConfig';

const trustPillars = [
  {
    icon: FiStar,
    title: '100% Meerut Artistry',
    description: 'Every dress is handcrafted by hereditary artisans in Meerut, preserving centuries of traditional embroidery & zardosi work.',
  },
  {
    icon: FiShield,
    title: 'Temple Grade Quality',
    description: 'Sourced from the finest pure silk, velvet, brocade, and authentic zari to ensure sacred durability and royal radiance.',
  },
  {
    icon: FiTruck,
    title: 'Insured Pan-India Shipping',
    description: 'Carefully packaged in moisture-proof protective wrapping with express trackable delivery across all Indian pincodes.',
  },
  {
    icon: FiRefreshCw,
    title: 'Hassle-Free Exchanges',
    description: 'Need a different size for your Laddu Gopal or Deity? Enjoy easy 7-day exchanges with dedicated customer support.',
  },
];

const BrandStorySection = memo(function BrandStorySection() {
  return (
    <section className="py-8 sm:py-20 bg-[linear-gradient(180deg,#0f2440_0%,#081427_100%)] text-lotus-white relative overflow-hidden">
      {/* Subtle background radial glow & pattern */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-temple-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-royal-blue/10 blur-3xl pointer-events-none" />

      <div className="container-page relative z-10 px-4 sm:px-0">
        {/* Brand Story Showcase Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center mb-8 sm:mb-16 lg:mb-20">
          {/* Image Stage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 order-first lg:order-last"
          >
            <div className="relative rounded-3xl border border-amber-500/30 bg-deep-navy/90 p-2.5 sm:p-3 shadow-xl overflow-hidden group">
              <div className="relative h-48 sm:h-72 w-full rounded-2xl overflow-hidden">
                <img
                  src="/logo2.jpeg"
                  alt="Krishana Poshak Sacred Heritage Craftsmanship"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-stone-950/85 border border-amber-400/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-serif text-sm font-bold shrink-0">
                      🪔
                    </div>
                    <div>
                      <h3 className="font-display text-xs sm:text-base font-semibold text-white">The Meerut Standard</h3>
                      <p className="text-[10px] text-amber-300 font-mono">100% Authentic Handcrafts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-3 sm:space-y-5 order-last lg:order-first"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-amber-300 bg-amber-500/15 px-2.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full border border-amber-400/30 font-display">
              <FiStar className="h-3.5 w-3.5 text-amber-300" /> Our Sacred Heritage
            </span>
            <h2 className="font-heading text-xl sm:text-3xl lg:text-5xl font-extrabold leading-tight text-white text-balance">
              Weaving Devotion into Every Thread
            </h2>
            <p className="text-stone-200 text-xs sm:text-sm lg:text-base font-light leading-relaxed font-body">
              At <strong className="text-amber-300 font-semibold">{siteConfig.name}</strong>, we honor the rich spiritual lineage of Meerut by crafting divine attire for Shri Radha Krishna, Laddu Gopal Ji, and temple deities.
            </p>

            <div className="pt-2">
              <Link
                to={ROUTE_PATHS.ABOUT}
                className="touch-target inline-flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md active-tap-scale font-display w-full sm:w-auto"
              >
                Read Our Story <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust Pillars Grid */}
        <div className="border-t border-temple-gold/20 pt-8 sm:pt-12 lg:pt-16">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-temple-gold">
              Pillars of Excellence
            </span>
            <h3 className="mt-1.5 sm:mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-lotus-white">
              Why Devotees Choose Krishana Poshak
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {trustPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="rounded-[20px] sm:rounded-[24px] border border-temple-gold/20 bg-white/5 p-4 sm:p-6 hover:bg-white/10 hover:border-temple-gold/50 transition-all duration-300 group"
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-temple-gold/15 border border-temple-gold/30 flex items-center justify-center text-temple-gold mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-temple-gold group-hover:text-dark-charcoal transition-all">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h4 className="font-display text-sm sm:text-base font-semibold text-lotus-white group-hover:text-temple-gold transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-lotus-white/70 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default BrandStorySection;
