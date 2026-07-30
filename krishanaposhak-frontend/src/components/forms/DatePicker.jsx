import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const DatePicker = forwardRef(function DatePicker(
  {
    label,
    name,
    value,
    onChange,
    error,
    helperText,
    isDisabled = false,
    isRequired = false,
    min,
    max,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-dark-charcoal"
        >
          {label}
          {isRequired && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="date"
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          min={min}
          max={max}
          aria-invalid={!!error}
          aria-label={label || 'Date picker'}
          className={cn(
            'w-full rounded border bg-white text-dark-charcoal transition-colors duration-150 focus:outline-none focus:ring-1',
            'border-muted-sand focus:border-royal-blue focus:ring-royal-blue/30',
            error && 'border-error focus:border-error',
            isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
            'pr-10',
            size === 'sm' && 'px-2.5 py-1.5 text-sm',
            size === 'md' && 'px-3 py-2 text-base',
            size === 'lg' && 'px-4 py-2.5 text-lg',
          )}
          {...props}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-natural-wood" aria-hidden="true">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-error" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-natural-wood">{helperText}</p>
      )}
    </div>
  );
});

export default DatePicker;

