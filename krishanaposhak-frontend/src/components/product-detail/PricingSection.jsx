import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiTruck, FiPercent } from 'react-icons/fi';

const PricingSection = memo(function PricingSection({ variant, product }) {
  const activeVariant = variant || product?.variants?.[0] || product;

  const price = activeVariant?.price || product?.price || 0;
  const discountPrice = activeVariant?.discountPrice || product?.discountPrice;

  const finalPrice = discountPrice && discountPrice < price ? discountPrice : price;
  const hasDiscount = discountPrice && discountPrice < price;

  const savings = useMemo(() => {
    if (!hasDiscount) return null;
    const diff = price - discountPrice;
    const pct = Math.round((diff / price) * 100);
    return { amount: diff, percentage: pct };
  }, [price, discountPrice, hasDiscount]);

  if (!price) return null;

  return (
    <div className="rounded-xl bg-stone-50/80 border border-slate-200/80 p-4 space-y-2.5">
      {/* Price Display */}
      <div className="flex items-baseline gap-3 flex-wrap whitespace-nowrap">
        <motion.span
          key={finalPrice}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl xl:text-4xl font-extrabold text-[#0F2440] tracking-tight"
        >
          ₹{Number(finalPrice).toLocaleString('en-IN')}
        </motion.span>

        {hasDiscount && (
          <span className="font-sans text-base lg:text-lg text-stone-400 line-through font-normal">
            ₹{Number(price).toLocaleString('en-IN')}
          </span>
        )}

        {savings && (
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md shadow-2xs font-display whitespace-nowrap">
              <FiPercent className="h-3 w-3 text-emerald-600 shrink-0" />
              Save ₹{savings.amount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-[#C99A3B] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 font-display whitespace-nowrap">
              {savings.percentage}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Tax & Shipping Notes */}
      <div className="flex items-center gap-3 text-xs text-stone-500 font-medium pt-1 flex-wrap font-body border-t border-slate-200/60">
        <span className="text-emerald-700 font-bold flex items-center gap-1 whitespace-nowrap">
          <FiCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Inclusive of all taxes
        </span>
        <span className="text-stone-300">•</span>
        <span className="text-stone-700 font-bold flex items-center gap-1 whitespace-nowrap">
          <FiTruck className="h-3.5 w-3.5 text-[#C99A3B] shrink-0" /> Free Nationwide Shipping
        </span>
      </div>
    </div>
  );
});

export default PricingSection;
