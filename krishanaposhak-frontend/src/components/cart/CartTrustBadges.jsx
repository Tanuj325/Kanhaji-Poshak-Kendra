import { memo } from 'react';
import { FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';

const CartTrustBadges = memo(function CartTrustBadges({ compact = false }) {
  const badges = [
    {
      id: 'secure',
      icon: FiShield,
      title: '100% Secure Payment',
      subtitle: '256-Bit SSL Encrypted',
      iconBg: 'bg-emerald-100/70 text-emerald-800',
    },
    {
      id: 'shipping',
      icon: FiTruck,
      title: 'Express Delivery',
      subtitle: '3-5 Business Days',
      iconBg: 'bg-amber-100/70 text-amber-800',
    },
    {
      id: 'exchange',
      icon: FiRefreshCw,
      title: '7-Day Easy Return',
      subtitle: 'Hassle-Free Guarantee',
      iconBg: 'bg-deep-navy/10 text-deep-navy',
    },
    {
      id: 'authentic',
      icon: FiAward,
      title: 'Authentic Artistry',
      subtitle: '100% Handcrafted Meerut',
      iconBg: 'bg-temple-gold/15 text-amber-900',
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2 pt-2">
        {badges.slice(0, 2).map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/50 border border-amber-900/10 text-left"
            >
              <div className={`h-7 w-7 rounded-lg ${badge.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-amber-950 block leading-tight font-display truncate">
                  {badge.title}
                </span>
                <span className="text-[9px] text-stone-500 font-medium block leading-tight truncate">
                  {badge.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-amber-900/10 font-display">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-white border border-amber-900/10 shadow-[0_2px_8px_rgba(44,40,36,0.02)] gap-1.5 sm:gap-2 text-center transition-all hover:border-amber-700/20 hover:shadow-xs"
          >
            <div className={`h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl ${badge.iconBg} flex shrink-0`}>
              <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] sm:text-xs font-bold text-amber-950 block leading-tight">
                {badge.title}
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium block leading-tight font-body">
                {badge.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default CartTrustBadges;
