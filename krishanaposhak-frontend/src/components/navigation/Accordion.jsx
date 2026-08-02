import { useState, useCallback } from 'react';
import { cn } from '@/utils/cn';

function AccordionItem({ title, content, isOpen, onToggle, variant, index }) {
  const contentId = `accordion-content-${index}`;
  const buttonId = `accordion-button-${index}`;

  return (
    <div
      className={cn(
        variant === 'bordered' && 'border-b border-white/10 last:border-b-0',
        variant === 'ghost' && '',
      )}
    >
      <button
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={cn(
          'flex w-full items-center justify-between gap-2 py-3 text-left font-medium text-lotus-white transition-colors hover:text-temple-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-temple-gold/50',
          variant === 'ghost' && 'rounded-2xl px-3 hover:bg-white/5',
        )}
      >
        <span>{title}</span>
        <svg
          className={cn(
            'h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-96 pb-3' : 'max-h-0',
        )}
      >
        <div className="text-sm text-slate-300">{content}</div>
      </div>
    </div>
  );
}

function Accordion({
  items = [],
  allowMultiple = false,
  onChange,
  variant = 'bordered',
  className,
}) {
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleToggle = useCallback(
    (index) => {
      setOpenIndexes((prev) => {
        let newIndexes;
        if (allowMultiple) {
          newIndexes = prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index];
        } else {
          newIndexes = prev.includes(index) ? [] : [index];
        }
        onChange?.(index, newIndexes.includes(index));
        return newIndexes;
      });
    },
    [allowMultiple, onChange],
  );

  return (
    <div className={cn('w-full', variant === 'bordered' && 'divide-y divide-white/10 border-y border-white/10', className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          index={index}
          title={item.title}
          content={item.content}
          isOpen={openIndexes.includes(index) || item.isOpen}
          onToggle={() => handleToggle(index)}
          variant={variant}
        />
      ))}
    </div>
  );
}

export default Accordion;

