import { memo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ROUTE_PATHS } from '@/routes/routePaths';
import {
  FiGrid,
  FiPackage,
  FiLayers,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiImage,
  FiMail,
  FiActivity,
  FiSettings,
  FiBarChart2,
  FiArrowLeft,
  FiTrendingUp,
  FiPieChart,
} from 'react-icons/fi';

const menuSections = [
  {
    title: 'Overview',
    items: [
      { key: 'dashboard', to: ROUTE_PATHS.ADMIN, label: 'Dashboard', icon: FiGrid },
    ],
  },
  {
    title: 'Store Operations',
    items: [
      { key: 'orders', to: ROUTE_PATHS.ADMIN_ORDERS, label: 'Orders', icon: FiShoppingBag },
      { key: 'products', to: ROUTE_PATHS.ADMIN_PRODUCTS, label: 'Products', icon: FiPackage },
      { key: 'categories', to: ROUTE_PATHS.ADMIN_CATEGORIES, label: 'Categories', icon: FiLayers },
      { key: 'users', to: ROUTE_PATHS.ADMIN_USERS, label: 'Devotees & Users', icon: FiUsers },
    ],
  },
  {
    title: 'Marketing & Content',
    items: [
      { key: 'coupons', to: ROUTE_PATHS.ADMIN_COUPONS, label: 'Coupons & Discounts', icon: FiTag },
      { key: 'banners', to: ROUTE_PATHS.ADMIN_BANNERS, label: 'Hero Banners', icon: FiImage },
      { key: 'messages', to: ROUTE_PATHS.ADMIN_MESSAGES, label: 'Contact Messages', icon: FiMail },
    ],
  },
  {
    title: 'Analytics & Reports',
    items: [
      { key: 'sales-analytics', to: ROUTE_PATHS.ADMIN_SALES_ANALYTICS, label: 'Sales Analytics', icon: FiBarChart2 },
      { key: 'product-analytics', to: ROUTE_PATHS.ADMIN_PRODUCT_ANALYTICS, label: 'Product Insights', icon: FiTrendingUp },
      { key: 'customer-analytics', to: ROUTE_PATHS.ADMIN_CUSTOMER_ANALYTICS, label: 'Devotee Analytics', icon: FiPieChart },
    ],
  },
  {
    title: 'System',
    items: [
      { key: 'activity', to: ROUTE_PATHS.ADMIN_ACTIVITY_LOGS, label: 'Activity Logs', icon: FiActivity },
      { key: 'settings', to: ROUTE_PATHS.ADMIN_SETTINGS, label: 'System Settings', icon: FiSettings },
    ],
  },
];

const NavItem = memo(function NavItem({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.key === 'dashboard'}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-medium transition-all duration-150',
          isActive
            ? 'bg-amber-500/10 text-amber-800 font-bold border border-amber-500/20 shadow-[0_10px_24px_rgba(201,154,59,0.12)]'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80',
          collapsed && 'justify-center px-0 py-2.5',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
            )}
          />
          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
          {isActive && !collapsed && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-xs" />
          )}
        </>
      )}
    </NavLink>
  );
});

export default function AdminSidebar({ collapsed = false, onNavigate }) {
  return (
    <nav className="space-y-4 font-display" aria-label="Admin Navigation">
      {/* Return to Storefront Link */}
      <Link
        to={ROUTE_PATHS.HOME}
        className={cn(
          'flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 hover:border-amber-400/40 hover:bg-amber-50/50 hover:text-amber-900 transition-all',
          collapsed && 'justify-center px-0',
        )}
        onClick={onNavigate}
        title={collapsed ? 'Return to Storefront' : undefined}
      >
        <FiArrowLeft className="h-4 w-4 shrink-0 text-amber-600" />
        {!collapsed && <span className="truncate">Storefront</span>}
      </Link>

      {/* Grouped Nav Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <div key={item.key} onClick={onNavigate}>
                <NavItem item={item} collapsed={collapsed} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
