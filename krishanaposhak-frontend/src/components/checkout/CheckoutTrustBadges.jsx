import { memo } from 'react';
import { FiShield, FiLock, FiTruck, FiAward } from 'react-icons/fi';

const CheckoutTrustBadges = memo(function CheckoutTrustBadges() {
  const badges = [
    {
      id: 'ssl',
      icon: FiLock,
      title: '256-Bit SSL Encryption',
      subtitle: 'Bank Level Protection',
      iconBg: 'bg-emerald-100/70 text-emerald-800',
    },
    {
      id: 'razorpay',
      icon: FiShield,
      title: 'Official Bank Gateways',
      subtitle: 'Razorpay Verified',
      iconBg: 'bg-amber-100/70 text-amber-800',
    },
    {
      id: 'shipping',
      icon: FiTruck,
      title: '3-5 Business Day Shipping',
      subtitle: 'Live Tracking SMS',
      iconBg: 'bg-deep-navy/10 text-deep-navy',
    },
    {
      id: 'authentic',
      icon: FiAward,
      title: 'Authentic Attire',
      subtitle: 'Handcrafted in Meerut',
      iconBg: 'bg-temple-gold/15 text-amber-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-6 border-t border-amber-900/10 font-display">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white border border-amber-900/10 shadow-[0_2px_8px_rgba(44,40,36,0.02)] gap-1.5 text-center transition-all hover:border-amber-700/20"
          >
            <div className={`h-8 w-8 rounded-lg ${badge.iconBg} flex items-center justify-center shrink-0`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-amber-950 block leading-tight font-display">
                {badge.title}
              </span>
              <span className="text-[10px] text-stone-500 font-medium block leading-tight font-body">
                {badge.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default CheckoutTrustBadges;
