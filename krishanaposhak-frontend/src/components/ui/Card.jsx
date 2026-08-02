import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variantStyles = {
  default: 'bg-white/85 border border-white/60 shadow-[0_12px_30px_rgba(44,40,36,0.08)] backdrop-blur-sm',
  elevated: 'bg-white shadow-[0_18px_40px_rgba(44,40,36,0.12)]',
  bordered: 'bg-white border border-muted-sand/50',
  flat: 'bg-warm-cream/60 border border-transparent',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

const Card = forwardRef(function Card(
  {
    variant = 'default',
    padding = 'md',
    isHoverable = false,
    onClick,
    children,
    className,
    ...props
  },
  ref,
) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={cn(
        'rounded-[24px] transition-all duration-300 text-left w-full overflow-hidden',
        variantStyles[variant],
        paddingStyles[padding],
        isHoverable && 'hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(44,40,36,0.12)] cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
      {...(onClick ? { type: 'button' } : {})}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Card;

