import { memo } from 'react';
import { cn } from '@/utils/cn';

const DashboardCard = memo(function DashboardCard({ icon, label, value, trend, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-1.5 rounded-lg bg-white p-4 shadow-soft border border-muted-sand/20 text-left transition-all duration-150',
        onClick && 'cursor-pointer hover:shadow-card hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue/50',
        className,
      )}
      aria-label={`${label}: ${value}`}
      type="button"
    >
      <div className="flex items-center justify-between">
        <span className="text-natural-wood">{icon}</span>
        {trend && (
          <span className={cn(
            'text-xs font-medium',
            trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-natural-wood'
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <span className="text-2xl font-bold font-display text-dark-charcoal">{value}</span>
      <span className="text-xs text-natural-wood">{label}</span>
    </button>
  );
});

export default DashboardCard;
