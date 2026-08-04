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
    <div className="rounded-2xl bg-gradient-to-br from-amber-50/90 via-stone-50/80 to-amber-50/60 border border-amber-900/10 shadow-[0_2px_12px_rgba(44,40,36,0.03)] overflow-hidden">
      <div className="p-3.5 sm:p-5 xl:p-6 space-y-2.5 sm:space-y-3">
        {/* Price Display */}
        <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap whitespace-nowrap">
          <motion.span
            key={finalPrice}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-xl min-[360px]:text-2xl sm:text-3xl xl:text-4xl font-extrabold text-amber-950 tracking-tight"
          >
            ₹{Number(finalPrice).toLocaleString('en-IN')}
          </motion.span>

          {hasDiscount && (
            <span className="font-sans text-xs min-[360px]:text-sm sm:text-base xl:text-lg text-stone-400 line-through font-normal">
              ₹{Number(price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Savings Badge */}
        {savings && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] min-[360px]:text-[11px] sm:text-xs xl:text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 sm:px-3 py-1 rounded-xl shadow-2xs font-display whitespace-nowrap">
              <FiPercent className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 shrink-0" />
              Save ₹{savings.amount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold text-deep-navy bg-deep-navy/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-deep-navy/20 font-display whitespace-nowrap">
              {savings.percentage}% OFF
            </span>
          </div>
        )}

        {/* Tax & Shipping Notes */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] min-[360px]:text-[11px] sm:text-xs xl:text-sm text-stone-600 font-medium pt-0.5 flex-wrap font-body">
          <span className="text-emerald-800 font-bold flex items-center gap-1 whitespace-nowrap">
            <FiCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Inclusive of all taxes
          </span>
          <span className="text-amber-900/30 hidden min-[360px]:inline">•</span>
          <span className="text-amber-950 font-bold flex items-center gap-1 whitespace-nowrap">
            <FiTruck className="h-3.5 w-3.5 text-amber-800 shrink-0" /> Free Nationwide Shipping
          </span>
        </div>
      </div>
    </div>
  );
});

export default PricingSection;
