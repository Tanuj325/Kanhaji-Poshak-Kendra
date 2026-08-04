import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';

export default function EmptyState({
  title = 'No Devotional Creations Found',
  message = 'We couldn’t find any sacred creations matching your exact search or filter selection.',
  action,
  icon,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden flex flex-col items-center justify-center gap-4 sm:gap-5 px-4 py-10 sm:px-8 sm:py-20 text-center rounded-[24px] sm:rounded-[32px] bg-white/95 border border-amber-900/10 shadow-elevated backdrop-blur-md font-display',
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-temple-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-royal-blue/15 blur-3xl" />

      {icon ? (
        <div className="text-amber-900">{icon}</div>
      ) : (
        <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl border border-amber-900/20 bg-amber-50/80 shadow-gold">
          <FiPackage className="h-8 w-8 sm:h-10 sm:w-10 text-amber-900" />
        </div>
      )}

      <div className="space-y-1.5 sm:space-y-2 max-w-md">
        <h3 className="font-heading text-lg font-bold text-amber-950 sm:text-2xl">
          {title}
        </h3>
        {message && (
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-body">
            {message}
          </p>
        )}
      </div>

      {action && <div className="mt-2 w-full sm:w-auto flex justify-center">{action}</div>}
    </motion.div>
  );
}
