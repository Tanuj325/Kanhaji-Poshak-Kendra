import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const sizeStyles = {
  xs: 'h-4 w-7',
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
  lg: 'h-7 w-14',
};

const dotSizes = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const dotTranslate = {
  xs: 'translate-x-3',
  sm: 'translate-x-4',
  md: 'translate-x-5',
  lg: 'translate-x-7',
};

const Switch = forwardRef(function Switch(
  {
    label,
    name,
    checked = false,
    onChange,
    isDisabled = false,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          aria-checked={checked}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200',
            sizeStyles[size],
            checked ? 'bg-royal-blue' : 'bg-muted-sand/50',
            isDisabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span
            className={cn(
              'rounded-full bg-white shadow-sm transition-transform duration-200',
              dotSizes[size],
              checked && dotTranslate[size],
            )}
          />
        </label>
      </div>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm text-dark-charcoal cursor-pointer select-none',
            isDisabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
});

export default Switch;

