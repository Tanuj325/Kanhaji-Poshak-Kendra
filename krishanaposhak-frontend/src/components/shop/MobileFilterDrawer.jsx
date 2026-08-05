import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSliders, FiX, FiCheck } from 'react-icons/fi';
import { FilterSidebarContent } from './FilterSidebar';

const MobileFilterDrawer = memo(function MobileFilterDrawer({
  isOpen,
  onClose,
  ...sidebarProps
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sliding Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            aria-label="Refine product catalog filters"
          >
            {/* Sheet Handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="h-1 w-10 rounded-full bg-stone-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 bg-stone-50/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                  <FiSliders className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-stone-950 font-display">Refine Collection</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Body Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
              <FilterSidebarContent {...sidebarProps} />
            </div>

            {/* Footer Sticky Action Buttons */}
            <div className="p-4 border-t border-stone-100 bg-white/95 backdrop-blur-md flex gap-3">
              {sidebarProps.hasActiveFilters && (
                <button
                  type="button"
                  onClick={sidebarProps.onClearAll}
                  className="flex-1 rounded-full border border-stone-300 py-3 text-xs font-bold text-stone-700 hover:bg-stone-50 active-tap-scale min-h-[48px]"
                >
                  Reset All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-[2] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 py-3 text-xs font-bold text-stone-950 shadow-md active-tap-scale min-h-[48px]"
              >
                <FiCheck className="h-4 w-4 text-stone-950 stroke-[3]" />
                <span>Apply & View Items</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default MobileFilterDrawer;
