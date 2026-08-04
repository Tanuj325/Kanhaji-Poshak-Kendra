import { memo } from 'react';
import { cn } from '@/utils/cn';
import Card from '@/components/ui/Card';

const CouponCard = memo(function CouponCard({
  coupon,
  onApply,
  isApplied = false,
  className,
}) {
  if (!coupon) return null;

  const { code, discountType, discountValue, minimumOrderAmount, description, expiresAt } = coupon;

  const discountLabel = discountType === 'PERCENTAGE'
    ? `${discountValue}% OFF`
    : `₹${discountValue} OFF`;

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;

  return (
    <Card
      variant="bordered"
      padding="md"
      className={cn(
        'relative overflow-hidden border-white/70 bg-white/90 backdrop-blur-sm',
        isApplied && 'border-royal-blue/30 bg-royal-blue/5',
        isExpired && 'opacity-50',
        className,
      )}
    >
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-temple-gold/10 blur-sm" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-block rounded-full border border-dashed border-amber-800/40 bg-amber-100/60 px-3 py-1">
            <span className="font-mono text-sm font-extrabold tracking-wider text-amber-950">
              {code}
            </span>
          </div>
          <p className="mt-1.5 text-lg font-extrabold text-amber-950 font-heading">{discountLabel}</p>
          {description && (
            <p className="mt-0.5 text-sm text-stone-600 font-body">{description}</p>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-stone-500 font-display">
            {minimumOrderAmount > 0 && (
              <span>Min. order: ₹{minimumOrderAmount}</span>
            )}
            {expiresAt && !isExpired && (
              <span>Expires: {new Date(expiresAt).toLocaleDateString('en-IN')}</span>
            )}
            {isExpired && <span className="text-rose-600 font-bold">Expired</span>}
          </div>
        </div>
        {onApply && !isExpired && (
          <button
            type="button"
            onClick={() => onApply(coupon)}
            disabled={isApplied}
            className={cn(
              'flex-shrink-0 min-h-[44px] rounded-full px-4 py-2 text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
              isApplied
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default'
                : 'bg-gradient-to-r from-amber-900 to-stone-900 text-amber-50 hover:from-amber-800 hover:to-amber-950 shadow-md',
            )}
          >
            {isApplied ? 'Applied' : 'Apply'}
          </button>
        )}
      </div>
    </Card>
  );
});

export default CouponCard;
