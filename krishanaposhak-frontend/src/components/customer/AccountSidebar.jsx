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
          'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 select-none',
          isActive
            ? 'bg-gradient-to-r from-deep-navy via-royal-blue to-royal-blue text-lotus-white shadow-md font-bold'
            : 'text-dark-charcoal/80 hover:bg-temple-gold/10 hover:text-royal-blue',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110',
              isActive ? 'text-temple-gold' : 'text-royal-blue/80 group-hover:text-royal-blue',
            )}
          />
          <span className="flex-1 min-w-0 leading-tight">{item.label}</span>

          {item.key === 'notifications' && unreadCount > 0 && (
            <Badge variant="danger" size="sm" className="font-bold flex-shrink-0 animate-pulse">
              {unreadCount}
            </Badge>
          )}

          {item.key === 'wishlist' && wishlistCount > 0 && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold flex-shrink-0 border',
                isActive
                  ? 'bg-white/20 text-temple-gold border-temple-gold/30'
                  : 'bg-royal-blue/10 text-royal-blue border-royal-blue/20',
              )}
            >
              {wishlistCount}
            </span>
          )}

          {isActive && (
            <FiChevronRight className="h-4 w-4 text-temple-gold hidden md:block flex-shrink-0" />
          )}

          {isActive && (
            <motion.div
              layoutId="activeSideNav"
              className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-temple-gold hidden md:block shadow-[0_0_8px_#D4AF37]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
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
    <aside className="w-full space-y-4">
      {/* Mobile Horizontal Pill Navigation Bar */}
      <div className="md:hidden overflow-x-auto pb-1.5 scrollbar-hide bg-white/90 backdrop-blur-md p-2 rounded-[24px] border border-temple-gold/20 shadow-[0_12px_28px_rgba(44,40,36,0.08)] flex items-center gap-1.5">
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
        className="sticky top-24 hidden md:block rounded-[28px] bg-white/90 p-5 shadow-[0_18px_48px_rgba(44,40,36,0.1)] border border-white/70 space-y-6 relative overflow-hidden backdrop-blur-sm"
        aria-label="Account navigation"
      >
        {/* Subtle Background Luxury Glow Accent */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-temple-gold/5 rounded-full blur-2xl pointer-events-none" />

        {/* Customer Header Info */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-muted-sand/20 relative z-10">
          <div className="relative flex-shrink-0">
            <Avatar
              name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              src={user?.profileImageUrl}
              size="lg"
              className="border-2 border-temple-gold shadow-md"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-[0_10px_20px_rgba(16,185,129,0.18)]" title="Online Session" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <FiStar className="h-3 w-3 text-temple-gold" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-temple-gold">
                Devotee Member
              </span>
            </div>
            <h3 className="truncate font-display text-base font-bold text-dark-charcoal leading-tight">
              {user?.firstName || 'Valued'} {user?.lastName || 'Customer'}
            </h3>
            <p className="truncate text-xs text-natural-wood mt-0.5 font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Grouped Menu Links */}
        <div className="space-y-4 relative z-10">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-natural-wood/60 font-display">
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
                className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-temple-gold bg-[linear-gradient(135deg,#0f2440,#2c2824)] hover:opacity-95 transition-all shadow-[0_14px_32px_rgba(15,36,64,0.2)]"
              >
                <FiShield className="h-4 w-4 text-temple-gold flex-shrink-0" />
                <span>Admin Portal</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Cart Shortcut & Logout Footer */}
        <div className="pt-4 border-t border-muted-sand/20 space-y-2 relative z-10">
          <Link
            to={ROUTE_PATHS.CART}
            className="flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold text-dark-charcoal bg-warm-cream/50 border border-temple-gold/20 hover:bg-warm-cream transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiShoppingCart className="h-4 w-4 text-royal-blue flex-shrink-0" /> Shopping Cart
            </span>
            <span className="rounded-full bg-royal-blue px-2.5 py-0.5 text-[10px] text-white font-bold">{cartCount}</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl px-3.5 py-2 text-xs font-bold text-error hover:bg-error/10 transition-colors min-h-[44px]"
          >
            <span>Sign Out</span>
            <FiLogOut className="h-4 w-4 flex-shrink-0" />
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default memo(AccountSidebar);
