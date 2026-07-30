import { cn } from '@/utils/cn';

function TimelineItem({ title, description, time, icon, isActive, isLast }) {
  return (
    <div className="relative flex gap-3 pb-6">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 h-full w-0.5 bg-muted-sand/40" />
      )}

      {/* Icon/ Dot */}
      <div className="relative z-10 flex-shrink-0">
        {icon ? (
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full',
              isActive
                ? 'bg-royal-blue text-white'
                : 'bg-muted-sand/20 text-natural-wood',
            )}
          >
            {icon}
          </div>
        ) : (
          <div
            className={cn(
              'mt-1.5 h-2.5 w-2.5 rounded-full border-2',
              isActive
                ? 'border-royal-blue bg-royal-blue'
                : 'border-muted-sand bg-white',
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-dark-charcoal">{title}</p>
          {time && (
            <span className="text-xs text-natural-wood flex-shrink-0">{time}</span>
          )}
        </div>
        {description && (
          <p className="mt-0.5 text-sm text-natural-wood">{description}</p>
        )}
      </div>
    </div>
  );
}

function Timeline({ items, className }) {
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}

export { TimelineItem };
export default Timeline;

