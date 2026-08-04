import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import { calculateShipping } from '@/utils/shippingCalculator';
import Divider from '@/components/ui/Divider';
import FreeShippingBar from '@/components/cart/FreeShippingBar';
import CheckoutItemRow from './CheckoutItemRow';
import { FiShoppingBag, FiShield, FiTag, FiTruck } from 'react-icons/fi';

const CheckoutOrderSummary = memo(function CheckoutOrderSummary({
  items,
  subtotal = 0,
  discount = 0,
  shippingCharge = 0,
  grandTotal = 0,
  couponCode,
  onRemoveCoupon,
}) {
  const {
    shipping: calculatedShipping,
    isFreeShipping,
  } = calculateShipping(subtotal);

  const displayShipping = typeof shippingCharge === 'number' && shippingCharge > 0 ? shippingCharge : calculatedShipping;
  const effectiveIsFree = displayShipping === 0 || isFreeShipping;
  const savings = Math.max(0, discount);

  return (
    <div className="rounded-2xl bg-white border border-amber-900/10 p-5 sm:p-6 shadow-[0_4px_24px_rgba(44,40,36,0.04)] space-y-4 font-display">
      <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
        <h3 className="font-heading text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
          <FiShoppingBag className="h-5 w-5 text-amber-800" /> Order Summary
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/80 text-amber-950 border border-amber-300/40">
          {items?.length || 0} {items?.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {/* Free Shipping Progress Indicator */}
      <FreeShippingBar subTotal={subtotal} />

      {/* Order Item List Preview */}
      {Array.isArray(items) && items.length > 0 && (
        <div className="max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-200">
          {items.map((item) => (
            <CheckoutItemRow key={item.cartItemId || item.id || item.variantId} item={item} />
          ))}
        </div>
      )}

      <Divider className="my-2 border-amber-900/10" />

      {/* Pricing Breakdown */}
      <div className="space-y-2.5 text-xs sm:text-sm font-medium">
        <div className="flex items-center justify-between text-stone-700">
          <span>Subtotal</span>
          <span className="font-bold text-amber-950 font-mono">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200/60 font-body">
            <span className="flex items-center gap-1.5 font-bold font-display">
              <FiTag className="h-4 w-4 text-emerald-600" /> Discount Savings
            </span>
            <span className="font-extrabold font-mono">-{formatPrice(discount)}</span>
          </div>
        )}

        {couponCode && (
          <div className="flex items-center justify-between bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-950 font-mono">
            <span>🏷️ Coupon ({couponCode})</span>
            {onRemoveCoupon && (
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-[11px] text-rose-600 hover:underline font-sans"
              >
                Remove
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-stone-700">
          <span className="flex items-center gap-1.5">
            <FiTruck className="h-4 w-4 text-amber-800" /> Shipping
          </span>
          <span className={cn('font-bold font-mono', effectiveIsFree ? 'text-emerald-700 font-extrabold font-display' : 'text-amber-950')}>
            {effectiveIsFree ? 'FREE' : formatPrice(displayShipping)}
          </span>
        </div>

        {savings > 0 && (
          <div className="p-2 rounded-xl bg-amber-100/60 border border-amber-300/40 text-center">
            <p className="text-xs font-bold text-amber-950">
              🎉 You save <span className="font-extrabold text-amber-900 font-mono">{formatPrice(savings)}</span> on this order!
            </p>
          </div>
        )}
      </div>

      <Divider className="my-2 border-amber-900/10" />

      {/* Grand Total */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="font-heading font-extrabold text-base sm:text-lg text-amber-950 block">Grand Total</span>
          <span className="text-[11px] text-stone-500 font-medium">Inclusive of all taxes</span>
        </div>
        <span className="font-heading font-black text-2xl sm:text-3xl text-amber-950 tracking-tight font-mono">
          {formatPrice(grandTotal)}
        </span>
      </div>

      {/* Security Note */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-stone-600 bg-amber-50/60 py-2.5 px-3 rounded-xl border border-amber-200/50 font-body">
        <FiShield className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>100% Safe & Secure Bank Processing</span>
      </div>
    </div>
  );
});

export default CheckoutOrderSummary;
