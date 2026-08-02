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
          <div className="inline-block rounded-full border border-dashed border-temple-gold/40 bg-temple-gold/5 px-3 py-1">
            <span className="font-mono text-sm font-bold tracking-wider text-temple-gold-dark">
              {code}
            </span>
          </div>
          <p className="mt-1.5 text-lg font-semibold text-dark-charcoal">{discountLabel}</p>
          {description && (
            <p className="mt-0.5 text-sm text-natural-wood">{description}</p>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-natural-wood">
            {minimumOrderAmount > 0 && (
              <span>Min. order: ₹{minimumOrderAmount}</span>
            )}
            {expiresAt && !isExpired && (
              <span>Expires: {new Date(expiresAt).toLocaleDateString('en-IN')}</span>
            )}
            {isExpired && <span className="text-error">Expired</span>}
          </div>
        </div>
        {onApply && !isExpired && (
          <button
            type="button"
            onClick={() => onApply(coupon)}
            disabled={isApplied}
            className={cn(
              'flex-shrink-0 min-h-[44px] rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue/50',
              isApplied
                ? 'bg-success/10 text-success cursor-default'
                : 'bg-royal-blue text-white hover:bg-deep-navy',
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
