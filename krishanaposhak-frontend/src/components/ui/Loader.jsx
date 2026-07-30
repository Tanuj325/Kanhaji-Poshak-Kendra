import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export default function Loader({ size = 'md', isFullPage = false, label }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
    xl: 'h-16 w-16 border-4',
  };

  if (isFullPage) {
    return (
      <div
        role="status"
        aria-label={label || 'Loading'}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#060E1A]"
      >
        {/* Animated logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-[2px] shadow-xl shadow-amber-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#0B1728]">
              <span className="font-serif text-xl font-bold text-amber-300">K</span>
            </div>
          </div>
          <motion.div
            className="absolute -inset-3 rounded-2xl bg-amber-400/10 blur-xl"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Spinner */}
        <div className="relative">
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-amber-400/20 border-t-amber-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {label && (
          <p className="text-xs font-medium text-slate-400">{label}</p>
        )}
        <span className="sr-only">{label || 'Loading...'}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={label || 'Loading'}
      className={cn('flex flex-col items-center justify-center gap-2')}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-amber-400/20 border-t-amber-400',
          sizeClasses[size],
        )}
      />
      {label && (
        <p className="text-sm text-natural-wood">{label}</p>
      )}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
}
