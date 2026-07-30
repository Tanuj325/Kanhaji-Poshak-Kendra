import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const RadioGroup = forwardRef(function RadioGroup(
  {
    label,
    name,
    options = [],
    value,
    onChange,
    error,
    direction = 'vertical',
    isDisabled = false,
    size = 'md',
    className,
  },
  ref,
) {
  const generatedId = useId();
  const groupId = name || generatedId;

  return (
    <fieldset className={cn('w-full', className)}>
      {label && (
        <legend className="mb-1.5 text-sm font-medium text-dark-charcoal">
          {label}
        </legend>
      )}
      <div
        className={cn(
          'flex gap-4',
          direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        )}
        role="radiogroup"
        aria-label={label || 'Radio group'}
      >
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <div key={option.value} className="flex items-start gap-2">
              <div className="relative flex items-center pt-0.5">
                <input
                  ref={ref}
                  id={optionId}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={isSelected}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={isDisabled || option.isDisabled}
                  className="sr-only"
                />
                <label
                  htmlFor={optionId}
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 transition-colors duration-150 cursor-pointer',
                    sizeStyles[size],
                    isSelected
                      ? 'border-royal-blue'
                      : 'border-muted-sand hover:border-royal-blue/50',
                    (isDisabled || option.isDisabled) && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {isSelected && (
                    <span className="h-2/5 w-2/5 rounded-full bg-royal-blue" />
                  )}
                </label>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor={optionId}
                  className={cn(
                    'text-sm text-dark-charcoal cursor-pointer select-none',
                    (isDisabled || option.isDisabled) && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <span className="text-xs text-natural-wood">{option.description}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error" role="alert">{error}</p>
      )}
    </fieldset>
  );
});

export default RadioGroup;

