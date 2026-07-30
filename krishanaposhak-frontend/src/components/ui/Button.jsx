import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variantStyles = {
  primary:
    'bg-royal-blue text-white hover:bg-deep-navy focus-visible:ring-royal-blue shadow-soft',
  secondary:
    'bg-temple-gold text-dark-charcoal hover:bg-temple-gold-dark focus-visible:ring-temple-gold shadow-soft',
  outline:
    'border-2 border-royal-blue text-royal-blue hover:bg-royal-blue/5 focus-visible:ring-royal-blue',
  ghost:
    'text-royal-blue hover:bg-royal-blue/5 focus-visible:ring-royal-blue',
  danger:
    'bg-error text-white hover:bg-red-700 focus-visible:ring-error shadow-soft',
  success:
    'bg-success text-white hover:bg-green-700 focus-visible:ring-success shadow-soft',
};

const sizeStyles = {
  xs: 'px-2 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-2.5 text-lg gap-2.5',
  xl: 'px-8 py-3 text-xl gap-3',
};

const Spinner = ({ size }) => (
  <svg
    className={cn(
      'animate-spin',
      size === 'xs' && 'h-3 w-3',
      size === 'sm' && 'h-4 w-4',
      size === 'md' && 'h-5 w-5',
      size === 'lg' && 'h-6 w-6',
      size === 'xl' && 'h-7 w-7',
    )}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    isDisabled = false,
    isFullWidth = false,
    leftIcon,
    rightIcon,
    type = 'button',
    children,
    className,
    as = 'button',
    ...props
  },
  ref,
) {
  const Component = as;
  const disabled = isDisabled || isLoading;

  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-wide rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] select-none shadow-xs hover:shadow-soft';

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      disabled={disabled}
      aria-disabled={disabled}
      aria-busy={isLoading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isFullWidth && 'w-full',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={size} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </Component>
  );
});

export default Button;

