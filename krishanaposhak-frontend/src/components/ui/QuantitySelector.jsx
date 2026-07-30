import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

function QuantitySelector({
  value = 1,
  min = 1,
  max = 999,
  onChange,
  size = 'md',
  disabled = false,
  isDisabled = false,
  className,
}) {
  const isComponentDisabled = disabled || isDisabled;
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleDecrement = () => {
    if (value > min && !isComponentDisabled) {
      const nextVal = value - 1;
      setInputValue(String(nextVal));
      onChange?.(nextVal);
    }
  };

  const handleIncrement = () => {
    if (value < max && !isComponentDisabled) {
      const nextVal = value + 1;
      setInputValue(String(nextVal));
      onChange?.(nextVal);
    }
  };

  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);

    if (rawVal === '') return;

    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed >= min) {
      const clamped = Math.min(parsed, max);
      onChange?.(clamped);
    }
  };

  const handleBlur = () => {
    let parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < min) {
      parsed = min;
    } else if (parsed > max) {
      parsed = max;
    }
    setInputValue(String(parsed));
    onChange?.(parsed);
  };

  const sizeContainer = {
    sm: 'h-8 text-xs',
    md: 'h-9 sm:h-10 text-sm',
    lg: 'h-11 sm:h-12 text-base font-bold',
  };

  const buttonWidth = {
    sm: 'w-7 sm:w-8',
    md: 'w-8 sm:w-9',
    lg: 'w-10 sm:w-11',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-amber-900/15 bg-stone-50/60 shadow-2xs overflow-hidden font-display transition-all duration-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20',
        sizeContainer[size],
        isComponentDisabled && 'opacity-50 pointer-events-none bg-stone-100',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min || isComponentDisabled}
        aria-label="Decrease quantity"
        className={cn(
          'flex items-center justify-center h-full border-r border-amber-900/10 text-stone-800 font-bold hover:bg-amber-100/60 hover:text-amber-900 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed min-h-[32px]',
          buttonWidth[size],
        )}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        disabled={isComponentDisabled}
        aria-label="Quantity selector input"
        className={cn(
          'w-10 sm:w-12 px-1 text-center border-none bg-transparent text-stone-900 font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-mono',
          sizeContainer[size],
        )}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max || isComponentDisabled}
        aria-label="Increase quantity"
        className={cn(
          'flex items-center justify-center h-full border-l border-amber-900/10 text-stone-800 font-bold hover:bg-amber-100/60 hover:text-amber-900 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed min-h-[32px]',
          buttonWidth[size],
        )}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

export default QuantitySelector;
