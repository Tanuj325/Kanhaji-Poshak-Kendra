import { memo } from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/config/siteConfig';
import { FiAward, FiStar, FiHeart } from 'react-icons/fi';

const AboutHero = memo(function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-stone-950 to-amber-900 text-white font-display py-16 sm:py-24">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-temple-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10 text-center space-y-6 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
            <FiStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Meerut Artisanal Heritage</span>
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Crafting Sacred Devotion & Royal Poshaks Since Decades
          </h1>

          <p className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto font-body leading-relaxed">
            Welcome to {siteConfig.name}. We weave divine attire for Laddu Gopal Ji with pure velvet, rich gold zari, authentic threadwork, and timeless Indian craftsmanship.
          </p>
        </motion.div>

        {/* Feature Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 max-w-2xl mx-auto"
        >
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 text-center">
            <div className="h-8 w-8 mx-auto rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <FiAward className="h-4 w-4" />
            </div>
            <p className="text-base font-extrabold text-white font-heading">100% Authentic</p>
            <p className="text-[11px] text-stone-400 font-body">Pure Meerut Handcraft</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 text-center">
            <div className="h-8 w-8 mx-auto rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <FiStar className="h-4 w-4 fill-amber-300" />
            </div>
            <p className="text-base font-extrabold text-white font-heading">Size 0 to 6+</p>
            <p className="text-[11px] text-stone-400 font-body">Tailored Deity Fit</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 text-center col-span-2 sm:col-span-1">
            <div className="h-8 w-8 mx-auto rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <FiHeart className="h-4 w-4 text-rose-400 fill-rose-400" />
            </div>
            <p className="text-base font-extrabold text-white font-heading">Devotional Love</p>
            <p className="text-[11px] text-stone-400 font-body">Crafted for Sacred Seva</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default AboutHero;
