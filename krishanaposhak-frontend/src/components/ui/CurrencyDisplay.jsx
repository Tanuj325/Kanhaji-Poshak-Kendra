import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';

function CurrencyDisplay({
  amount,
  size = 'md',
  bold = false,
  className,
}) {
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  return (
    <span
      className={cn(
        'text-dark-charcoal',
        sizeStyles[size],
        bold && 'font-semibold',
        className,
      )}
    >
      {formatPrice(amount)}
    </span>
  );
}

export default CurrencyDisplay;

