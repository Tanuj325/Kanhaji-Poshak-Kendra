import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variantStyles = {
  default: 'bg-white border border-muted-sand/30',
  elevated: 'bg-white shadow-card hover:shadow-elevated',
  bordered: 'bg-white border-2 border-muted-sand',
  flat: 'bg-muted-sand/10',
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
        'rounded-2xl transition-all duration-300 text-left w-full shadow-xs',
        variantStyles[variant],
        paddingStyles[padding],
        isHoverable && 'hover:-translate-y-1 hover:shadow-soft cursor-pointer',
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

