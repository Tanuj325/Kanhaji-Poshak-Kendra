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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-200/80">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-stone-50 border border-slate-200/80 gap-1 text-center transition-all hover:border-[#C99A3B]/40"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 shrink-0">
              <Icon className="h-3.5 w-3.5 text-[#C99A3B]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-[#0F2440] block leading-tight font-display">
                {badge.title}
              </span>
              <span className="text-[10px] text-stone-500 font-medium block leading-tight">
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
