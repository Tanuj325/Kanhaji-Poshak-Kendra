import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export default function EmptyState({
  title = 'No Products Found',
  message = 'We couldn’t find any sacred creations matching your exact criteria.',
  action,
  icon,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden flex flex-col items-center justify-center gap-5 px-5 py-14 sm:px-8 sm:py-16 text-center rounded-[28px] bg-white/85 border border-white/70 shadow-[0_18px_48px_rgba(44,40,36,0.08)] backdrop-blur-sm',
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-temple-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-royal-blue/10 blur-3xl" />

      {icon ? (
        <div className="text-temple-gold">{icon}</div>
      ) : (
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-temple-gold/20 bg-[linear-gradient(180deg,rgba(248,246,243,0.92),rgba(240,234,225,0.88))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <svg
            className="h-10 w-10 text-temple-gold-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
      )}

      <div className="space-y-1.5 max-w-md">
        <h3 className="font-display text-xl font-semibold tracking-tight text-dark-charcoal sm:text-2xl">
          {title}
        </h3>
        {message && (
          <p className="text-sm text-natural-wood/80 leading-relaxed">
            {message}
          </p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
