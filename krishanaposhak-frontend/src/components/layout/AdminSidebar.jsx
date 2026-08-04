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
  FiDollarSign,
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
    title: 'Analytics & Finance',
    items: [
      { key: 'sales-analytics', to: ROUTE_PATHS.ADMIN_SALES_ANALYTICS, label: 'Sales Analytics', icon: FiBarChart2 },
      { key: 'product-analytics', to: ROUTE_PATHS.ADMIN_PRODUCT_ANALYTICS, label: 'Product Insights', icon: FiTrendingUp },
      { key: 'customer-analytics', to: ROUTE_PATHS.ADMIN_CUSTOMER_ANALYTICS, label: 'Devotee Analytics', icon: FiPieChart },
      { key: 'payments', to: ROUTE_PATHS.ADMIN_PAYMENTS, label: 'Payment Gateway', icon: FiDollarSign },
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
          'group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 select-none min-h-[40px]',
          isActive
            ? 'bg-amber-900 text-white shadow-md border border-amber-700/30 font-extrabold'
            : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/60 font-medium',
          collapsed && 'justify-center px-0 py-2.5',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
              isActive ? 'text-amber-300' : 'text-amber-800 group-hover:text-amber-950'
            )}
          />
          {!collapsed && <span className="flex-1 truncate font-display">{item.label}</span>}
          {isActive && !collapsed && (
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-xs" />
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
          'flex items-center gap-2.5 rounded-2xl border border-amber-900/15 bg-amber-50/70 px-3.5 py-2.5 text-xs font-bold text-amber-950 hover:border-amber-700/40 hover:bg-amber-100/70 transition-all min-h-[40px]',
          collapsed && 'justify-center px-0',
        )}
        onClick={onNavigate}
        title={collapsed ? 'Return to Storefront' : undefined}
      >
        <FiArrowLeft className="h-4 w-4 shrink-0 text-amber-800" />
        {!collapsed && <span className="truncate">Public Storefront</span>}
      </Link>

      {/* Grouped Nav Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-amber-900/60 font-heading">
              {section.title}
            </p>
          )}
          <div className="space-y-1">
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
