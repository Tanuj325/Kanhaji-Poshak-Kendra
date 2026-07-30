import { cn } from '@/utils/cn';

const variantStyles = {
  default:
    'bg-muted-sand/20 text-dark-charcoal',
  primary:
    'bg-royal-blue/10 text-royal-blue',
  success:
    'bg-success/10 text-success',
  warning:
    'bg-warning/10 text-warning',
  danger:
    'bg-error/10 text-error',
  gold:
    'bg-temple-gold/10 text-temple-gold-dark',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-2.5 py-1.5 text-base',
};

function Tag({
  children,
  variant = 'default',
  size = 'sm',
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Tag;

