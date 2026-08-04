import { memo } from 'react';
import { cn } from '@/utils/cn';

const DashboardCard = memo(function DashboardCard({ icon, label, value, trend, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_4px_20px_rgba(44,40,36,0.03)] border border-amber-900/10 text-left transition-all duration-200 font-display min-h-[110px] focus:outline-none focus:ring-2 focus:ring-amber-500/30',
        onClick && 'cursor-pointer hover:border-amber-700/30 hover:shadow-[0_8px_30px_rgba(44,40,36,0.06)] hover:-translate-y-1 active:scale-[0.98]',
        className,
      )}
      aria-label={`${label}: ${value}`}
      type="button"
    >
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-2xl bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0">
          {icon}
        </div>
        {trend !== undefined && (
          <span className={cn(
            'text-xs font-bold font-mono px-2 py-0.5 rounded-md',
            trend > 0 ? 'bg-emerald-50 text-emerald-700' : trend < 0 ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-600'
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      
      <div className="space-y-0.5 pt-2">
        <span className="text-2xl font-extrabold font-heading text-amber-950 block leading-none">{value}</span>
        <span className="text-xs font-medium text-stone-600 font-body block">{label}</span>
      </div>
    </button>
  );
});

export default DashboardCard;
