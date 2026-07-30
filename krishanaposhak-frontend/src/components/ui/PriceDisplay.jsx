import { memo } from 'react';
import { cn } from '@/utils/cn';
import { formatPrice, formatDiscount } from '@/utils/formatPrice';

const PriceDisplay = memo(function PriceDisplay({
  price,
  originalPrice,
  size = 'md',
  showDiscount = true,
  className,
}) {
  const discountPercentage =
    originalPrice && showDiscount
      ? formatDiscount(originalPrice, price)
      : null;

  const sizeStyles = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-xl sm:text-2xl font-extrabold',
    xl: 'text-2xl sm:text-3xl font-black',
  };

  const originalSizeStyles = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  const hasDiscount = originalPrice && Number(originalPrice) > Number(price);

  return (
    <div className={cn('inline-flex items-baseline flex-wrap gap-1.5 font-display tracking-tight', className)}>
      <span className={cn('text-dark-charcoal font-semibold', sizeStyles[size])}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            'text-natural-wood/60 line-through font-normal decoration-error/50',
            originalSizeStyles[size],
          )}
        >
          {formatPrice(originalPrice)}
        </span>
      )}
      {discountPercentage && (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-500/20">
          {discountPercentage}% OFF
        </span>
      )}
    </div>
  );
});

export default PriceDisplay;
