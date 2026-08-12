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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] font-display">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-amber-50/40 border border-stone-200/60 gap-1.5 transition-all hover:border-[#C99A3B]/50 hover:bg-amber-50/80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2440] text-[#F5E4B5] shrink-0 shadow-xs">
              <Icon className="h-5 w-5 text-[#C99A3B]" />
            </div>
            <div className="space-y-0.5 w-full">
              <span className="text-xs font-extrabold text-[#0F2440] block leading-snug">
                {badge.title}
              </span>
              <span className="text-[11px] text-stone-500 font-medium block leading-snug">
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
