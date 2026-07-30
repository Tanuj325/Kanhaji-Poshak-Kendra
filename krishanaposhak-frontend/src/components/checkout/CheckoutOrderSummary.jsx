import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import { calculateShipping } from '@/utils/shippingCalculator';
import Divider from '@/components/ui/Divider';
import { FiTruck, FiCheckCircle } from 'react-icons/fi';

const CheckoutItemRow = memo(function CheckoutItemRow({ item }) {
  return (
    <div className="flex gap-3 py-3">
      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-warm-cream">
        <img
          src={item.imageUrl || '/placeholder.svg'}
          alt={item.productName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-charcoal line-clamp-1">{item.productName}</p>
        <p className="text-xs text-natural-wood mt-0.5">Size: {item.size}</p>
        <p className="text-xs text-natural-wood">Qty: {item.quantity}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-dark-charcoal">{formatPrice(item.totalPrice || item.price * item.quantity)}</p>
        {item.discountPrice && item.discountPrice < item.price && (
          <p className="text-xs text-natural-wood line-through">{formatPrice(item.price)}</p>
        )}
      </div>
    </div>
  );
});

function CheckoutOrderSummary({ items, subtotal, discount, shippingCharge, grandTotal, couponCode, onRemoveCoupon }) {
  const {
    shipping: calculatedShipping,
    isFreeShipping,
    remainingForFreeShipping,
    freeShippingMessage,
  } = calculateShipping(subtotal);

  const displayShipping = typeof shippingCharge === 'number' && shippingCharge > 0 ? shippingCharge : calculatedShipping;
  const effectiveIsFree = displayShipping === 0 || isFreeShipping;

  return (
    <div className="rounded-lg bg-white border border-muted-sand/30 p-4 sm:p-6 shadow-xs">
      <h3 className="font-display text-lg font-semibold text-dark-charcoal mb-2">Order Summary</h3>
      <p className="text-xs text-natural-wood mb-4">{items?.length || 0} item(s)</p>

      {/* Free Shipping Callout */}
      {effectiveIsFree ? (
        <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
          <FiCheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>✓ FREE DELIVERY</span>
        </div>
      ) : (
        <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-between gap-1">
          <span className="flex items-center gap-1">
            <FiTruck className="h-3.5 w-3.5 text-amber-700 shrink-0" />
            <span>Add {formatPrice(remainingForFreeShipping)} more to get FREE Delivery</span>
          </span>
        </div>
      )}

      <div className="divide-y divide-muted-sand/20">
        {Array.isArray(items) && items.map((item) => (
          <CheckoutItemRow key={item.cartItemId || item.id} item={item} />
        ))}
      </div>

      <Divider className="my-3" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-natural-wood">Subtotal</span>
          <span className="font-medium text-dark-charcoal">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        {couponCode && (
          <div className="flex items-center justify-between bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              🏷️ Coupon: <span className="font-mono">{couponCode}</span>
            </span>
            {onRemoveCoupon && (
              <button onClick={onRemoveCoupon} className="text-[11px] font-bold text-error hover:underline" type="button">
                Remove
              </button>
            )}
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-natural-wood">Shipping</span>
          <span className={cn('font-medium', effectiveIsFree ? 'text-emerald-600 font-bold' : 'text-dark-charcoal')}>
            {effectiveIsFree ? 'FREE' : formatPrice(displayShipping)}
          </span>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="flex justify-between items-center">
        <span className="font-semibold text-dark-charcoal">Grand Total</span>
        <span className="font-bold text-xl text-royal-blue">{formatPrice(grandTotal)}</span>
      </div>
    </div>
  );
}

export default CheckoutOrderSummary;