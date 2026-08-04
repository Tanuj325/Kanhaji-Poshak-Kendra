import { memo } from 'react';
import { FiTruck, FiRefreshCw, FiShield, FiAward } from 'react-icons/fi';

const TrustBadges = memo(function TrustBadges() {
  const badges = [
    {
      id: 'shipping',
      icon: FiTruck,
      title: 'Express Shipping',
      subtitle: '3-5 Days Nationwide',
      iconBg: 'bg-amber-100/70',
      iconColor: 'text-amber-800',
    },
    {
      id: 'exchange',
      icon: FiRefreshCw,
      title: 'Easy Exchange',
      subtitle: '7-Day Hassle Free',
      iconBg: 'bg-deep-navy/10',
      iconColor: 'text-deep-navy',
    },
    {
      id: 'handcrafted',
      icon: FiAward,
      title: '100% Handcrafted',
      subtitle: 'Pure Meerut Artistry',
      iconBg: 'bg-temple-gold/10',
      iconColor: 'text-temple-gold',
    },
    {
      id: 'quality',
      icon: FiShield,
      title: 'Quality Assured',
      subtitle: 'Premium Materials',
      iconBg: 'bg-emerald-100/70',
      iconColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 border-t border-amber-900/10">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-amber-50/60 to-stone-50/80 border border-amber-900/10 gap-1.5 text-center transition-all hover:border-amber-700/20 hover:shadow-xs"
          >
            <div className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg ${badge.iconBg} shrink-0`}>
              <Icon className={`h-4 w-4 ${badge.iconColor}`} />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-xs font-bold text-amber-950 block leading-tight font-display">
                {badge.title}
              </span>
              <span className="text-[9px] sm:text-[11px] text-stone-500 font-medium block leading-tight">
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
