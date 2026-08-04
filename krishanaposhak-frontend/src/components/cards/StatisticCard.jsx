import { memo } from 'react';
import { cn } from '@/utils/cn';

const StatisticCard = memo(function StatisticCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  isLoading = false,
  className,
}) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  if (isLoading) {
    return (
      <div className={cn('p-5 rounded-3xl bg-white border border-amber-900/10 shadow-xs animate-pulse space-y-3 font-display', className)}>
        <div className="h-4 w-24 rounded-lg bg-stone-200" />
        <div className="h-8 w-20 rounded-lg bg-stone-200" />
        <div className="h-3 w-16 rounded-lg bg-stone-200" />
      </div>
    );
  }

  return (
    <div className={cn('p-5 sm:p-6 rounded-3xl bg-white border border-amber-900/10 shadow-[0_4px_20px_rgba(44,40,36,0.03)] font-display transition-all duration-200 hover:border-amber-700/30 hover:shadow-[0_8px_30px_rgba(44,40,36,0.06)]', className)}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-bold text-stone-500 font-body uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-950 font-mono leading-none pt-0.5">{value}</p>
          {change !== undefined && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={cn(
                'inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded-md',
                isPositive && 'bg-emerald-50 text-emerald-700',
                isNegative && 'bg-rose-50 text-rose-700',
                change === 0 && 'bg-stone-100 text-stone-600',
              )}>
                {isPositive && '+'}
                {change}
                {changeLabel ? ` ${changeLabel}` : ''}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100/80 text-amber-900 shadow-2xs">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
});

export default StatisticCard;
