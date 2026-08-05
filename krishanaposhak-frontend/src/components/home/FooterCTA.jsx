import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiShoppingBag, FiArrowRight, FiStar, FiHeart } from 'react-icons/fi';

const FooterCTA = memo(function FooterCTA() {
  return (
    <section className="relative overflow-hidden py-4 lg:py-20 bg-gradient-to-br from-amber-950 to-stone-950 text-white font-display">
      <div className="container-page relative z-10 px-0">
        {/* ─── NEW MOBILE UI (<1024px) ─── */}
        <div className="block lg:hidden px-4">
          <div className="p-3 rounded-xl bg-stone-900/80 border border-amber-500/20 flex items-center justify-between gap-3 shadow-none">
            <div className="space-y-0.5">
              <h3 className="text-[12px] font-semibold text-white leading-tight">
                Adorn Your Deity
              </h3>
              <p className="text-[10px] text-amber-300 font-normal">
                Pure Velvet & Zari Attire
              </p>
            </div>
            <Link
              to={ROUTE_PATHS.SHOP}
              className="shrink-0 h-[26px] px-2.5 rounded bg-amber-400 text-stone-950 text-[10px] font-medium flex items-center gap-1 active-tap-scale shadow-none"
            >
              <span>Shop Now</span>
              <FiArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ─── OLD DESKTOP UI (>=1024px - 100% UNTOUCHED) ─── */}
        <div className="hidden lg:block text-center space-y-6 max-w-3xl mx-auto">
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

            <h2 className="font-heading text-5xl font-extrabold tracking-tight text-white leading-tight">
              Adorn Your Deity with Pure Velvet & Zari Craftsmanship
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-3 pt-1"
          >
            <Link to={ROUTE_PATHS.SHOP} className="active-tap-scale" aria-label="Explore Full Collection">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<FiShoppingBag className="h-4 w-4 text-stone-950" />}
                rightIcon={<FiArrowRight className="h-4 w-4 text-stone-950" />}
                className="font-bold px-8 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-stone-950 shadow-lg border border-amber-300/40 h-12 text-sm"
              >
                Explore Full Collection
              </Button>
            </Link>
            <Link to={ROUTE_PATHS.ABOUT} className="active-tap-scale" aria-label="Discover Our Heritage">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<FiHeart className="h-4 w-4 text-amber-300" />}
                className="font-semibold px-8 rounded-full border-white/20 text-white hover:bg-white/10 h-12 text-sm"
              >
                Discover Our Heritage
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default FooterCTA;
