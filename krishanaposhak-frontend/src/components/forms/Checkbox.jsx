import { forwardRef, useId, useState } from 'react';
import { cn } from '@/utils/cn';

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const iconSizes = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
};

const Checkbox = forwardRef(function Checkbox(
  {
    label,
    name,
    checked,
    defaultChecked = false,
    onChange,
    error,
    isDisabled = false,
    isIndeterminate = false,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = props.id || name || generatedId;
  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : uncontrolledChecked;

  const handleChange = (event) => {
    if (!isControlled) {
      setUncontrolledChecked(event.target.checked);
    }
    onChange?.(event);
  };

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <div className="relative flex items-center pt-0.5">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          {...(isControlled ? { checked } : { defaultChecked })}
          onChange={handleChange}
          disabled={isDisabled}
          aria-checked={isIndeterminate ? 'mixed' : isChecked}
          aria-invalid={!!error}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-center justify-center rounded border-2 transition-colors duration-150 cursor-pointer',
            sizeStyles[size],
            isChecked || isIndeterminate
              ? 'bg-royal-blue border-royal-blue text-white'
              : 'bg-white border-muted-sand hover:border-royal-blue/50',
            isDisabled && 'cursor-not-allowed opacity-50',
            error && !isChecked && 'border-error',
          )}
        >
          {isIndeterminate ? (
            <svg className={cn('text-white', iconSizes[size])} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="2" y="5" width="8" height="2" rx="1" />
            </svg>
          ) : isChecked ? (
            <svg className={cn('text-white', iconSizes[size])} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M10.28 2.22a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06L4.25 7.19l4.97-4.97a.75.75 0 011.06 0z" />
            </svg>
          ) : null}
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
      {error && (
        <p className="text-sm text-error" role="alert">{error}</p>
      )}
    </div>
  );
});

export default Checkbox;
