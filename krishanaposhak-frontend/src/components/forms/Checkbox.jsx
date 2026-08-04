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
    <div className={cn('flex items-center gap-2.5 min-h-[44px]', className)}>
      <div className="relative flex items-center justify-center">
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
            'flex items-center justify-center rounded-lg border-2 transition-all duration-200 cursor-pointer shadow-2xs',
            sizeStyles[size],
            isChecked || isIndeterminate
              ? 'bg-[linear-gradient(135deg,#0f2440,#1b3a5c)] border-amber-900 text-white shadow-gold scale-105'
              : 'bg-white border-amber-900/20 hover:border-amber-800/60 hover:bg-amber-50/50',
            isDisabled && 'cursor-not-allowed opacity-50',
            error && !isChecked && 'border-rose-600',
          )}
        >
          {isIndeterminate ? (
            <svg className={cn('text-amber-300', iconSizes[size])} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="2" y="5" width="8" height="2" rx="1" />
            </svg>
          ) : isChecked ? (
            <svg className={cn('text-amber-300', iconSizes[size])} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M10.28 2.22a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06L4.25 7.19l4.97-4.97a.75.75 0 011.06 0z" />
            </svg>
          ) : null}
        </label>
      </div>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-xs font-semibold text-amber-950 cursor-pointer select-none font-display flex-1',
            isDisabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {label}
        </label>
      )}
      {error && (
        <p className="text-xs font-semibold text-rose-600" role="alert">{error}</p>
      )}
    </div>
  );
});

export default Checkbox;
