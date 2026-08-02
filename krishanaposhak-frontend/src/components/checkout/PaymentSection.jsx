import { useCallback } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import { formatPrice } from '@/utils/formatPrice';

const paymentMethods = [
  {
    id: 'RAZORPAY',
    label: 'Online Payment (Razorpay)',
    description: 'Pay via Credit/Debit Card, UPI, Net Banking, or Wallet',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    id: 'COD',
    label: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function PaymentSection({
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
    : (grandTotal > 0 ? `Pay ${formatPrice(grandTotal)}` : 'Pay with Razorpay');

  return (
    <div className="rounded-lg bg-white border border-muted-sand/30 p-4 sm:p-6">
      <h3 className="font-display text-lg font-semibold text-dark-charcoal mb-4">Payment Method</h3>

      <div className="space-y-3" role="radiogroup" aria-label="Payment method">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={cn(
              'relative min-h-[76px] rounded-lg border p-4 cursor-pointer transition-all duration-150',
              selectedMethod === method.id
                ? 'border-royal-blue bg-royal-blue/5 ring-1 ring-royal-blue'
                : 'border-muted-sand/30 bg-white hover:border-muted-sand',
            )}
            onClick={() => onSelectMethod(method.id)}
            role="radio"
            aria-checked={selectedMethod === method.id}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectMethod(method.id); } }}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                selectedMethod === method.id ? 'border-royal-blue' : 'border-muted-sand',
              )}>
                {selectedMethod === method.id && <div className="h-2 w-2 rounded-full bg-royal-blue" />}
              </div>
              <div className="text-natural-wood/60 flex-shrink-0 mt-0.5" aria-hidden="true">
                {method.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-dark-charcoal">{method.label}</p>
                <p className="text-xs text-natural-wood mt-0.5">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-sm text-error" role="alert">{error}</p>
      )}

      <Divider className="my-4" />

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          size="lg"
          isFullWidth
          onClick={handlePlaceOrder}
          isLoading={isPlacingOrder || isCreatingRazorpay}
          isDisabled={!isValid}
          aria-label={buttonText}
        >
          {buttonText}
        </Button>
        {selectedMethod === 'RAZORPAY' && (
          <p className="text-xs text-natural-wood text-center">
            You will be redirected to Razorpay secure checkout
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentSection;
