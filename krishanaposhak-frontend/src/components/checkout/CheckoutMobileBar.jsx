import { memo } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/formatPrice';
import { FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

const CheckoutMobileBar = memo(function CheckoutMobileBar({
  grandTotal = 0,
  paymentMethod = 'RAZORPAY',
  isDisabled = false,
  isProcessing = false,
  onPay,
}) {
  const buttonLabel = paymentMethod === 'COD'
    ? 'Confirm COD Order'
    : (grandTotal > 0 ? `Pay ${formatPrice(grandTotal)}` : 'Pay Now');

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-900/10 p-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] font-display">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Grand Total</span>
          <span className="font-heading font-extrabold text-lg sm:text-xl text-amber-950 leading-tight font-mono">
            {formatPrice(grandTotal)}
          </span>
          <span className="text-[9px] text-emerald-800 font-bold flex items-center gap-1 font-body">
            <FiShield className="h-2.5 w-2.5 text-emerald-600" /> SSL Secured
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onPay}
          disabled={isDisabled || isProcessing}
          className="rounded-2xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white font-bold py-3.5 px-6 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 flex-1 max-w-[240px] min-h-[48px] border border-amber-500/20 disabled:opacity-50"
        >
          <FiLock className="h-4 w-4 text-amber-300" />
          <span>{isProcessing ? 'Processing...' : buttonLabel}</span>
          {!isProcessing && <FiArrowRight className="h-4 w-4 text-amber-300" />}
        </motion.button>
      </div>
    </div>
  );
});

export default CheckoutMobileBar;
