import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';
import Chip from '@/components/ui/Chip';

const MultiSelect = forwardRef(function MultiSelect(
  {
    label,
    name,
    options = [],
    value = [],
    onChange,
    error,
    helperText,
    placeholder = 'Select options',
    isDisabled = false,
    isRequired = false,
    maxItems,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const canSelectMore = !maxItems || value.length < maxItems;

  const handleToggle = useCallback(
    (optionValue) => {
      const isSelected = value.includes(optionValue);
      if (isSelected) {
        onChange?.(value.filter((v) => v !== optionValue));
      } else if (canSelectMore) {
        onChange?.([...value, optionValue]);
      }
    },
    [value, onChange, canSelectMore],
  );

  const handleRemove = useCallback(
    (optionValue) => {
      onChange?.(value.filter((v) => v !== optionValue));
    },
    [value, onChange],
  );

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-dark-charcoal">
          {label}
          {isRequired && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <div
        className={cn(
          'relative rounded border bg-white cursor-pointer transition-colors duration-150',
          'border-muted-sand focus-within:border-royal-blue focus-within:ring-1 focus-within:ring-royal-blue/30',
          error && 'border-error focus-within:border-error',
          isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
        )}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || 'Multi select'}
      >
        <div className={cn(
          'flex flex-wrap items-center gap-1',
          size === 'sm' && 'px-2 py-1 min-h-[2rem]',
          size === 'md' && 'px-3 py-1.5 min-h-[2.5rem]',
          size === 'lg' && 'px-4 py-2 min-h-[3rem]',
        )}>
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <Chip
                key={opt.value}
                label={opt.label}
                size="sm"
                onRemove={(e) => {
                  e.stopPropagation();
                  handleRemove(opt.value);
                }}
              />
            ))
          ) : (
            <span className="text-natural-wood/60 text-sm">{placeholder}</span>
          )}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-natural-wood">
          <svg className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {isOpen && !isDisabled && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-muted-sand bg-white shadow-elevated"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-natural-wood">No options available</div>
          ) : (
            options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleToggle(option.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors',
                    isSelected ? 'bg-royal-blue/5 text-royal-blue' : 'text-dark-charcoal hover:bg-muted-sand/10',
                    option.isDisabled && 'cursor-not-allowed opacity-40',
                  )}
                >
                  <span className={cn(
                    'flex items-center justify-center h-4 w-4 rounded border transition-colors',
                    isSelected ? 'bg-royal-blue border-royal-blue text-white' : 'border-muted-sand',
                  )}>
                    {isSelected && (
                      <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M10.28 2.22a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 011.06-1.06L4.25 7.19l4.97-4.97a.75.75 0 011.06 0z" />
                      </svg>
                    )}
                  </span>
                  <span>{option.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-error" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-natural-wood">{helperText}</p>
      )}
    </div>
  );
});

export default MultiSelect;

