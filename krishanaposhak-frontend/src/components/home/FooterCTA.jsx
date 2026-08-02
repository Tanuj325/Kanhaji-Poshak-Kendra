import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiArrowRight, FiMessageCircle, FiStar } from 'react-icons/fi';

export default function FooterCTA() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0f2440_0%,#081427_100%)] text-lotus-white py-16 sm:py-20 lg:py-24 border-t border-temple-gold/30 select-none">
      <img
        src="/logo3.jpeg"
        alt="Krishana Poshak Devotional Craftsmanship"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-30 scale-105"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,36,64,0.96),rgba(15,36,64,0.78),rgba(15,36,64,0.96))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,36,64,0.9),transparent_45%,rgba(15,36,64,0.92))]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-temple-gold/12 blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-temple-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-temple-gold backdrop-blur-md border border-temple-gold/40 shadow-xs">
            <FiStar className="h-3.5 w-3.5" /> Experience Divine Splendor
          </span>

          <h2 className="font-display text-3xl font-semibold text-lotus-white sm:text-4xl lg:text-5xl leading-tight drop-shadow-md text-balance">
            Ready to Dress Your Laddu Gopal & Deities in Sacred Luxury?
          </h2>

          <p className="max-w-xl text-sm text-lotus-white/90 sm:text-base font-light leading-relaxed font-body text-balance">
            Discover our authentic Meerut Poshaks, designer Mukuts, and hand-embroidered festival attire with insured Pan-India shipping.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto font-body">
            <Link
              to={ROUTE_PATHS.SHOP}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-dark-charcoal shadow-[0_14px_30px_rgba(201,154,59,0.22)] transition-all duration-300 hover:scale-[1.02] min-h-[44px]"
            >
              <span>Explore Collection</span>
              <FiArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to={ROUTE_PATHS.CONTACT}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-lotus-white/25 bg-lotus-white/10 px-8 py-3.5 text-xs sm:text-sm font-semibold text-lotus-white backdrop-blur-md transition-all duration-300 hover:bg-lotus-white/20 hover:border-temple-gold/50 min-h-[44px]"
            >
              <FiMessageCircle className="h-4 w-4 text-temple-gold" />
              <span>Contact Assistance</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
