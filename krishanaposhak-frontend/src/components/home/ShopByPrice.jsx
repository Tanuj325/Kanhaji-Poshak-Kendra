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
    <section className="py-6 sm:py-10 bg-warm-cream/40 relative">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3.5 sm:mb-8 text-left sm:text-center px-4 sm:px-0"
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-amber-900 bg-amber-100/70 px-2.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full border border-amber-800/20 font-display">
            <FiTag className="h-3.5 w-3.5 text-amber-800" /> Tailored Options
          </span>
          <h2 className="mt-1 sm:mt-3 font-heading text-xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950">
            Shop By Price Range
          </h2>
        </motion.div>

        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-3 px-4 pb-2 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-5">
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
                className="snap-start w-[145px] shrink-0 md:w-auto"
              >
                <Link
                  to={href}
                  className="group relative flex min-h-[5.5rem] sm:min-h-[8.5rem] flex-col items-center justify-between rounded-2xl sm:rounded-[24px] bg-[linear-gradient(135deg,#0f2440,#1b3a5c_60%,#0d4f5e)] sm:bg-none sm:bg-white p-3 sm:p-5 text-center shadow-md border border-amber-500/30 sm:border-amber-900/15 transition-all duration-300 active-tap-scale"
                >
                  <span className="rounded-full bg-amber-400/20 sm:bg-amber-950 px-2.5 sm:px-3 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-amber-300 border border-amber-400/30 sm:border-amber-500/30 font-mono shadow-xs whitespace-nowrap">
                    {range.tag}
                  </span>
                  <span className="font-heading text-xs sm:text-base lg:text-lg font-extrabold text-white sm:text-amber-950 my-1 group-hover:text-amber-300 sm:group-hover:text-amber-800 transition-colors whitespace-nowrap">
                    {range.label}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-300 sm:text-amber-900 group-hover:text-white sm:group-hover:text-amber-950 transition-colors pt-1 border-t border-white/10 sm:border-amber-900/10 w-full justify-center font-display">
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
