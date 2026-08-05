import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowDown, FiCheck, FiX } from 'react-icons/fi';
import { cn } from '@/utils/cn';

const MobileSortBottomSheet = memo(function MobileSortBottomSheet({
  isOpen,
  onClose,
  currentSort,
  onSortChange,
  sortOptions = [],
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80vh] flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            aria-label="Sort product catalog"
          >
            {/* Sheet Handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="h-1 w-10 rounded-full bg-stone-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                  <FiArrowDown className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-stone-950 font-display">Sort Collection</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sort menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Options List */}
            <div className="p-4 space-y-2 overflow-y-auto">
              {sortOptions.map((option) => {
                const isSelected = currentSort === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onSortChange({ target: { value: option.value } });
                      onClose();
                    }}
                    className={cn(
                      'w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-semibold transition-all duration-200 min-h-[48px] active-tap-scale',
                      isSelected
                        ? 'bg-amber-500/10 text-amber-950 border border-amber-400/40 font-bold shadow-xs'
                        : 'bg-stone-50 text-stone-700 border border-stone-200/60 hover:bg-stone-100',
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center shrink-0">
                        <FiCheck className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default MobileSortBottomSheet;
