import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiShoppingBag, FiArrowRight, FiStar, FiHeart } from 'react-icons/fi';

const FooterCTA = memo(function FooterCTA() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-br from-amber-950 via-stone-950 to-amber-900 text-white font-display">
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-temple-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <FiStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Handcrafted Meerut Devotional Wear</span>
          </span>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Adorn Your Deity with Pure Velvet & Zari Craftsmanship
          </h2>

          <p className="text-stone-300 text-xs sm:text-base max-w-xl mx-auto font-body leading-relaxed">
            Every creation is tailored with divine love, traditional embroidery, and authentic Indian artistry suitable for holy worship and festive celebrations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link to={ROUTE_PATHS.SHOP} className="w-full sm:w-auto" aria-label="Explore Full Collection">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FiShoppingBag className="h-5 w-5 text-amber-200" />}
              rightIcon={<FiArrowRight className="h-5 w-5 text-amber-200" />}
              className="w-full sm:w-auto font-bold px-8 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-amber-950 shadow-xl shadow-amber-900/30 border border-amber-300/30 min-h-[50px] flex items-center justify-center gap-2"
            >
              Explore Full Collection
            </Button>
          </Link>
          <Link to={ROUTE_PATHS.ABOUT} className="w-full sm:w-auto" aria-label="Discover Our Heritage">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<FiHeart className="h-5 w-5 text-amber-300" />}
              className="w-full sm:w-auto font-bold px-7 rounded-2xl border-white/20 text-white hover:bg-white/10 min-h-[50px] flex items-center justify-center gap-2"
            >
              Discover Our Heritage
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

export default FooterCTA;
