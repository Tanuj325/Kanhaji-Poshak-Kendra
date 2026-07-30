import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const sizeStyles = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-2.5 text-lg',
};

const Select = forwardRef(function Select(
  {
    label,
    name,
    options = [],
    placeholder = 'Select option',
    value,
    onChange,
    error,
    helperText,
    isDisabled = false,
    isRequired = false,
    size = 'md',
    className,
    children,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const isControlled = value !== undefined;

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
        <select
          ref={ref}
          id={inputId}
          name={name}
          {...(isControlled ? { value } : {})}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            'w-full appearance-none rounded-xl border bg-white text-dark-charcoal text-xs transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer shadow-xs',
            'border-muted-sand/40 focus:border-royal-blue focus:ring-royal-blue/20',
            error && 'border-error focus:border-error focus:ring-error/20',
            isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
            isControlled && !value && 'text-natural-wood/60',
            'pr-10',
            sizeStyles[size],
          )}
          {...props}
        >
          {children ?? (
            <>
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.isDisabled}
                  className="text-dark-charcoal"
                >
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-natural-wood" aria-hidden="true">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-error" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-natural-wood">{helperText}</p>
      )}
    </div>
  );
});

export default Select;

