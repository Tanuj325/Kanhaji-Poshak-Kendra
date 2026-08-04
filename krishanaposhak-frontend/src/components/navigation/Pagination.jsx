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

  const buttonBase = cn(
    'inline-flex items-center justify-center rounded-2xl transition-all duration-300 font-display min-h-[44px] min-w-[44px] text-xs sm:text-sm font-bold',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/50 active:scale-95 border',
  );

  const handlePageChange = (page) => {
    if (!isDisabled && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Shop catalog pagination"
      className={cn('flex flex-wrap items-center justify-center gap-1.5 p-2 bg-white/95 backdrop-blur-md rounded-3xl border border-amber-900/10 shadow-soft', className)}
    >
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || isDisabled}
          aria-label="First page"
          className={cn(
            buttonBase,
            'border-amber-900/10 text-stone-700 hover:text-amber-950 hover:bg-amber-100/60 disabled:opacity-30 disabled:cursor-not-allowed',
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
            'border-amber-900/10 text-stone-700 hover:text-amber-950 hover:bg-amber-100/60 disabled:opacity-30 disabled:cursor-not-allowed',
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
              className="inline-flex items-center justify-center h-11 w-8 text-stone-400 font-bold"
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
              isActive
                ? 'bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] text-white border-amber-900/20 shadow-gold scale-105'
                : 'bg-transparent border-transparent text-amber-950 hover:border-amber-900/20 hover:bg-amber-50/80',
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
            'border-amber-900/10 text-stone-700 hover:text-amber-950 hover:bg-amber-100/60 disabled:opacity-30 disabled:cursor-not-allowed',
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
            'border-amber-900/10 text-stone-700 hover:text-amber-950 hover:bg-amber-100/60 disabled:opacity-30 disabled:cursor-not-allowed',
          )}
        >
          <FiChevronsRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}

export default Pagination;
