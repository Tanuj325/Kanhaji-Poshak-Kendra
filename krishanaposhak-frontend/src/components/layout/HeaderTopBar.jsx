import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes/routePaths';

/**
 * TOP UTILITY BAR (Height 32px)
 * Theme: Royal Midnight Navy (#070D1B) with Temple Gold Accent (#D4AF37)
 * Mobile: Non-wrapping flex layout with 10px typography, zero text clipping.
 */
export default function HeaderTopBar() {
  return (
    <div className="w-full bg-[#070D1B] text-slate-300 border-b border-white/10 font-sans">
      <div className="mx-auto flex h-8 w-full max-w-[1600px] items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16 text-[10px] sm:text-[11px] font-normal tracking-wide whitespace-nowrap overflow-hidden">
        {/* Left Promo */}
        <div className="flex items-center gap-1.5 font-medium text-slate-200 truncate">
          <span className="text-[#D4AF37] shrink-0" aria-hidden="true">✨</span>
          <span className="truncate">Free Shipping across India on orders above <strong className="text-white font-semibold">₹999</strong></span>
        </div>

        {/* Right Utility Links */}
        <div className="flex items-center gap-4 sm:gap-6 font-medium shrink-0">
          <Link
            to={ROUTE_PATHS.ORDERS}
            className="transition-colors duration-150 text-slate-300 hover:text-[#D4AF37]"
          >
            Track Order
          </Link>
          <span className="h-3 w-px bg-white/20" aria-hidden="true" />
          <Link
            to={ROUTE_PATHS.CONTACT}
            className="transition-colors duration-150 text-slate-300 hover:text-[#D4AF37]"
          >
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
