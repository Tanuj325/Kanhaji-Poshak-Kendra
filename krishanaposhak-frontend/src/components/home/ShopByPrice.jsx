import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiTag, FiArrowRight } from 'react-icons/fi';

const priceRanges = [
  { label: 'Under ₹500', minPrice: 0, maxPrice: 500, tag: 'Budget Friendly' },
  { label: '₹500 - ₹1,000', minPrice: 500, maxPrice: 1000, tag: 'Popular Choice' },
  { label: '₹1,000 - ₹2,500', minPrice: 1000, maxPrice: 2500, tag: 'Best Value' },
  { label: '₹2,500 - ₹5,000', minPrice: 2500, maxPrice: 5000, tag: 'Premium' },
  { label: 'Above ₹5,000', minPrice: 5000, maxPrice: '', tag: 'Exclusive Royal' },
];

const ShopByPrice = memo(function ShopByPrice() {
  return (
    <section className="section-padding bg-warm-cream/40 relative">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center sm:mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-temple-gold bg-temple-gold/10 px-3.5 py-1 rounded-full border border-temple-gold/20">
            <FiTag className="h-3.5 w-3.5" /> Tailored Options
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-dark-charcoal sm:text-4xl">
            Shop By Price Range
          </h2>
          <p className="mt-2 text-sm text-natural-wood sm:text-base max-w-md mx-auto">
            Find the finest sacred attire tailored to your exact budget
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {priceRanges.map((range, index) => {
            const searchParams = new URLSearchParams();
            if (range.minPrice !== undefined && range.minPrice !== '') searchParams.set('minPrice', range.minPrice);
            if (range.maxPrice !== undefined && range.maxPrice !== '') searchParams.set('maxPrice', range.maxPrice);
            const href = `${ROUTE_PATHS.SHOP}?${searchParams.toString()}`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  to={href}
                  className="group relative flex flex-col items-center justify-center rounded-2xl bg-white p-5 text-center shadow-xs border border-temple-gold/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-temple-gold"
                >
                  <span className="absolute -top-2.5 rounded-full bg-deep-navy px-2.5 py-0.5 text-[10px] font-bold text-temple-gold border border-temple-gold/30 font-mono shadow-xs">
                    {range.tag}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold text-dark-charcoal mt-2 group-hover:text-royal-blue transition-colors">
                    {range.label}
                  </span>
                  <span className="mt-2 flex items-center gap-1 text-xs font-bold text-temple-gold group-hover:text-royal-blue transition-colors pt-2 border-t border-muted-sand/15 w-full justify-center">
                    <span>Explore</span> <FiArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default ShopByPrice;
