import { memo } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/formatPrice';
import { FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

const CartStickyMobileBar = memo(function CartStickyMobileBar({
  grandTotal = 0,
  subTotal = 0,
  discount = 0,
  onProceedToCheckout,
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] font-display">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2.5">
        <div className="flex flex-col min-w-0 shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider">Total</span>
            {discount > 0 && (
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded whitespace-nowrap">
                Saved {formatPrice(discount)}
              </span>
            )}
          </div>
          <span className="font-heading font-extrabold text-base min-[360px]:text-lg sm:text-xl text-amber-950 leading-tight font-mono">
            {formatPrice(grandTotal)}
          </span>
          <span className="text-[9px] text-stone-500 font-medium flex items-center gap-1">
            <FiShield className="h-2.5 w-2.5 text-emerald-600 shrink-0" /> Free Returns
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onProceedToCheckout}
          className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white font-bold py-3 px-5 text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 flex-1 max-w-[220px] min-h-[48px] border border-amber-500/20"
        >
          <FiLock className="h-4 w-4 text-amber-300 shrink-0" />
          <span className="truncate">Proceed to Checkout</span>
          <FiArrowRight className="h-4 w-4 text-amber-300 shrink-0" />
        </motion.button>
      </div>
    </div>
  );
});

export default CartStickyMobileBar;
