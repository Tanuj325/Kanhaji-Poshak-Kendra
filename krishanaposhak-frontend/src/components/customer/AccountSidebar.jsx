import { memo } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { isAdmin } from '@/utils/roleChecker';
import {
  FiUser,
  FiGrid,
  FiShoppingBag,
  FiMapPin,
  FiHeart,
  FiBell,
  FiSettings,
  FiShield,
  FiLogOut,
  FiChevronRight,
  FiShoppingCart,
  FiStar,
} from 'react-icons/fi';

const navGroups = [
  {
    title: 'Dashboard',
    items: [
      { key: 'dashboard', to: ROUTE_PATHS.ACCOUNT_DASHBOARD, label: 'Overview', icon: FiGrid },
    ],
  },
  {
    title: 'My Activity',
    items: [
      { key: 'orders', to: ROUTE_PATHS.ORDERS, label: 'My Orders', icon: FiShoppingBag },
      { key: 'wishlist', to: ROUTE_PATHS.WISHLIST, label: 'Saved Wishlist', icon: FiHeart },
      { key: 'notifications', to: ROUTE_PATHS.NOTIFICATIONS, label: 'Notifications', icon: FiBell },
    ],
  },
  {
    title: 'Account Settings',
    items: [
      { key: 'profile', to: ROUTE_PATHS.PROFILE, label: 'Personal Profile', icon: FiUser },
      { key: 'addresses', to: ROUTE_PATHS.ADDRESSES, label: 'Address Book', icon: FiMapPin },
      { key: 'settings', to: ROUTE_PATHS.SETTINGS, label: 'Security & Preferences', icon: FiSettings },
    ],
  },
];

const NavItem = memo(function NavItem({ item, unreadCount, wishlistCount }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.key === 'dashboard' || item.key === 'profile'}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold transition-all duration-200 select-none min-h-[44px]',
          isActive
            ? 'bg-amber-900 text-white shadow-md font-extrabold border border-amber-700/30'
            : 'text-stone-700 hover:bg-amber-100/60 hover:text-amber-950 font-medium',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
              isActive ? 'text-amber-300' : 'text-amber-800 group-hover:text-amber-950',
            )}
          />
          <span className="flex-1 min-w-0 leading-tight font-display">{item.label}</span>

          {item.key === 'notifications' && unreadCount > 0 && (
            <Badge variant="danger" size="sm" className="font-bold shrink-0 animate-pulse bg-rose-600 text-white">
              {unreadCount}
            </Badge>
          )}

          {item.key === 'wishlist' && wishlistCount > 0 && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 border font-mono',
                isActive
                  ? 'bg-amber-800 text-amber-200 border-amber-600'
                  : 'bg-amber-100 text-amber-900 border-amber-300',
              )}
            >
              {wishlistCount}
            </span>
          )}

          {isActive && (
            <FiChevronRight className="h-4 w-4 text-amber-300 hidden md:block shrink-0" />
          )}
        </>
      )}
    </NavLink>
  );
});

function AccountSidebar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCartContext();
  const { wishlist } = useWishlistContext();
  const { data: unreadData } = useUnreadNotificationCount();

  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const unreadNotificationsCount = typeof unreadData === 'number' ? unreadData : unreadData?.count || 0;

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTE_PATHS.LOGIN, { replace: true });
    } catch {
      // Handled by auth context
    }
  };

  const allItems = navGroups.flatMap((g) => g.items);

  return (
    <aside className="w-full space-y-4 font-display">
      {/* Mobile Horizontal Pill Navigation Bar */}
      <div
        className="md:hidden overflow-x-auto pb-1.5 scrollbar-hide bg-white p-2 rounded-2xl border border-amber-900/10 shadow-xs flex items-center gap-1.5"
        role="navigation"
        aria-label="Mobile account navigation"
      >
        {allItems.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            unreadCount={unreadNotificationsCount}
            wishlistCount={wishlistCount}
          />
        ))}
      </div>

      {/* Desktop Luxury Sticky Sidebar */}
      <nav
        className="sticky top-24 hidden md:block rounded-3xl bg-white p-5 shadow-[0_4px_24px_rgba(44,40,36,0.04)] border border-amber-900/10 space-y-6 relative overflow-hidden"
        aria-label="Account navigation"
      >
        {/* Subtle Background Luxury Glow Accent */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Customer Header Info */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-amber-900/10 relative z-10">
          <div className="relative shrink-0">
            <Avatar
              name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              src={user?.profileImageUrl}
              size="lg"
              className="border-2 border-amber-500 shadow-md"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs" title="Active Account" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <FiStar className="h-3 w-3 text-amber-700" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 font-heading">
                Devotee Member
              </span>
            </div>
            <h3 className="truncate font-heading text-base font-extrabold text-amber-950 leading-tight">
              {user?.firstName || 'Valued'} {user?.lastName || 'Customer'}
            </h3>
            <p className="truncate text-xs text-stone-500 mt-0.5 font-body">{user?.email}</p>
          </div>
        </div>

        {/* Grouped Menu Links */}
        <div className="space-y-4 relative z-10">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-amber-900/60 font-heading">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.key}
                    item={item}
                    unreadCount={unreadNotificationsCount}
                    wishlistCount={wishlistCount}
                  />
                ))}
              </div>
            </div>
          ))}

          {isAdmin(role) && (
            <div className="pt-2">
              <NavLink
                to={ROUTE_PATHS.ADMIN}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-extrabold text-amber-200 bg-amber-950 hover:bg-stone-950 transition-all shadow-md border border-amber-500/20 min-h-[44px]"
              >
                <FiShield className="h-4 w-4 text-amber-300 shrink-0" />
                <span>Admin Portal Access</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Cart Shortcut & Logout Footer */}
        <div className="pt-4 border-t border-amber-900/10 space-y-2 relative z-10 font-body">
          <Link
            to={ROUTE_PATHS.CART}
            className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-bold text-amber-950 bg-amber-50/70 border border-amber-900/10 hover:bg-amber-100/60 transition-colors min-h-[44px]"
          >
            <span className="flex items-center gap-2">
              <FiShoppingCart className="h-4 w-4 text-amber-800 shrink-0" /> Active Cart
            </span>
            <span className="rounded-full bg-amber-900 px-2.5 py-0.5 text-[10px] text-white font-mono font-bold">{cartCount}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors min-h-[44px]"
          >
            <span>Sign Out</span>
            <FiLogOut className="h-4 w-4 shrink-0 text-rose-600" />
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default memo(AccountSidebar);
