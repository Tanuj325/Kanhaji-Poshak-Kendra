import { memo } from 'react';
import { motion } from 'framer-motion';
import { calculateShipping } from '@/utils/shippingCalculator';
import { formatPrice } from '@/utils/formatPrice';
import { FiTruck, FiCheckCircle, FiStar } from 'react-icons/fi';

const FreeShippingBar = memo(function FreeShippingBar({ subTotal = 0, className = '' }) {
  const {
    isFreeShipping,
    remainingForFreeShipping,
  } = calculateShipping(subTotal);

  const threshold = 8000;
  const progressPct = Math.min(100, Math.max(0, (subTotal / threshold) * 100));

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-300 font-display ${
        isFreeShipping
          ? 'bg-gradient-to-r from-emerald-50 via-emerald-100/60 to-emerald-50 border-emerald-300/60 shadow-2xs'
          : 'bg-gradient-to-r from-amber-50/90 via-stone-50/80 to-amber-50/70 border-amber-900/10 shadow-2xs'
      } ${className}`}
    >
      {isFreeShipping ? (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <FiCheckCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
              <FiStar className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Free Express Shipping Unlocked!</span>
            </div>
            <p className="text-xs text-emerald-800 font-body font-medium mt-0.5">
              Your sacred order qualifies for complimentary nationwide delivery.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-950">
            <span className="flex items-center gap-1.5 font-display">
              <FiTruck className="h-4 w-4 text-amber-800" />
              <span>Add <strong className="text-amber-900">{formatPrice(remainingForFreeShipping)}</strong> for FREE Shipping</span>
            </span>
            <span className="font-mono text-stone-500 text-[11px]">{Math.round(progressPct)}%</span>
          </div>

          <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-amber-700 via-amber-600 to-temple-gold rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default FreeShippingBar;
