import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import Button from '@/components/ui/Button';
import { siteConfig } from '@/config/siteConfig';
import { FiArrowRight, FiHeart, FiAward, FiShield } from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us' },
];

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-deep-navy via-royal-blue to-deep-navy py-16 sm:py-24 text-white">
      {/* Background Ornamental Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-temple-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-temple-gold/15 blur-3xl" />

      {/* Decorative Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#C99A3B_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

      <div className="container-page relative z-10 font-display">
        <div className="mb-6 flex justify-center sm:justify-start">
          <Breadcrumb items={breadcrumbItems} className="text-white/80" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Text & Hero Details */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 lg:col-span-7 text-center sm:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-temple-gold/20 border border-temple-gold/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-temple-gold backdrop-blur-md">
              <FiHeart className="h-3.5 w-3.5 fill-temple-gold text-temple-gold" />
              <span>Sacred Seva & Devotional Heritage</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Crafting Divine Poshaks for <span className="text-transparent bg-clip-text bg-gradient-to-r from-temple-gold via-amber-200 to-temple-gold">Little Kanha</span>
            </h1>

            <p className="text-base sm:text-lg text-lotus-white/90 max-w-2xl font-light leading-relaxed">
              At <strong className="text-temple-gold font-semibold">{siteConfig.name}</strong>, we handcraft exquisite poshak attire, mukuts, and shringar ornaments dedicated to Laddu Gopal Ji. Founded in the holy land of Vrindavan & Meerut, every creation is woven with pure love and devotion.
            </p>

            {/* Value Props Row */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto sm:mx-0">
              <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <FiAward className="h-5 w-5 text-temple-gold mb-1" />
                <span className="text-xs font-bold text-white">100% Handcrafted</span>
                <span className="text-[10px] text-white/60">Traditional Artisans</span>
              </div>
              <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <FiShield className="h-5 w-5 text-temple-gold mb-1" />
                <span className="text-xs font-bold text-white">Pure Fabrics</span>
                <span className="text-[10px] text-white/60">Silk & Velvet</span>
              </div>
              <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <FiHeart className="h-5 w-5 text-temple-gold mb-1" />
                <span className="text-xs font-bold text-white">Devotional Seva</span>
                <span className="text-[10px] text-white/60">Made with Love</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-4">
              <Link to="/shop">
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<FiArrowRight className="h-5 w-5" />}
                  className="font-bold shadow-lg shadow-temple-gold/20"
                >
                  Explore Sacred Catalog
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 font-bold"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md rounded-3xl border-2 border-temple-gold/40 p-3 bg-gradient-to-b from-white/10 to-white/5 shadow-2xl backdrop-blur-md">
              <img
                src="/logo3.jpeg"
                alt="Divine Laddu Gopal Poshak"
                className="aspect-[4/5] w-full rounded-2xl object-cover object-center shadow-md sm:aspect-[4/3] lg:aspect-[5/6]"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-dark-charcoal/90 p-4 backdrop-blur-md border border-temple-gold/30 text-center">
                <p className="font-serif text-sm font-bold text-temple-gold">
                  &ldquo;Radhe Radhe! Every stitch carries a prayer of love.&rdquo;
                </p>
                <p className="text-[11px] text-white/70 mt-0.5 font-sans">Kanhaji Poshak Kendra Sanctuary</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
