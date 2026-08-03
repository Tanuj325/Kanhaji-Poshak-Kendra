import {
  FiLock,
  FiRefreshCcw,
  FiAward,
  FiHeadphones,
} from 'react-icons/fi';

/**
 * Premium trust strip (compact, deep navy with gold accents) shown beneath
 * the main header on desktop/tablet. Mirrors premium ecommerce trust bars.
 */
const FEATURES = [
  { icon: FiLock, label: 'Secure Payments', sub: '256-bit SSL' },
  { icon: FiRefreshCcw, label: 'Easy Returns', sub: '7-day hassle-free' },
  { icon: FiAward, label: 'Premium Quality', sub: '100% handcrafted' },
  { icon: FiHeadphones, label: '24×7 Support', sub: 'Always here to help' },
];

export default function HeaderFeatureBar() {
  return (
    <div className="hidden w-full border-t border-white/10 bg-[#0B1B30] md:block">
      <div className="mx-auto flex h-11 w-full max-w-[1600px] items-center justify-center gap-6 px-4 sm:gap-10 sm:px-6 lg:gap-16 lg:px-10 xl:px-12 2xl:px-16">
        {FEATURES.map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="group flex items-center gap-2.5"
            title={`${label} — ${sub}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-temple-gold/25 bg-temple-gold/10 text-temple-gold-light transition-all duration-200 group-hover:bg-temple-gold group-hover:text-deep-navy group-hover:shadow-[0_4px_14px_rgba(201,154,59,0.35)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="block text-[11px] font-bold tracking-wide text-lotus-white">
                {label}
              </span>
              <span className="mt-0.5 hidden text-[9px] font-medium tracking-wider text-muted-sand sm:block">
                {sub}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

