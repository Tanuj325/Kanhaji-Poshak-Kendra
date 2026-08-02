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
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_top,rgba(201,154,59,0.18),transparent_28%),linear-gradient(180deg,#0f2440_0%,#081427_100%)]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="h-14 w-14 rounded-[20px] bg-[linear-gradient(135deg,rgba(232,213,163,0.96),rgba(201,154,59,0.92),rgba(168,125,46,0.98))] p-[2px] shadow-[0_16px_40px_rgba(201,154,59,0.24)]">
            <div className="flex h-full w-full items-center justify-center rounded-[18px] bg-deep-navy">
              <span className="font-display text-xl font-bold text-temple-gold-light">K</span>
            </div>
          </div>
          <motion.div
            className="absolute -inset-3 rounded-[22px] bg-temple-gold/10 blur-xl"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className="relative">
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-temple-gold/20 border-t-temple-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {label && (
          <p className="text-xs font-medium text-lotus-white/70">{label}</p>
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
          'animate-spin rounded-full border-temple-gold/20 border-t-temple-gold',
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
