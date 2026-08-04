import { memo } from 'react';
import { FiShoppingBag, FiTruck, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const CartHeader = memo(function CartHeader({ currentStep = 1, itemCount = 0 }) {
  const steps = [
    { number: 1, label: 'Shopping Cart', icon: FiShoppingBag },
    { number: 2, label: 'Shipping & Address', icon: FiTruck },
    { number: 3, label: 'Payment', icon: FiCreditCard },
    { number: 4, label: 'Confirmation', icon: FiCheckCircle },
  ];

  return (
    <div className="w-full bg-white border border-amber-900/10 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(44,40,36,0.03)] font-display">
      <div className="flex items-center justify-between gap-3 flex-wrap pb-3 sm:pb-4 border-b border-amber-900/10">
        <div>
          <span className="text-[9px] min-[360px]:text-[10px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100/70 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-300/40">
            ✦ Sacred Poshak Checkout ✦
          </span>
          <h1 className="font-heading text-lg min-[360px]:text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-950 mt-1 flex items-center gap-2">
            <span>Shopping Cart</span>
            {itemCount > 0 && (
              <span className="text-xs font-sans font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </h1>
        </div>

        {/* Mobile Step Indicator */}
        <div className="flex md:hidden items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-900/10">
          <span className="h-2 w-2 rounded-full bg-amber-800 animate-pulse" />
          <span>Step 1 of 4: Cart</span>
        </div>

        {/* Horizontal Progress Stepper for Desktop/Tablet */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div key={step.number} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-900 text-amber-50 shadow-md ring-2 ring-amber-800/20'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-4 rounded-full ${
                      isCompleted ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CartHeader;
