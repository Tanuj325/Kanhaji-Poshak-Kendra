import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const PriceInput = forwardRef(function PriceInput(
  {
    label,
    name,
    value,
    onChange,
    error,
    helperText,
    isDisabled = false,
    isRequired = false,
    size = 'md',
    currency = '₹',
    min,
    max,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    const sanitized = parts.length > 2 ? `${parts[0]}.${parts[1]}` : raw;
    onChange?.({ ...e, target: { ...e.target, value: sanitized, name: e.target.name } });
  };

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
      <div className={cn(
        'flex rounded border bg-white overflow-hidden transition-colors duration-150 focus-within:ring-1',
        'border-muted-sand focus-within:border-royal-blue focus-within:ring-royal-blue/30',
        error && 'border-error focus-within:border-error focus-within:ring-error/30',
        isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
      )}>
        <span className={cn(
          'flex items-center border-r border-muted-sand bg-muted-sand/10 text-natural-wood font-medium',
          size === 'sm' && 'px-2.5 py-1.5 text-sm',
          size === 'md' && 'px-3 py-2 text-base',
          size === 'lg' && 'px-4 py-2.5 text-lg',
        )}>
          {currency}
        </span>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          disabled={isDisabled}
          required={isRequired}
          min={min}
          max={max}
          placeholder="0.00"
          aria-invalid={!!error}
          aria-label={label || 'Price'}
          className={cn(
            'flex-1 bg-transparent text-dark-charcoal placeholder:text-natural-wood/60 focus:outline-none',
            size === 'sm' && 'px-2.5 py-1.5 text-sm',
            size === 'md' && 'px-3 py-2 text-base',
            size === 'lg' && 'px-4 py-2.5 text-lg',
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

export default PriceInput;

