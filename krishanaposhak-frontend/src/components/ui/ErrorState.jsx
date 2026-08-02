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
        'flex flex-col items-center justify-center gap-5 px-5 sm:px-8 text-center rounded-[28px] border py-12 bg-white/85 shadow-[0_18px_48px_rgba(44,40,36,0.08)] backdrop-blur-sm',
        fullPage
          ? 'min-h-[50vh] border-error/10'
          : 'py-10 border-error/15',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-error/10 border border-error/20 text-error shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <FiAlertTriangle className="h-7 w-7" />
      </div>

      <div className="space-y-1.5 max-w-md">
        {code && (
          <span className="text-xs font-bold text-error/70 tracking-wider">{code}</span>
        )}
        <h3 className="font-display text-lg font-semibold text-dark-charcoal sm:text-xl">
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
            className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-royal-blue px-6 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_rgba(27,58,92,0.18)] transition-all hover:bg-deep-navy hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue/50"
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
