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
    <section className="py-4 lg:py-10 bg-stone-50/60 relative font-display">
      <div className="container-page">
        {/* ─── NEW MOBILE UI (<1024px) ─── */}
        <div className="block lg:hidden">
          {/* Section Header: Title 16px, Section spacing 16px, Edge Padding 16px (px-4) */}
          <div className="flex items-center justify-between mb-3 px-4">
            <h2 className="text-[16px] font-semibold text-stone-900 leading-none">
              Shop by Budget
            </h2>
          </div>

          {/* Compact horizontal scrollable price cards with edge padding 16px */}
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-2.5 px-4 pb-1">
            {priceRanges.map((range, index) => {
              const searchParams = new URLSearchParams();
              if (range.minPrice !== undefined && range.minPrice !== '') searchParams.set('minPrice', range.minPrice);
              if (range.maxPrice !== undefined && range.maxPrice !== '') searchParams.set('maxPrice', range.maxPrice);
              const href = `${ROUTE_PATHS.SHOP}?${searchParams.toString()}`;

              return (
                <Link
                  key={index}
                  to={href}
                  className="snap-start w-[118px] shrink-0 p-2.5 rounded-xl bg-white border border-stone-200/40 shadow-none flex flex-col justify-between active-tap-scale"
                >
                  <span className="text-[9px] font-medium text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/40 self-start truncate max-w-full">
                    {range.tag}
                  </span>
                  <span className="text-[12px] font-semibold text-stone-900 my-1 truncate">
                    {range.label}
                  </span>
                  <span className="text-[11px] font-medium text-amber-900 flex items-center gap-1">
                    <span>Explore</span>
                    <FiArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── OLD DESKTOP UI (>=1024px - 100% UNTOUCHED) ─── */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center px-0"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-amber-900 bg-amber-100/70 px-3 py-1.5 rounded-full border border-amber-800/20 font-display">
              <FiTag className="h-3.5 w-3.5 text-amber-800" /> Tailored Options
            </span>
            <h2 className="mt-3 font-heading text-3xl lg:text-4xl font-extrabold text-amber-950">
              Shop By Price Range
            </h2>
          </motion.div>

          <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
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
                    className="group relative flex min-h-[8.5rem] flex-col items-center justify-between rounded-[24px] bg-white p-5 text-center shadow-md border border-amber-900/15 transition-all duration-300 active-tap-scale"
                  >
                    <span className="rounded-full bg-amber-950 px-3 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/30 font-mono shadow-xs whitespace-nowrap">
                      {range.tag}
                    </span>
                    <span className="font-heading text-base lg:text-lg font-extrabold text-amber-950 my-1 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                      {range.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-900 group-hover:text-amber-950 transition-colors pt-1 border-t border-amber-900/10 w-full justify-center font-display">
                      <span>Explore</span> <FiArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ShopByPrice;
