import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorState({
  title = 'Something Went Wrong',
  message = 'We encountered an error. Please try again.',
  code,
  onRetry,
  action,
  fullPage = false,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-5 px-6 text-center rounded-2xl border py-12',
        fullPage
          ? 'min-h-[50vh] bg-rose-500/[0.03] border-rose-500/10'
          : 'py-10 bg-rose-500/[0.03] border-rose-500/15',
        className,
      )}
    >
      {/* Error icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-inner">
        <FiAlertTriangle className="h-7 w-7" />
      </div>

      <div className="space-y-1.5 max-w-md">
        {code && (
          <span className="text-xs font-bold text-rose-400/60 tracking-wider">{code}</span>
        )}
        <h3 className="font-display text-lg font-bold text-dark-charcoal sm:text-xl">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-natural-wood/70 leading-relaxed">
          {message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-royal-blue px-6 py-2.5 text-xs font-bold text-white shadow-soft transition-all hover:bg-deep-navy hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue/50"
          >
            <FiRefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        )}
        {action}
      </div>
    </motion.div>
  );
}
