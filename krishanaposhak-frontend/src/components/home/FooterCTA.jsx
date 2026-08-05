import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiShoppingBag, FiArrowRight, FiStar, FiHeart } from 'react-icons/fi';

const FooterCTA = memo(function FooterCTA() {
  return (
    <section className="relative overflow-hidden py-6 sm:py-14 lg:py-20 bg-gradient-to-br from-amber-950 via-stone-950 to-amber-900 text-white font-display rounded-3xl mx-4 my-6 sm:m-0 sm:rounded-none shadow-xl border border-amber-500/30 sm:border-none">
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-temple-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10 text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2 sm:space-y-3"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <FiStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Handcrafted Meerut Devotional Wear</span>
          </span>

          <h2 className="font-heading text-xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Adorn Your Deity with Pure Velvet & Zari Craftsmanship
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1"
        >
          <Link to={ROUTE_PATHS.SHOP} className="w-full sm:w-auto active-tap-scale" aria-label="Explore Full Collection">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FiShoppingBag className="h-4 w-4 text-stone-950" />}
              rightIcon={<FiArrowRight className="h-4 w-4 text-stone-950" />}
              className="w-full sm:w-auto font-bold px-6 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 shadow-lg border border-amber-300/40 h-12 min-h-[48px] flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              Explore Full Collection
            </Button>
          </Link>
          <Link to={ROUTE_PATHS.ABOUT} className="hidden sm:inline-flex w-full sm:w-auto active-tap-scale" aria-label="Discover Our Heritage">
            <Button
              variant="outline"
              size="lg"
              leftIcon={<FiHeart className="h-4 w-4 text-amber-300" />}
              className="w-full sm:w-auto font-semibold px-6 rounded-full border-white/20 text-white hover:bg-white/10 h-12 min-h-[48px] flex items-center justify-center gap-2 text-xs sm:text-sm"
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
