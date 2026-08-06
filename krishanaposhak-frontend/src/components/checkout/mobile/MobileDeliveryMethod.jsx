import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import { calculateShipping } from '@/utils/shippingCalculator';
import {
  FiChevronLeft,
  FiTruck,
  FiZap,
  FiClock,
  FiCheck,
  FiArrowRight,
  FiShield,
} from 'react-icons/fi';

export default function MobileDeliveryMethod({
  subtotal = 0,
  selectedAddress,
  selectedDeliveryOption = 'standard',
  onSelectDeliveryOption,
  onContinue,
  onBack,
}) {
  const [option, setOption] = useState(selectedDeliveryOption || 'standard');

  const { shipping: baseShipping } = useMemo(() => calculateShipping(subtotal), [subtotal]);

  // Dynamic estimated dates calculation
  const dates = useMemo(() => {
    const today = new Date();

    const stdDate = new Date(today);
    stdDate.setDate(today.getDate() + 4);

    const expDate = new Date(today);
    expDate.setDate(today.getDate() + 2);

    const formatDateStr = (d) =>
      d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    return {
      standard: formatDateStr(stdDate),
      express: formatDateStr(expDate),
      sameDay: 'Today by 9:00 PM',
    };
  }, []);

  const deliveryOptions = useMemo(() => {
    const stdCost = baseShipping;
    const expCost = baseShipping + 149;
    const sameDayCost = baseShipping + 299;

    return [
      {
        id: 'standard',
        title: 'Standard Delivery',
        icon: FiTruck,
        tag: 'Most Popular',
        estimatedDate: `Delivered by ${dates.standard}`,
        etaText: '3–5 Business Days',
        cost: stdCost,
        costText: stdCost === 0 ? 'FREE' : formatPrice(stdCost),
        description: 'Reliable doorstep delivery via top tier courier partners',
        available: true,
      },
      {
        id: 'express',
        title: 'Express Delivery',
        icon: FiZap,
        tag: 'Fastest Transit',
        estimatedDate: `Delivered by ${dates.express}`,
        etaText: '1–2 Business Days',
        cost: expCost,
        costText: formatPrice(expCost),
        description: 'Priority handling & air dispatch for urgent occasions',
        available: true,
      },
      {
        id: 'sameday',
        title: 'Same Day Delivery',
        icon: FiClock,
        tag: 'Select Pincodes',
        estimatedDate: dates.sameDay,
        etaText: 'Order before 4:00 PM',
        cost: sameDayCost,
        costText: formatPrice(sameDayCost),
        description: 'Guaranteed same-day delivery in NCR & major metro hubs',
        available: true,
      },
    ];
  }, [baseShipping, dates]);

  const handleSelect = (id) => {
    setOption(id);
    onSelectDeliveryOption?.(id);
  };

  const handleProceed = () => {
    onSelectDeliveryOption?.(option);
    onContinue?.();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-display flex flex-col justify-between">
      {/* ---------------------------------------------------- */}
      {/* STICKY HEADER (54px height) */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 w-full h-[54px] bg-white/95 backdrop-blur-md border-b border-amber-900/10 px-4 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-50 text-amber-950 hover:bg-amber-100 transition-colors border border-amber-900/10 active:scale-95 min-h-[36px] min-w-[36px]"
          aria-label="Go back"
        >
          <FiChevronLeft className="w-5 h-5 text-amber-900" />
        </button>

        <div className="text-center min-w-0 px-2">
          <h1 className="font-heading text-base font-extrabold text-amber-950 truncate leading-tight">
            Delivery Method
          </h1>
          <p className="text-[11px] font-bold text-amber-800 tracking-tight">
            Step 2 of Checkout
          </p>
        </div>

        <div className="w-9" />
      </header>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT (16px outer padding, 12px card spacing) */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 px-4 py-4 space-y-3 pb-28">
        {/* Delivery Address Summary Mini Card */}
        {selectedAddress && (
          <div className="rounded-[16px] bg-amber-900/5 border border-amber-900/10 p-3.5 flex items-center justify-between gap-3 shadow-2xs font-display">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
                Delivering To
              </span>
              <p className="text-xs font-extrabold text-amber-950 truncate mt-0.5">
                {selectedAddress.fullName}
                <span className="font-normal text-stone-600"> • {selectedAddress.city}, {selectedAddress.state}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-amber-900 hover:underline shrink-0 min-h-[32px] px-2 flex items-center"
            >
              Change
            </button>
          </div>
        )}

        <div className="pt-1 pb-1">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-900">
            Select Delivery Speed
          </h2>
        </div>

        {/* ---------------------------------------------------- */}
        {/* DELIVERY CARDS (Width 100%, Rounded 18px, Padding 16px, Temple Gold Border) */}
        {/* ---------------------------------------------------- */}
        <div className="space-y-3" role="radiogroup" aria-label="Select delivery option">
          {deliveryOptions.map((item) => {
            const isSelected = option === item.id;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(item.id)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(item.id);
                  }
                }}
                className={cn(
                  'relative w-full rounded-[18px] p-4 transition-all duration-200 cursor-pointer font-display overflow-hidden text-left flex flex-col justify-between gap-3',
                  isSelected
                    ? 'border-2 border-[#D4AF37] bg-[#FAF4E8] shadow-md ring-2 ring-[#D4AF37]/20'
                    : 'border border-amber-900/10 bg-white hover:border-amber-700/30 shadow-xs hover:shadow-sm',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Custom Radio Selection */}
                    <div
                      className={cn(
                        'mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-amber-950'
                          : 'border-stone-300 bg-white',
                      )}
                    >
                      {isSelected && <FiCheck className="h-3 w-3 stroke-[3] text-amber-950" />}
                    </div>

                    {/* Delivery Icon Box */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? 'bg-amber-900 text-white shadow-xs'
                          : 'bg-amber-100/70 text-amber-900',
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Delivery Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-extrabold text-sm sm:text-base text-amber-950">
                          {item.title}
                        </span>
                        {item.tag && (
                          <span
                            className={cn(
                              'text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider',
                              item.id === 'standard'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                : item.id === 'express'
                                ? 'bg-amber-100 text-amber-950 border-amber-300'
                                : 'bg-blue-50 text-blue-900 border-blue-200',
                            )}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold text-amber-900 flex items-center gap-1 font-display pt-0.5">
                        <span>{item.estimatedDate}</span>
                        <span className="text-stone-400 font-normal">• ({item.etaText})</span>
                      </p>

                      <p className="text-xs text-stone-600 font-body leading-relaxed pt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Cost */}
                  <div className="text-right shrink-0">
                    <span
                      className={cn(
                        'font-heading font-extrabold text-sm sm:text-base block',
                        item.cost === 0 ? 'text-emerald-700' : 'text-amber-950',
                      )}
                    >
                      {item.costText}
                    </span>
                    {item.cost === 0 && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                        Free Shipping
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Security & Delivery Guarantee Badge */}
        <div className="pt-2">
          <div className="rounded-[16px] bg-white border border-amber-900/10 p-3.5 flex items-center gap-3 shadow-2xs font-display">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <FiShield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-amber-950">Guaranteed Safe & Insured Delivery</p>
              <p className="text-[11px] text-stone-500 font-body">All parcels are temple-sanitized & tracked live via SMS/WhatsApp.</p>
            </div>
          </div>
        </div>
      </main>

      {/* ---------------------------------------------------- */}
      {/* STICKY BOTTOM BAR (72px height, 52px button, Temple Gold Gradient) */}
      {/* ---------------------------------------------------- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-t border-amber-900/10 px-4 flex items-center justify-center shadow-lg font-display">
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleProceed}
          className="w-full max-w-lg h-[52px] rounded-[16px] bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-800 hover:to-stone-950 text-white font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 border border-amber-500/20 active:scale-[0.99] transition-all"
        >
          <span>Continue to Payment</span>
          <FiArrowRight className="w-5 h-5 text-amber-200" />
        </motion.button>
      </footer>
    </div>
  );
}
