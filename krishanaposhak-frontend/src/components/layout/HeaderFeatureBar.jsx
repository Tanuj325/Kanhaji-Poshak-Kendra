import {
  FiLock,
  FiRefreshCw,
  FiAward,
  FiClock,
} from 'react-icons/fi';

const FEATURES = [
  { icon: FiLock, label: 'Secure Payments', sub: 'SSL encrypted checkout' },
  { icon: FiRefreshCw, label: 'Easy Returns', sub: '7-day hassle-free' },
  { icon: FiAward, label: 'Premium Quality', sub: 'Handcrafted in Meerut' },
  { icon: FiClock, label: '24x7 Support', sub: 'Devotee-first assistance' },
];

/**
 * Feature trust bar displayed below the navigation on desktop/tablet.
 * Compact, premium, responsive.
 */
export default function HeaderFeatureBar() {
  return (
    <div className="hidden border-b border-slate-200/80 bg-white/90 backdrop-blur-sm md:block">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2 px-6 py-2.5 lg:grid-cols-4 lg:px-10 xl:px-12 2xl:px-16">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="group flex items-center justify-center gap-2.5 rounded-xl px-3 py-1.5 transition-colors hover:bg-warm-cream/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-temple-gold/25 bg-temple-gold/10 text-temple-gold-dark transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-dark-charcoal">
                  {f.label}
                </span>
                <span className="hidden truncate text-[10px] text-natural-wood lg:block">
                  {f.sub}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

