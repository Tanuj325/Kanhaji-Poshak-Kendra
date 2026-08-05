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
    <section className="py-4 lg:py-20 bg-[#0f2440] text-lotus-white relative overflow-hidden font-display">
      <div className="container-page relative z-10 px-0">
        {/* ─── NEW MOBILE UI (<1024px) ─── */}
        <div className="block lg:hidden px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-semibold text-white leading-none">
              Why Devotees Choose Us
            </h2>
            <Link to={ROUTE_PATHS.ABOUT} className="text-[12px] font-medium text-amber-300 active-tap-scale flex items-center gap-1">
              <span>Our Story</span>
              <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Compact 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {trustPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group p-2.5 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between shadow-none cursor-pointer hover:bg-white/10 active:bg-white/10 transition-all duration-200"
                >
                  <div className="h-7 w-7 rounded-lg bg-amber-400/15 border border-white/10 flex items-center justify-center text-amber-300 mb-1.5 shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-[11px] font-semibold text-white leading-tight mb-0.5">
                    {pillar.title}
                  </h3>
                  <p className="text-[10px] text-stone-300 font-normal line-clamp-2 group-hover:line-clamp-none group-active:line-clamp-none leading-snug transition-all">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── OLD DESKTOP UI (>=1024px - 100% UNTOUCHED) ─── */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-5 order-last"
            >
              <div className="relative rounded-3xl border border-amber-500/30 bg-deep-navy/90 p-3 shadow-xl overflow-hidden group">
                <div className="relative h-72 w-full rounded-2xl overflow-hidden">
                  <img
                    src="/logo2.jpeg"
                    alt="Krishana Poshak Sacred Heritage Craftsmanship"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/30 to-transparent" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-7 space-y-5 order-first"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-amber-300 bg-amber-500/15 px-3 py-1.5 rounded-full border border-amber-400/30 font-display">
                <FiStar className="h-3.5 w-3.5 text-amber-300" /> Our Sacred Heritage
              </span>
              <h2 className="font-heading text-5xl font-extrabold leading-tight text-white">
                Weaving Devotion into Every Thread
              </h2>
              <p className="text-stone-200 text-base font-light leading-relaxed font-body">
                At <strong className="text-amber-300 font-semibold">{siteConfig.name}</strong>, we honor the rich spiritual lineage of Meerut by crafting divine attire.
              </p>
              <div className="pt-2">
                <Link
                  to={ROUTE_PATHS.ABOUT}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-2 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-md"
                >
                  Read Our Story <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-temple-gold/20 pt-16">
            <div className="grid grid-cols-4 gap-6">
              {trustPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-[24px] border border-temple-gold/20 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-temple-gold/15 border border-temple-gold/30 flex items-center justify-center text-temple-gold mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-display text-base font-semibold text-lotus-white">
                      {pillar.title}
                    </h4>
                    <p className="mt-2 text-xs text-lotus-white/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default BrandStorySection;
