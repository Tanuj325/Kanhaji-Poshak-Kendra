import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiShoppingBag,
  FiAward,
  FiTrendingUp,
  FiPercent,
  FiCalendar,
  FiPhone,
  FiMenu,
  FiChevronDown,
} from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';

export const mainNav = [
  { label: 'Home', to: ROUTE_PATHS.HOME, end: true, icon: FiHome },
  { label: 'Shop', to: ROUTE_PATHS.SHOP, icon: FiShoppingBag },
  { label: 'New Arrivals', to: ROUTE_PATHS.SHOP, icon: FiTrendingUp, query: 'sort=createdAt,desc' },
  { label: 'Best Sellers', to: ROUTE_PATHS.SHOP, icon: FiAward, query: 'sort=createdAt,desc' },
  { label: 'Combo Offers', to: ROUTE_PATHS.SHOP, icon: FiPercent, query: 'sort=createdAt,desc' },
  { label: 'Festivals', to: ROUTE_PATHS.HOME, icon: FiCalendar },
  { label: 'Contact', to: ROUTE_PATHS.CONTACT, icon: FiPhone },
];

function resolveNavPath(item) {
  if (!item.query) return item.to;
  return `${item.to}?${item.query}`;
}

/**
 * Dark navy sticky navigation bar.
 * Includes the "All Categories" gold mega-menu trigger on the left,
 * centered main nav links with animated gold underline, and a subtle
 * right-side "Seva" badge on wide screens.
 */
export default function HeaderNavBar({
  isScrolled,
  megaMenuOpen,
  onToggleMegaMenu,
}) {
  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-1.5 px-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 whitespace-nowrap lg:text-xs ${
      isActive ? 'text-temple-gold-light' : 'text-slate-300 hover:text-white'
    }`;

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-deep-navy/95 shadow-[0_12px_30px_rgba(15,36,64,0.28)] backdrop-blur-xl'
          : 'bg-deep-navy shadow-none'
      }`}
    >
      <div className="mx-auto flex h-11 w-full max-w-[1600px] items-center justify-between gap-2 px-3 min-[400px]:px-4 sm:px-6 lg:h-12 lg:gap-4 lg:px-10 xl:px-12 2xl:px-16">
        {/* Left — All Categories gold button */}
        <button
          type="button"
          onClick={onToggleMegaMenu}
          className={`relative z-10 flex min-h-[36px] shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#e8d5a3,#c99a3b,#a87d2e)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-dark-charcoal shadow-gold transition-all duration-200 hover:brightness-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-temple-gold-light lg:px-4 lg:text-xs ${
            megaMenuOpen ? 'ring-2 ring-temple-gold-light/60' : ''
          }`}
          aria-expanded={megaMenuOpen}
          aria-haspopup="true"
          aria-label="Browse all categories"
        >
          <FiMenu className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">All Categories</span>
          <FiChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {/* Center — Main nav */}
        <nav
          className="scrollbar-hide flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto sm:gap-1 lg:gap-2 xl:gap-3"
          aria-label="Main navigation"
        >
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.label} to={resolveNavPath(item)} end={item.end} className={linkClass}>
                {({ isActive }) => (
                  <span className="relative flex items-center gap-1.5 py-1">
                    <Icon className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="header-nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-temple-gold-light via-temple-gold to-temple-gold-dark shadow-gold"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right — subtle trust chip (desktop only) */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-temple-gold/25 bg-temple-gold/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-temple-gold-light">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            100% Handcrafted
          </span>
        </div>
      </div>
    </div>
  );
}

