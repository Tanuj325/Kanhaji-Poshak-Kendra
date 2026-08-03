import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import {
  FiGrid,
  FiPackage,
  FiLayers,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiImage,
  FiMail,
  FiSettings,
  FiBarChart2,
  FiShield,
} from 'react-icons/fi';

const menuItems = [
  { key: 'dashboard', to: ROUTE_PATHS.ADMIN, label: 'Dashboard', icon: FiGrid, roles: ['ADMIN'] },
  { key: 'products', to: ROUTE_PATHS.ADMIN_PRODUCTS, label: 'Products', icon: FiPackage, roles: ['ADMIN'] },
  { key: 'categories', to: ROUTE_PATHS.ADMIN_CATEGORIES, label: 'Categories', icon: FiLayers, roles: ['ADMIN'] },
  { key: 'orders', to: ROUTE_PATHS.ADMIN_ORDERS, label: 'Orders', icon: FiShoppingBag, roles: ['ADMIN'] },
  { key: 'payments', to: ROUTE_PATHS.ADMIN_PAYMENTS, label: 'Payment Monitoring', icon: FiShield, roles: ['ADMIN'] },
  { key: 'users', to: ROUTE_PATHS.ADMIN_USERS, label: 'Users', icon: FiUsers, roles: ['ADMIN'] },
  { key: 'coupons', to: ROUTE_PATHS.ADMIN_COUPONS, label: 'Coupons', icon: FiTag, roles: ['ADMIN'] },
  { key: 'banners', to: ROUTE_PATHS.ADMIN_BANNERS, label: 'Banners', icon: FiImage, roles: ['ADMIN'] },
  { key: 'messages', to: ROUTE_PATHS.ADMIN_MESSAGES, label: 'Messages', icon: FiMail, roles: ['ADMIN'] },
  { key: 'analytics', to: ROUTE_PATHS.ADMIN_SALES_ANALYTICS, label: 'Sales Analytics', icon: FiBarChart2, roles: ['ADMIN'] },
  { key: 'settings', to: ROUTE_PATHS.ADMIN_SETTINGS, label: 'Settings', icon: FiSettings, roles: ['ADMIN'] },
];

export default function SidebarContent({ isCollapsed = false, onCloseMobile }) {
  const { user } = useAuth();
  const role = user?.role ?? '';

  const filteredItems = menuItems.filter(
    (item) => item.roles.includes(role) || item.roles.length === 0,
  );

  const NavItem = memo(function NavItem({ item }) {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.to}
        end={item.key === 'dashboard'}
        onClick={() => {
          if (onCloseMobile) onCloseMobile();
        }}
        title={isCollapsed ? item.label : undefined}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all',
            isActive
              ? 'bg-amber-500/15 text-amber-900 border border-amber-500/30 font-bold shadow-[0_10px_24px_rgba(201,154,59,0.12)]'
              : 'text-natural-wood hover:text-dark-charcoal hover:bg-warm-cream/50',
            isCollapsed && 'justify-center px-0',
          )
        }
      >
        <Icon className={cn('h-4 w-4 shrink-0', 'text-temple-gold')} />
        {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
      </NavLink>
    );
  });

  return (
    <nav className="space-y-1 font-display" aria-label="Admin sidebar navigation">
      {filteredItems.map((item) => (
        <NavItem key={item.key} item={item} />
      ))}
    </nav>
  );
}