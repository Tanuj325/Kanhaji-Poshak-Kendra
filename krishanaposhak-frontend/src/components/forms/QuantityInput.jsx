import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const QuantityInput = forwardRef(function QuantityInput(
  {
    label,
    name,
    value = 1,
    onChange,
    error,
    isDisabled = false,
    isRequired = false,
    min = 1,
    max = 99,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = name || generatedId;

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = parseInt(raw, 10);
    if (raw === '' || raw === '0') {
      onChange?.({ ...e, target: { ...e.target, value: '', name: e.target.name } });
    } else if (!isNaN(num) && num >= min && num <= max) {
      onChange?.({ ...e, target: { ...e.target, value: String(num), name: e.target.name } });
    }
  };

  const increment = () => {
    const num = parseInt(value, 10) || 0;
    if (num < max) {
      const newValue = String(num + 1);
      onChange?.({ target: { value: newValue, name } });
    }
  };

  const decrement = () => {
    const num = parseInt(value, 10) || 0;
    if (num > min) {
      const newValue = String(num - 1);
      onChange?.({ target: { value: newValue, name } });
    }
  };

  const numVal = parseInt(value, 10) || 0;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-dark-charcoal">
          {label}
          {isRequired && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={cn(
        'inline-flex items-center rounded border border-muted-sand overflow-hidden',
        isDisabled && 'opacity-60 pointer-events-none',
        error && 'border-error',
      )}>
        <button
          type="button"
          onClick={decrement}
          disabled={numVal <= min || isDisabled}
          aria-label="Decrease"
          className={cn(
            'flex items-center justify-center text-natural-wood hover:text-dark-charcoal hover:bg-muted-sand/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
            size === 'sm' && 'h-7 w-7',
            size === 'md' && 'h-9 w-9',
            size === 'lg' && 'h-11 w-11',
          )}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          disabled={isDisabled}
          required={isRequired}
          min={min}
          max={max}
          aria-invalid={!!error}
          className={cn(
            'w-10 text-center border-x border-muted-sand bg-white text-dark-charcoal font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            size === 'sm' && 'h-7 text-sm',
            size === 'md' && 'h-9 text-base',
            size === 'lg' && 'h-11 text-lg',
            isDisabled && 'bg-muted-sand/10',
          )}
          {...props}
        />
        <button
          type="button"
          onClick={increment}
          disabled={numVal >= max || isDisabled}
          aria-label="Increase"
          className={cn(
            'flex items-center justify-center text-natural-wood hover:text-dark-charcoal hover:bg-muted-sand/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
            size === 'sm' && 'h-7 w-7',
            size === 'md' && 'h-9 w-9',
            size === 'lg' && 'h-11 w-11',
          )}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-error" role="alert">{error}</p>
      )}
    </div>
  );
});

export default QuantityInput;

