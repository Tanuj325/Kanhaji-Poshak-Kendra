import { memo } from 'react';
import { cn } from '@/utils/cn';
import { calculateDiscount } from '@/utils/calculateDiscount';

const DiscountBadge = memo(function DiscountBadge({
  originalPrice,
  discountPrice,
  size = 'sm',
  className,
}) {
  const percentage = calculateDiscount(originalPrice, discountPrice);

  if (!percentage) return null;

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px] font-bold',
    sm: 'px-2.5 py-1 text-xs font-bold',
    md: 'px-3 py-1.5 text-sm font-extrabold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-display tracking-wider uppercase bg-deep-navy/95 text-temple-gold-light shadow-md border border-temple-gold/30 backdrop-blur-xs',
        sizeStyles[size],
        className,
      )}
      aria-label={`${percentage} percent discount off`}
    >
      <span>-{percentage}%</span>
      <span className="text-[9px] text-temple-gold uppercase tracking-widest font-normal">OFF</span>
    </span>
  );
});

export default DiscountBadge;
