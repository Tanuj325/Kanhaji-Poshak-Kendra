import { cn } from '@/utils/cn';

const variantStyles = {
  default: 'bg-muted-sand/20 text-dark-charcoal',
  primary: 'bg-royal-blue/10 text-royal-blue border border-royal-blue/20',
  secondary: 'bg-temple-gold/15 text-dark-charcoal border border-temple-gold/30',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-2.5 py-1 text-base',
};

function Badge({
  variant = 'default',
  size = 'md',
  children,
  isDot = false,
  className,
}) {
  if (isDot) {
    const dotColors = {
      default: 'bg-natural-wood',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-error',
      info: 'bg-info',
      purple: 'bg-purple-600',
    };

    return (
      <span
        className={cn('relative inline-flex flex-shrink-0', className)}
        role="status"
        aria-label={typeof children === 'string' ? children : 'Badge'}
      >
        <span
          className={cn(
            'inline-block h-2 w-2 rounded-full',
            dotColors[variant],
          )}
        />
        <span className="sr-only">{children}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;

