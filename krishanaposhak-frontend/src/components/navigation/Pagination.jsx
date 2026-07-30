import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
  isDisabled = false,
  className,
}) {
  const range = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1,
      );
      return [1, '...', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [1, '...', ...middleRange, '...', totalPages];
  }, [currentPage, totalPages, siblingCount]);

  const sizeStyles = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 sm:h-10 w-9 sm:w-10 text-xs sm:text-sm font-bold',
    lg: 'h-11 w-11 text-base font-bold',
  };

  const buttonBase = cn(
    'inline-flex items-center justify-center rounded-2xl transition-all duration-300 font-display',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue/50 active:scale-95 border',
  );

  const handlePageChange = (page) => {
    if (!isDisabled && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-muted-sand/30 shadow-xs', className)}>
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || isDisabled}
          aria-label="First page"
          className={cn(
            buttonBase,
            sizeStyles[size],
            'border-transparent text-natural-wood hover:text-royal-blue hover:bg-royal-blue/10 disabled:opacity-30 disabled:cursor-not-allowed',
          )}
        >
          <FiChevronsLeft className="h-4 w-4" />
        </button>
      )}
      {showPrevNext && (
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isDisabled}
          aria-label="Previous page"
          className={cn(
            buttonBase,
            sizeStyles[size],
            'border-transparent text-natural-wood hover:text-royal-blue hover:bg-royal-blue/10 disabled:opacity-30 disabled:cursor-not-allowed',
          )}
        >
          <FiChevronLeft className="h-4 w-4" />
        </button>
      )}

      {range.map((item, index) => {
        if (item === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className={cn(
                'inline-flex items-center justify-center text-natural-wood/50 font-bold',
                sizeStyles[size],
              )}
            >
              ...
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <button
            key={item}
            type="button"
            onClick={() => handlePageChange(item)}
            disabled={isDisabled}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              buttonBase,
              sizeStyles[size],
              isActive
                ? 'bg-gradient-to-r from-royal-blue to-deep-navy text-white border-royal-blue shadow-soft shadow-royal-blue/30 scale-105'
                : 'bg-transparent border-transparent text-dark-charcoal hover:border-royal-blue/30 hover:bg-royal-blue/5',
            )}
          >
            {item}
          </button>
        );
      })}

      {showPrevNext && (
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isDisabled}
          aria-label="Next page"
          className={cn(
            buttonBase,
            sizeStyles[size],
            'border-transparent text-natural-wood hover:text-royal-blue hover:bg-royal-blue/10 disabled:opacity-30 disabled:cursor-not-allowed',
          )}
        >
          <FiChevronRight className="h-4 w-4" />
        </button>
      )}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || isDisabled}
          aria-label="Last page"
          className={cn(
            buttonBase,
            sizeStyles[size],
            'border-transparent text-natural-wood hover:text-royal-blue hover:bg-royal-blue/10 disabled:opacity-30 disabled:cursor-not-allowed',
          )}
        >
          <FiChevronsRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}

export default Pagination;
