import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorState({
  title = 'Catalog Connection Error',
  message = 'We encountered a server error while connecting to our catalog services.',
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
        'flex flex-col items-center justify-center gap-5 px-5 sm:px-8 text-center rounded-[32px] border py-12 bg-white/95 border-rose-200/80 shadow-elevated backdrop-blur-md font-display',
        fullPage ? 'min-h-[45vh]' : 'py-10',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 shadow-md">
        <FiAlertTriangle className="h-7 w-7" />
      </div>

      <div className="space-y-1.5 max-w-md">
        {code && (
          <span className="text-xs font-bold text-rose-600/80 uppercase tracking-wider">{code}</span>
        )}
        <h3 className="font-heading text-lg font-bold text-amber-950 sm:text-xl">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-body">
          {message}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f2440,#1b3a5c_55%,#0d4f5e)] px-6 py-2.5 text-xs font-bold text-white shadow-gold transition-all hover:opacity-95 active:scale-95 focus:outline-none"
          >
            <FiRefreshCw className="h-4 w-4 text-amber-300" />
            <span>Retry Connection</span>
          </button>
        )}
        {action}
      </div>
    </motion.div>
  );
}
