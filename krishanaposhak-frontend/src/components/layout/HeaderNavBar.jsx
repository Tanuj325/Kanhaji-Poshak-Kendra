import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import { ROUTE_PATHS } from '@/routes/routePaths';

export const mainNav = [
  { label: 'Home', to: ROUTE_PATHS.HOME, end: true },
  { label: 'About', to: ROUTE_PATHS.ABOUT },
  { label: 'Shop', to: ROUTE_PATHS.SHOP },
  { label: 'Contact', to: ROUTE_PATHS.CONTACT },
];

function resolveNavPath(item) {
  return item.query ? `${item.to}?${item.query}` : item.to;
}

/**
 * NAVIGATION BAR (Height 46px)
 * Left: Compact All Categories button (~180-190px, shrink-0, opens Mega Menu ONLY).
 * Center: Home · Shop · New Arrivals · Best Sellers · Festivals · Contact (14px font, active gold underline).
 * Stripped of all unnecessary promotional badges.
 */
export default function HeaderNavBar({
  megaMenuOpen,
  onToggleMegaMenu,
  onMegaMenuEnter,
  onMegaMenuLeave,
}) {
  const linkClass = ({ isActive }) =>
    `group relative py-2 px-1 text-sm font-medium tracking-wide transition-colors duration-150 whitespace-nowrap ${isActive ? 'text-[#0F2440] font-bold' : 'text-slate-700 hover:text-[#C99A3B]'
    }`;

  return (
    <div className="hidden md:block w-full bg-white border-b border-slate-200/80 shadow-xs font-sans">
      <div className="mx-auto flex h-[46px] w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* SINGLE FLEX NAVIGATION ROW */}
        <nav
          className="flex min-w-0 flex-1 items-center gap-4 lg:gap-8 xl:gap-10 overflow-x-auto scrollbar-hide"
          aria-label="Main navigation"
        >
          {/* 1. All Categories Trigger Button (~180-190px Compact Temple Gold Button) */}
          <button
            type="button"
            onClick={onToggleMegaMenu}
            onMouseEnter={onMegaMenuEnter}
            onMouseLeave={onMegaMenuLeave}
            className="relative z-10 flex h-5 w-[215px] sm:w-[255px] shrink-0 items-center justify-between rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#C99A3B] to-[#B8860B] px-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-xs hover:brightness-105 transition-all select-none cursor-pointer"
            aria-expanded={megaMenuOpen}
            aria-haspopup="true"
            aria-label="All Categories menu"
          >
            <span className="flex items-center gap-1.5 truncate">
              <FiMenu className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">All Categories</span>
            </span>
            <FiChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* 2. Main Navigation Links (Centered, Home is adjacent with zero overlap) */}
          <div className="flex items-center justify-center gap-4 lg:gap-8 xl:gap-10 shrink-0">
            {mainNav.map((item) => (
              <NavLink
                key={item.label}
                to={resolveNavPath(item)}
                end={item.end}
                className={linkClass}
              >
                {({ isActive }) => (
                  <span className="relative py-1">
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C99A3B]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
