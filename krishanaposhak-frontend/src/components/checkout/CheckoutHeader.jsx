import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiMapPin, FiCreditCard, FiCheckCircle, FiShield } from 'react-icons/fi';

const CheckoutHeader = memo(function CheckoutHeader({ currentStep = 'address', onStepClick }) {
  const steps = [
    { id: 'cart', label: 'Cart', icon: FiShoppingBag, href: '/cart' },
    { id: 'address', label: 'Shipping Address', icon: FiMapPin },
    { id: 'payment', label: 'Payment & Promo', icon: FiCreditCard },
    { id: 'review', label: 'Review & Order', icon: FiCheckCircle },
  ];

  const getStepIndex = (id) => steps.findIndex((s) => s.id === id);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full bg-white border border-amber-900/10 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(44,40,36,0.03)] font-display">
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 sm:pb-4 border-b border-amber-900/10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-300/40">
            ✦ Official Bank Encrypted Checkout ✦
          </span>
          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-950 mt-1 flex items-center gap-2">
            <span>Secure Checkout</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs font-display">
          <FiShield className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {/* Steps Indicator Bar */}
      <div className="pt-3 sm:pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = step.id === currentStep;
            const isCompleted = idx < currentIndex;
            const isClickable = isCompleted || step.id === 'cart';

            return (
              <motion.button
                key={step.id}
                type="button"
                onClick={() => {
                  if (isClickable && onStepClick) {
                    onStepClick(step.id);
                  }
                }}
                disabled={!isClickable && !isCurrent}
                whileTap={isClickable ? { scale: 0.98 } : undefined}
                className={`relative flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl transition-all text-left min-h-[48px] ${
                  isCurrent
                    ? 'bg-amber-900 text-amber-50 shadow-md ring-2 ring-amber-800/20 font-bold'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100/80 cursor-pointer font-bold border border-emerald-200/60'
                    : 'bg-stone-50 text-stone-400 cursor-not-allowed border border-stone-200/60'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold shrink-0 ${
                    isCurrent
                      ? 'bg-amber-50 text-amber-950 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? <FiCheckCircle className="h-4 w-4" /> : idx + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs block leading-tight font-display truncate">
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] text-amber-200 font-mono font-medium block uppercase tracking-wider">
                      Current Step
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CheckoutHeader;
