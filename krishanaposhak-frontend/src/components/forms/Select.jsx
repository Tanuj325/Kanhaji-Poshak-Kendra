import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const sizeStyles = {
  sm: 'min-h-[44px] px-3 py-2 text-xs font-bold',
  md: 'min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold',
  lg: 'min-h-[48px] px-4 py-3 text-sm font-bold',
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
    <div className={cn('w-full font-display', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-amber-950"
        >
          {label}
          {isRequired && <span className="ml-0.5 text-rose-600" aria-hidden="true">*</span>}
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
            'w-full appearance-none rounded-2xl border bg-amber-50/40 text-amber-950 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer shadow-2xs font-bold',
            'border-amber-900/15 focus:border-amber-800 focus:ring-amber-700/20 focus:bg-white',
            error && 'border-rose-600 focus:border-rose-600 focus:ring-rose-500/20',
            isDisabled && 'cursor-not-allowed bg-stone-100 opacity-60',
            isControlled && !value && 'text-stone-400',
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
                  className="text-amber-950 font-bold bg-white"
                >
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-amber-900" aria-hidden="true">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs font-semibold text-rose-600" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-stone-500">{helperText}</p>
      )}
    </div>
  );
});

export default Select;
