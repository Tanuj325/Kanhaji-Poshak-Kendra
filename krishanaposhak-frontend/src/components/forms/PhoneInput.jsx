import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const countryCodes = [
  { code: '+91', label: 'IN', country: 'India' },
  { code: '+1', label: 'US', country: 'United States' },
  { code: '+44', label: 'UK', country: 'United Kingdom' },
  { code: '+61', label: 'AU', country: 'Australia' },
  { code: '+971', label: 'AE', country: 'UAE' },
  { code: '+966', label: 'SA', country: 'Saudi Arabia' },
  { code: '+65', label: 'SG', country: 'Singapore' },
  { code: '+81', label: 'JP', country: 'Japan' },
];

const PhoneInput = forwardRef(function PhoneInput(
  {
    label,
    name,
    value,
    onChange,
    error,
    helperText,
    isDisabled = false,
    isRequired = false,
    countryCode = '+91',
    onCountryCodeChange,
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
      <div className="flex rounded border border-muted-sand overflow-hidden focus-within:border-royal-blue focus-within:ring-1 focus-within:ring-royal-blue/30 transition-colors duration-150">
        <div className="relative flex-shrink-0">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange?.(e.target.value)}
            disabled={isDisabled}
            aria-label="Country code"
            className={cn(
              'h-full appearance-none bg-muted-sand/10 border-r border-muted-sand text-dark-charcoal font-medium focus:outline-none cursor-pointer',
              size === 'sm' && 'px-2 py-1.5 text-xs',
              size === 'md' && 'px-2.5 py-2 text-sm',
              size === 'lg' && 'px-3 py-2.5 text-base',
              isDisabled && 'cursor-not-allowed opacity-60',
            )}
          >
            {countryCodes.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.code} {cc.label}
              </option>
            ))}
          </select>
        </div>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="tel"
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          placeholder="9876543210"
          aria-invalid={!!error}
          aria-label="Phone number"
          className={cn(
            'flex-1 bg-white text-dark-charcoal placeholder:text-natural-wood/60 focus:outline-none',
            size === 'sm' && 'px-2.5 py-1.5 text-sm',
            size === 'md' && 'px-3 py-2 text-base',
            size === 'lg' && 'px-4 py-2.5 text-lg',
            isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
          )}
          {...props}
        />
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

export default PhoneInput;

