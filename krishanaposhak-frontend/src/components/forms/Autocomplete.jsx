import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';

const Autocomplete = forwardRef(function Autocomplete(
  {
    label,
    name,
    options = [],
    value,
    onChange,
    onInputChange,
    error,
    helperText,
    placeholder = 'Type to search...',
    isDisabled = false,
    isRequired = false,
    isLoading = false,
    size = 'md',
    className,
    ...props
  },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = value
    ? options.find((o) => o.value === value)?.label || ''
    : '';

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      setInputValue(val);
      setIsOpen(true);
      setHighlightedIndex(-1);
      if (value) onChange?.('');
      onInputChange?.(val);
    },
    [value, onChange, onInputChange],
  );

  const handleSelect = useCallback(
    (option) => {
      setInputValue(option.label);
      onChange?.(option.value);
      setIsOpen(false);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown') {
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1,
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, highlightedIndex, filteredOptions, handleSelect],
  );

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className={cn('w-full relative', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-dark-charcoal">
          {label}
          {isRequired && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type="text"
        value={inputValue || selectedLabel}
        onChange={handleInputChange}
        onFocus={() => inputValue && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        required={isRequired}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls={`${name}-listbox`}
        aria-activedescendant={highlightedIndex >= 0 ? `${name}-option-${highlightedIndex}` : undefined}
        className={cn(
          'w-full rounded border bg-white text-dark-charcoal placeholder:text-natural-wood/60 transition-colors duration-150 focus:outline-none focus:ring-1',
          'border-muted-sand focus:border-royal-blue focus:ring-royal-blue/30',
          error && 'border-error focus:border-error',
          isDisabled && 'cursor-not-allowed bg-muted-sand/10 opacity-60',
          size === 'sm' && 'px-2.5 py-1.5 text-sm',
          size === 'md' && 'px-3 py-2 text-base',
          size === 'lg' && 'px-4 py-2.5 text-lg',
        )}
        {...props}
      />

      {isOpen && !isDisabled && (
        <div
          ref={listRef}
          id={`${name}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-muted-sand bg-white shadow-elevated"
        >
          {isLoading ? (
            <div className="flex items-center justify-center px-3 py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-sand border-t-royal-blue" />
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-natural-wood">No results found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                id={`${name}-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  'px-3 py-2 text-sm cursor-pointer transition-colors',
                  index === highlightedIndex
                    ? 'bg-royal-blue/10 text-royal-blue'
                    : 'text-dark-charcoal hover:bg-muted-sand/10',
                )}
              >
                {option.label}
              </div>
            ))
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

export default Autocomplete;

