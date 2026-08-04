import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiChevronRight, FiHome, FiGrid } from 'react-icons/fi';

function getLabelFromPath(path) {
  if (!path) return '';
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';
  return lastSegment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const Breadcrumb = memo(function Breadcrumb({ items, className }) {
  const location = useLocation();
  const pathname = location.pathname;

  let navItems = items;
  if (!navItems || navItems.length === 0) {
    const paths = pathname
      .split('/')
      .filter((p) => p)
      .map((_, index, arr) => '/' + arr.slice(0, index + 1).join('/'));

    const isAdminRoute = pathname.startsWith('/admin');

    navItems = [
      {
        label: isAdminRoute ? 'Admin' : 'Home',
        href: isAdminRoute ? ROUTE_PATHS.ADMIN : ROUTE_PATHS.HOME,
        icon: isAdminRoute ? <FiGrid className="h-3.5 w-3.5 text-temple-gold" /> : <FiHome className="h-3.5 w-3.5 text-temple-gold" />,
      },
      ...paths
        .filter((path) => !(isAdminRoute && path === '/admin'))
        .map((path, idx, arr) => ({
          label: getLabelFromPath(path),
          href: idx === arr.length - 1 ? null : path,
        })),
    ];
  } else {
    navItems = navItems.map((item, idx) => {
      if (idx === 0 && (item.label.toLowerCase() === 'home' || item.href === '/' || item.href === ROUTE_PATHS.HOME) && !item.icon) {
        return { ...item, icon: <FiHome className="h-3.5 w-3.5 text-temple-gold" /> };
      }
      return item;
    });
  }

  if (!navItems || navItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb navigation" className={cn('flex flex-wrap items-center gap-1.5 text-xs font-display py-1.5', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {navItems.map((item, index) => {
          const isLast = index === navItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <FiChevronRight className="h-3.5 w-3.5 text-temple-gold/60 shrink-0" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-temple-gold/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-lotus-white hover:border-temple-gold/50 hover:bg-white/20 transition-all shadow-2xs backdrop-blur-xs min-h-[32px]"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 font-bold rounded-xl px-3 py-1.5 text-xs backdrop-blur-xs min-h-[32px]',
                    isLast
                      ? 'bg-temple-gold/20 text-temple-gold-light border border-temple-gold/30'
                      : 'text-stone-300',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export default Breadcrumb;
