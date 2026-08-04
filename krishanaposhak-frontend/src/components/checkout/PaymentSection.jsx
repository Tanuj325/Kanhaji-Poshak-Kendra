import { useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatPrice';
import { FiCreditCard, FiDollarSign, FiCheck, FiShield, FiLock, FiAlertCircle } from 'react-icons/fi';

const paymentMethods = [
  {
    id: 'RAZORPAY',
    label: 'Online Payment (Razorpay)',
    badge: 'Recommended',
    description: 'UPI (GPay, PhonePe, Paytm), Credit/Debit Card, Net Banking, Wallets',
    icon: FiCreditCard,
    iconBg: 'bg-emerald-100/70 text-emerald-800',
  },
  {
    id: 'COD',
    label: 'Cash on Delivery',
    badge: 'Pay Upon Arrival',
    description: 'Pay cash to courier executive when your sacred order arrives',
    icon: FiDollarSign,
    iconBg: 'bg-amber-100/70 text-amber-900',
  },
];

const PaymentSection = memo(function PaymentSection({
  selectedMethod,
  onSelectMethod,
  onPlaceOrder,
  isPlacingOrder,
  isCreatingRazorpay,
  isValid,
  error,
  grandTotal = 0,
}) {
  const handlePlaceOrder = useCallback(() => {
    if (!isValid || isPlacingOrder || isCreatingRazorpay) return;
    onPlaceOrder();
  }, [isValid, isPlacingOrder, isCreatingRazorpay, onPlaceOrder]);

  const buttonText = selectedMethod === 'COD' 
    ? 'Place Order (COD)' 
    : (grandTotal > 0 ? `Pay ${formatPrice(grandTotal)} via Razorpay` : 'Pay with Razorpay');

  return (
    <div className="rounded-2xl bg-white border border-amber-900/10 p-5 sm:p-6 shadow-xs font-display space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-amber-950 flex items-center gap-2">
          <FiCreditCard className="h-5 w-5 text-amber-800" />
          <span>Select Payment Method</span>
        </h3>
        <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
          <FiShield className="h-3.5 w-3.5 text-emerald-600" /> SSL Encrypted
        </span>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Payment method selector">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <motion.div
              key={method.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectMethod(method.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMethod(method.id);
                }
              }}
              className={cn(
                'relative rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 cursor-pointer overflow-hidden text-left',
                isSelected
                  ? 'border-amber-800 bg-amber-900/5 ring-2 ring-amber-800/20 shadow-md'
                  : 'border-amber-900/10 bg-white hover:border-amber-700/40 hover:bg-amber-50/40 shadow-xs',
              )}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={cn(
                    'mt-0.5 h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                    isSelected ? 'border-amber-800 bg-amber-900 text-white' : 'border-stone-300 bg-white',
                  )}
                >
                  {isSelected && <FiCheck className="h-3 w-3 stroke-[3]" />}
                </div>

                <div className={`h-9 w-9 rounded-xl ${method.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-extrabold text-sm sm:text-base text-amber-950">
                      {method.label}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/50 uppercase tracking-wider">
                      {method.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-body leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2" role="alert">
          <FiAlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedMethod === 'RAZORPAY' && (
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 font-body">
          <FiLock className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Official Bank Gateways: UPI, Cards, Net Banking & Instant Refunds</span>
        </div>
      )}
    </div>
  );
});

export default PaymentSection;
