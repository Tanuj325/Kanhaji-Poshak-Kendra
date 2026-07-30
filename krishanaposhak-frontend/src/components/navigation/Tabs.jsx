import { cn } from '@/utils/cn';

const variantStyles = {
  underline: {
    container: 'border-b border-muted-sand/30',
    tab: 'border-b-2 border-transparent pb-2 text-natural-wood hover:text-dark-charcoal hover:border-muted-sand',
    active: 'border-royal-blue text-royal-blue',
  },
  pill: {
    container: '',
    tab: 'rounded px-3 py-1.5 text-natural-wood hover:text-dark-charcoal hover:bg-muted-sand/20',
    active: 'bg-royal-blue text-white hover:bg-royal-blue',
  },
  box: {
    container: 'rounded-lg border border-muted-sand/30 p-1',
    tab: 'rounded px-3 py-1.5 text-natural-wood hover:text-dark-charcoal',
    active: 'bg-white text-royal-blue shadow-soft',
  },
};

const sizeStyles = {
  sm: 'text-xs gap-1',
  md: 'text-sm gap-2',
  lg: 'text-base gap-3',
};

function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  className,
}) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        'flex items-center',
        variantStyles[variant].container,
        sizeStyles[size],
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.isDisabled}
            onClick={() => !tab.isDisabled && onChange?.(tab.id)}
            className={cn(
              'inline-flex items-center gap-1.5 transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue/50',
              variantStyles[variant].tab,
              isActive && variantStyles[variant].active,
              tab.isDisabled && 'cursor-not-allowed opacity-40',
            )}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span className="ml-0.5 inline-flex items-center justify-center rounded-full bg-royal-blue/10 px-1.5 py-0.5 text-xs font-medium text-royal-blue">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;

