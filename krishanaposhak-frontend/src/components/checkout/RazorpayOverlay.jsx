import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';

const RazorpayOverlay = memo(function RazorpayOverlay({ isVisible = false, statusText = 'Connecting to Razorpay Secure Gateway...' }) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 font-display"
      >
        <div className="max-w-sm w-full bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-amber-500/20 space-y-5">
          {/* Animated Spinner Icon */}
          <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-800 animate-spin" />
            <FiLock className="h-6 w-6 text-amber-900" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-amber-950">
              Processing Payment
            </h3>
            <p className="text-xs text-stone-600 font-body leading-relaxed">
              {statusText}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
            <FiShield className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Do not refresh or close this window</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default RazorpayOverlay;
