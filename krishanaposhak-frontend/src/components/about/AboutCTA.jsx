import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { FiShoppingBag, FiPhoneCall, FiArrowRight } from 'react-icons/fi';

export default function AboutCTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-warm-cream/30 via-white to-warm-cream/40 font-display">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-deep-navy via-royal-blue to-deep-navy p-8 sm:p-14 text-center text-white shadow-2xl border border-temple-gold/40"
        >
          {/* Decorative Corner Background Gradients */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-temple-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-temple-gold/15 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-block bg-temple-gold/20 text-temple-gold border border-temple-gold/40 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Sacred Offerings & Seva
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Adorn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-temple-gold via-amber-200 to-temple-gold">Laddu Gopal Ji</span> with Divine Elegance
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl mx-auto">
              Explore our latest handcrafted festive poshaks, mukut shringars, bansuris, and sacred accessories. Delighting thousands of devotee homes across India.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/shop">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<FiShoppingBag className="h-5 w-5" />}
                  rightIcon={<FiArrowRight className="h-5 w-5" />}
                  className="font-bold shadow-lg shadow-temple-gold/20"
                >
                  Shop Complete Catalog
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<FiPhoneCall className="h-5 w-5" />}
                  className="border-white/40 text-white hover:bg-white/10 font-bold"
                >
                  Contact Seva Team
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
