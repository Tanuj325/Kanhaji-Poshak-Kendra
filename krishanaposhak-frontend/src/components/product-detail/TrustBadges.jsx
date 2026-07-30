import { memo } from 'react';
import { FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';

const TrustBadges = memo(function TrustBadges() {
  const badges = [
    {
      id: 'shipping',
      icon: FiTruck,
      title: 'Express Shipping',
      subtitle: '3-5 Days Nationwide',
      iconColor: 'text-amber-800',
    },
    {
      id: 'exchange',
      icon: FiRefreshCw,
      title: 'Easy Exchange',
      subtitle: '7-Day Hassle Free',
      iconColor: 'text-amber-800',
    },
    {
      id: 'handcrafted',
      icon: FiShield,
      title: '100% Handcrafted',
      subtitle: 'Pure Meerut Artistry',
      iconColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 xl:gap-4 pt-5 border-t border-amber-900/10">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className="flex flex-row sm:flex-col items-center sm:justify-center p-3.5 sm:p-3 xl:p-4 rounded-2xl bg-gradient-to-b from-amber-50/60 to-stone-50/80 border border-amber-900/10 gap-3 sm:gap-1.5 xl:gap-2 text-left sm:text-center transition-all hover:border-amber-700/20 shadow-[0_2px_8px_rgba(44,40,36,0.02)]"
          >
            <div className="flex h-9 w-9 xl:h-10 xl:w-10 items-center justify-center rounded-xl bg-amber-100/60 shrink-0">
              <Icon className={`h-4.5 w-4.5 xl:h-5 xl:w-5 ${badge.iconColor}`} />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs sm:text-xs xl:text-sm font-bold text-amber-950 block leading-tight font-display">
                {badge.title}
              </span>
              <span className="text-[11px] xl:text-xs text-stone-500 font-medium block">
                {badge.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default TrustBadges;
