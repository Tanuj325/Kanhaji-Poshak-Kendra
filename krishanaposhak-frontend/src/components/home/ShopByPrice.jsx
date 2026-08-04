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
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-900 bg-amber-100/70 px-3.5 py-1.5 rounded-full border border-amber-800/20 font-display">
            <FiTag className="h-3.5 w-3.5 text-amber-800" /> Tailored Options
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold text-amber-950 sm:text-4xl">
            Shop By Price Range
          </h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base max-w-md mx-auto font-body">
            Find the finest sacred attire tailored to your exact budget
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                  className="group relative flex min-h-[8.5rem] flex-col items-center justify-center rounded-[24px] bg-white p-5 text-center shadow-[0_14px_30px_rgba(44,40,36,0.08)] border border-amber-900/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(44,40,36,0.12)] hover:border-amber-700/40"
                >
                  <span className="absolute -top-2.5 rounded-full bg-amber-950 px-3 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/30 font-mono shadow-xs">
                    {range.tag}
                  </span>
                  <span className="font-heading text-base sm:text-lg font-extrabold text-amber-950 mt-2 group-hover:text-amber-800 transition-colors">
                    {range.label}
                  </span>
                  <span className="mt-2 flex items-center gap-1 text-xs font-extrabold text-amber-900 group-hover:text-amber-950 transition-colors pt-2 border-t border-amber-900/10 w-full justify-center font-display">
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
