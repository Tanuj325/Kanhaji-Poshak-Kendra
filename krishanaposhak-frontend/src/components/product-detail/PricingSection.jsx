import { memo, useMemo } from 'react';
import { FiCheck, FiTruck } from 'react-icons/fi';

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
    <div className="p-4 sm:p-5 xl:p-6 rounded-2xl bg-gradient-to-r from-amber-50/80 via-stone-50/90 to-amber-50/60 border border-amber-900/10 shadow-[0_2px_10px_rgba(44,40,36,0.02)] space-y-2.5">
      {/* Price block - Strictly aligned on ONE line */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Main Selling Price */}
        <span className="font-heading text-2xl sm:text-3xl xl:text-4xl font-extrabold text-amber-950 tracking-tight">
          ₹{Number(finalPrice).toLocaleString('en-IN')}
        </span>

        {/* Original MRP Strikethrough Price */}
        {hasDiscount && (
          <span className="font-sans text-sm sm:text-base xl:text-lg text-stone-400 line-through font-normal">
            ₹{Number(price).toLocaleString('en-IN')}
          </span>
        )}

        {/* Savings & Discount Pill */}
        {savings && (
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs xl:text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-lg shadow-2xs font-display">
            Save ₹{savings.amount.toLocaleString('en-IN')} ({savings.percentage}% OFF)
          </span>
        )}
      </div>

      {/* Tax & Free Nationwide Delivery micro-notes */}
      <div className="flex items-center gap-2.5 text-xs xl:text-sm text-stone-600 font-medium pt-1 flex-wrap font-body">
        <span className="text-emerald-800 font-bold flex items-center gap-1">
          <FiCheck className="h-4 w-4 text-emerald-600" /> Inclusive of all taxes
        </span>
        <span className="text-amber-900/40">•</span>
        <span className="text-amber-950 font-bold flex items-center gap-1">
          <FiTruck className="h-4 w-4 text-amber-800" /> Free Shipping Nationwide
        </span>
      </div>
    </div>
  );
});

export default PricingSection;
