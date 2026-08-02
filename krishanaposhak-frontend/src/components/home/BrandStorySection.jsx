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
    <section className="section-padding bg-[linear-gradient(180deg,#0f2440_0%,#081427_100%)] text-lotus-white relative overflow-hidden">
      {/* Subtle background radial glow & pattern */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-temple-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-royal-blue/10 blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Brand Story Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-temple-gold bg-temple-gold/15 px-3.5 py-1 rounded-full border border-temple-gold/30">
              <FiStar className="h-3.5 w-3.5" /> Our Sacred Heritage
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-lotus-white text-balance">
              Weaving Devotion into Every Thread
            </h2>
            <p className="text-lotus-white/80 text-sm sm:text-base font-light leading-relaxed">
              At <strong className="text-temple-gold font-semibold">{siteConfig.name}</strong>, we honor the rich spiritual lineage of Meerut by crafting divine attire for Shri Radha Krishna, Laddu Gopal Ji, and temple deities. Each dress is born from a quiet act of devotion, blending rich heritage techniques with modern elegance.
            </p>
            <p className="text-lotus-white/70 text-xs sm:text-sm font-light leading-relaxed">
              From delicate Mukut crowns and embroidered Dupattas to royal festival Poshaks, our master craftsmen infuse every seam with grace, reverence, and uncompromised quality.
            </p>

            <div className="pt-2">
              <Link
                to={ROUTE_PATHS.ABOUT}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-dark-charcoal shadow-[0_14px_30px_rgba(201,154,59,0.22)] hover:scale-[1.02] transition-all duration-300"
              >
                Read Our Story <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-[28px] border border-temple-gold/30 bg-deep-navy/80 p-3 shadow-[0_18px_44px_rgba(15,36,64,0.24)] overflow-hidden group">
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden">
<img
                  src="/logo2.jpeg"
                  alt="Krishana Poshak Sacred Heritage Craftsmanship"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-deep-navy/90 border border-temple-gold/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-temple-gold/20 border border-temple-gold/40 flex items-center justify-center text-temple-gold font-serif text-lg font-bold shrink-0">
                      🪔
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-lotus-white">The Meerut Standard</h3>
                      <p className="text-[11px] text-temple-gold font-mono">100% Authentic Handcrafts & Garments</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Pillars Grid */}
        <div className="border-t border-temple-gold/20 pt-12 sm:pt-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-temple-gold">
              Pillars of Excellence
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-lotus-white">
              Why Devotees Choose Krishana Poshak
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="rounded-[24px] border border-temple-gold/20 bg-white/5 p-6 hover:bg-white/10 hover:border-temple-gold/50 transition-all duration-300 group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-temple-gold/15 border border-temple-gold/30 flex items-center justify-center text-temple-gold mb-4 group-hover:scale-110 group-hover:bg-temple-gold group-hover:text-dark-charcoal transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-lotus-white group-hover:text-temple-gold transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="mt-2 text-xs text-lotus-white/70 leading-relaxed">
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
