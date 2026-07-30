import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';

function Dropdown({
  trigger,
  items = [],
  placement = 'bottom-start',
  isDisabled = false,
  className,
}) {
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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [],
  );

  const placementStyles = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(isDisabled && 'cursor-not-allowed opacity-50')}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          onKeyDown={handleKeyDown}
          className={cn(
            'absolute z-50 min-w-[12rem] overflow-hidden rounded-lg border border-muted-sand/30 bg-white py-1 shadow-elevated animate-scale-in',
            placementStyles[placement],
          )}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.isDivider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="my-1 border-t border-muted-sand/30"
                  role="separator"
                />
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                disabled={item.isDisabled}
                role="menuitem"
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-dark-charcoal transition-colors hover:bg-muted-sand/10',
                  item.isDisabled && 'cursor-not-allowed opacity-40',
                  item.isDanger && 'text-error hover:bg-error/5',
                )}
              >
                {item.icon && (
                  <span className="h-4 w-4 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                )}
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-natural-wood">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

