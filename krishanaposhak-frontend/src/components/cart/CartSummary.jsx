import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import { calculateShipping } from '@/utils/shippingCalculator';
import Divider from '@/components/ui/Divider';
import { FiShield, FiTag, FiShoppingBag, FiTruck, FiCheckCircle } from 'react-icons/fi';

const CartSummary = memo(function CartSummary({
  subTotal = 0,
  discount = 0,
  shippingCharge = 0,
  grandTotal = 0,
  totalItems = 0,
  className,
}) {
  const savings = Math.max(0, discount);
  const {
    shipping: calculatedShipping,
    isFreeShipping,
    remainingForFreeShipping,
    freeShippingMessage,
  } = calculateShipping(subTotal);

  const displayShipping = typeof shippingCharge === 'number' && shippingCharge > 0 ? shippingCharge : calculatedShipping;
  const effectiveIsFree = displayShipping === 0 || isFreeShipping;

  return (
    <div
      className={cn(
        'rounded-2xl bg-white/90 backdrop-blur-md border border-amber-900/10 p-5 sm:p-6 shadow-[0_4px_24px_rgba(44,40,36,0.04)] space-y-4 font-display',
        className,
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
        <h3 className="font-heading text-lg sm:text-xl font-extrabold text-stone-950 flex items-center gap-2">
          <FiShoppingBag className="h-5 w-5 text-amber-800" /> Order Summary
        </h3>
        {totalItems > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/80 text-amber-950 border border-amber-300/40">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        )}
      </div>

      {/* Free Shipping Incentive Banner */}
      {effectiveIsFree ? (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 shadow-2xs">
          <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>✓ FREE DELIVERY</span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/80 border border-amber-200 text-center text-xs font-bold text-amber-950 space-y-1 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-amber-900">
            <FiTruck className="h-4 w-4 text-amber-700 shrink-0" />
            <span>Add {formatPrice(remainingForFreeShipping)} more to get FREE Delivery</span>
          </div>
          <div className="w-full bg-amber-200/70 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subTotal / 8000) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary Rows */}
      <div className="space-y-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center justify-between text-stone-700">
          <span>Subtotal</span>
          <span className="font-bold text-stone-950">{formatPrice(subTotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/70 px-3 py-2 rounded-xl border border-emerald-200/60">
            <span className="flex items-center gap-1.5 font-bold">
              <FiTag className="h-4 w-4" /> Coupon Discount
            </span>
            <span className="font-extrabold">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-stone-700">
          <span className="flex items-center gap-1.5">
            <FiTruck className="h-4 w-4 text-amber-800" /> Shipping
          </span>
          <span className={cn('font-bold', effectiveIsFree ? 'text-emerald-600 font-extrabold' : 'text-stone-950')}>
            {effectiveIsFree ? 'FREE' : formatPrice(displayShipping)}
          </span>
        </div>

        {savings > 0 && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-100/70 to-amber-50 border border-amber-300/50 text-center">
            <p className="text-xs font-bold text-amber-950">
              🎉 Total Savings on this order: <span className="font-extrabold text-amber-900">{formatPrice(savings)}</span>
            </p>
          </div>
        )}
      </div>

      <Divider className="my-2 border-amber-900/10" />

      {/* Grand Total */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="font-heading font-extrabold text-base sm:text-lg text-stone-950 block">Grand Total</span>
          <span className="text-[11px] text-stone-500 font-medium">Includes all applicable taxes</span>
        </div>
        <span className="font-heading font-black text-2xl sm:text-3xl text-amber-950 tracking-tight">
          {formatPrice(grandTotal)}
        </span>
      </div>

      {/* Trust Badge */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-stone-600 bg-amber-50/60 py-2.5 px-3 rounded-xl border border-amber-200/50">
        <FiShield className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>100% Safe & Secure Checkout Guaranteed</span>
      </div>
    </div>
  );
});

export default CartSummary;
