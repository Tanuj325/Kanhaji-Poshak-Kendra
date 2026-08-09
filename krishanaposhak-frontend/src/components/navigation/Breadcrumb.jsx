import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiChevronRight, FiHome, FiGrid } from 'react-icons/fi';

const NON_EXISTENT_PATHS = new Set(['/admin/analytics', '/auth']);

const CUSTOM_LABELS = {
  '/admin/analytics/sales': 'Sales Analytics',
  '/admin/analytics/products': 'Product Analytics',
  '/admin/analytics/customers': 'Customer Analytics',
  '/admin/activity-logs': 'Activity Logs',
  '/admin/payments': 'Payment Monitoring',
  '/admin/messages': 'Contact Messages',
};

function getLabelFromPath(path) {
  if (!path) return '';
  if (CUSTOM_LABELS[path]) return CUSTOM_LABELS[path];
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';
  return lastSegment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const Breadcrumb = memo(function Breadcrumb({ items, className }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isAdminRoute = pathname.startsWith('/admin');

  let navItems = items;
  if (!navItems || navItems.length === 0) {
    const paths = pathname
      .split('/')
      .filter((p) => p)
      .map((_, index, arr) => '/' + arr.slice(0, index + 1).join('/'));

    navItems = [
      {
        label: isAdminRoute ? 'Admin' : 'Home',
        href: isAdminRoute ? ROUTE_PATHS.ADMIN : ROUTE_PATHS.HOME,
        icon: isAdminRoute ? (
          <FiGrid className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        ) : (
          <FiHome className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        ),
      },
      ...paths
        .filter((path) => !(isAdminRoute && path === '/admin'))
        .filter((path) => !NON_EXISTENT_PATHS.has(path))
        .map((path, idx, arr) => ({
          label: getLabelFromPath(path),
          href: idx === arr.length - 1 ? null : path,
        })),
    ];
  } else {
    navItems = navItems.map((item, idx) => {
      if (
        idx === 0 &&
        (item.label.toLowerCase() === 'home' ||
          item.href === '/' ||
          item.href === ROUTE_PATHS.HOME) &&
        !item.icon
      ) {
        return {
          ...item,
          icon: <FiHome className="h-3.5 w-3.5 text-amber-600 shrink-0" />,
        };
      }
      return item;
    });
  }

  if (!navItems || navItems.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={cn(
        'flex items-center gap-1.5 text-xs font-display py-1 overflow-x-auto max-w-full custom-scrollbar min-w-0',
        className
      )}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap min-w-0">
        {navItems.map((item, index) => {
          const isLast = index === navItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 shrink-0 min-w-0">
              {index > 0 && (
                <FiChevronRight
                  className="h-3.5 w-3.5 text-slate-500 shrink-0"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold transition-all shadow-2xs min-h-[30px]',
                    isAdminRoute
                      ? 'border border-slate-200/90 bg-slate-100/90 text-slate-700 hover:text-slate-950 hover:bg-slate-200/90 hover:border-slate-300'
                      : 'border border-slate-300/90 bg-white/95 text-slate-800 hover:text-amber-700 hover:bg-white hover:border-amber-500'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 font-bold rounded-lg px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs shadow-2xs min-h-[30px]',
                    isLast
                      ? isAdminRoute
                        ? 'bg-amber-500/15 text-amber-950 border border-amber-500/30'
                        : 'bg-amber-500/20 text-amber-950 border border-amber-500/40'
                      : isAdminRoute
                      ? 'text-slate-600'
                      : 'text-slate-800'
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
