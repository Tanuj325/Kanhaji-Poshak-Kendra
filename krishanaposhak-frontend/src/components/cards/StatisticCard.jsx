import { memo } from 'react';
import { cn } from '@/utils/cn';
import Card from '@/components/ui/Card';

const StatisticCard = memo(function StatisticCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  isLoading = false,
  className,
}) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  if (isLoading) {
    return (
      <Card variant="default" padding="md" className={className}>
        <div className="animate-shimmer space-y-2 bg-gradient-to-r from-muted-sand/20 via-muted-sand/40 to-muted-sand/20 bg-[length:200%_100%]">
          <div className="h-4 w-24 rounded bg-muted-sand/20" />
          <div className="h-8 w-16 rounded bg-muted-sand/20" />
          <div className="h-3 w-20 rounded bg-muted-sand/20" />
        </div>
      </Card>
    );
  }

  return (
    <Card variant={variant === 'elevated' ? 'elevated' : 'default'} padding="md" className={cn('', className)}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-natural-wood">{title}</p>
          <p className="mt-1 text-2xl font-bold text-dark-charcoal">{value}</p>
          {change !== undefined && (
            <div className="mt-1 flex items-center gap-1">
              <span className={cn(
                'inline-flex items-center text-xs font-medium',
                isPositive && 'text-success',
                isNegative && 'text-error',
                change === 0 && 'text-natural-wood',
              )}>
                {isPositive && '+'}
                {change}
                {changeLabel ? ` ${changeLabel}` : ''}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
});

export default StatisticCard;
