import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { DashboardCard } from '@/components/customer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useWishlistContext } from '@/context/WishlistContext';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { useOrders } from '@/hooks/useOrders';
import { useAddresses } from '@/hooks/useAddresses';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { siteConfig } from '@/config/siteConfig';
import {
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiChevronRight,
  FiUser,
  FiPlus,
  FiClock,
  FiBell,
  FiStar,
  FiShield,
  FiArrowUpRight,
} from 'react-icons/fi';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'My Account', href: '/account/profile' },
  { label: 'Dashboard' },
];

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PACKING: 'info',
  PROCESSING: 'info',
  SHIPPED: 'purple',
  OUT_FOR_DELIVERY: 'purple',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  RETURNED: 'warning',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist } = useWishlistContext();
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = typeof unreadData === 'number' ? unreadData : unreadData?.count || 0;

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useOrders({ page: 0, size: 5, sort: 'createdAt,desc' });

  const { data: addresses, isLoading: addressesLoading } = useAddresses();

  const recentOrders = ordersData?.content || ordersData?.data || [];
  const addrList = Array.isArray(addresses) ? addresses : addresses?.data || [];
  const defaultAddr = addrList.find((a) => a.defaultAddress) || addrList[0];
  const totalOrders = ordersData?.totalElements || recentOrders.length;
  const totalSpent = recentOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Profile completion meter calculation (0 - 100%)
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (user?.firstName && user?.lastName) score += 20;
    if (user?.email) score += 20;
    if (user?.phoneNumber) score += 20;
    if (user?.gender || user?.dateOfBirth) score += 20;
    if (addrList.length > 0) score += 20;
    return score;
  }, [user, addrList]);

  return (
    <>
      <Helmet>
        <title>{`My Account Dashboard | ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 max-w-6xl"
      >
        <Breadcrumb items={breadcrumbItems} />

        {/* Luxury Hero Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-deep-navy via-royal-blue to-dark-charcoal p-6 sm:p-8 text-lotus-white shadow-xl overflow-hidden">
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-temple-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative flex-shrink-0">
                <Avatar
                  name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                  src={user?.profileImageUrl}
                  size="xl"
                  className="border-2 border-temple-gold shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-temple-gold text-dark-charcoal p-1 rounded-full shadow-xs">
                  <FiStar className="h-3.5 w-3.5 fill-dark-charcoal" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-temple-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-temple-gold backdrop-blur-md border border-temple-gold/30">
                    <FiShield className="h-3 w-3" /> Devotee Member
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-lotus-white">
                  Welcome back, {user?.firstName || 'Devotee'}
                </h1>
                <p className="text-xs sm:text-sm text-lotus-white/80 mt-1 font-light max-w-lg">
                  Explore your exclusive designer poshaks, order history, and saved address book.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/shop">
                <Button variant="primary" size="md" className="font-bold shadow-md">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs font-semibold text-lotus-white/90 shrink-0">
                Profile Completion: <strong className="text-temple-gold">{profileCompletion}%</strong>
              </span>
              <div className="h-2 flex-1 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-temple-gold to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
            {profileCompletion < 100 && (
              <Link to="/account/profile" className="text-xs text-temple-gold hover:underline font-semibold flex items-center gap-1">
                Complete your details <FiChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DashboardCard
            icon={<FiShoppingBag className="h-5 w-5 text-royal-blue" />}
            label="Total Orders"
            value={totalOrders}
            onClick={() => navigate('/account/orders')}
          />
          <DashboardCard
            icon={<FiHeart className="h-5 w-5 text-temple-gold" />}
            label="Saved Wishlist"
            value={wishlistCount}
            onClick={() => navigate('/account/wishlist')}
          />
          <DashboardCard
            icon={<FiBell className="h-5 w-5 text-amber-500" />}
            label="Notifications"
            value={unreadCount}
            onClick={() => navigate('/account/notifications')}
          />
          <DashboardCard
            icon={<FiMapPin className="h-5 w-5 text-emerald-600" />}
            label="Saved Addresses"
            value={addrList.length}
            onClick={() => navigate('/account/addresses')}
          />
        </div>

        {/* Dashboard Main Grid Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Recent Orders Overview */}
          <div className="lg:col-span-8 rounded-3xl bg-white p-6 sm:p-7 shadow-md border border-temple-gold/20 space-y-5">
            <div className="flex items-center justify-between border-b border-muted-sand/15 pb-4">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-dark-charcoal flex items-center gap-2">
                  <FiClock className="h-5 w-5 text-royal-blue" /> Recent Orders
                </h2>
                <p className="text-xs text-natural-wood mt-0.5">Track your recent purchases and delivery status</p>
              </div>
              <Link to="/account/orders" className="inline-flex items-center gap-1 text-xs font-bold text-royal-blue hover:text-deep-navy">
                View All Orders <FiArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {ordersLoading ? (
              <div className="py-12 text-center">
                <Spinner size="md" label="Retrieving recent orders..." />
              </div>
            ) : ordersError ? (
              <ErrorState title="Orders Unavailable" message="Unable to load your orders right now." onRetry={refetchOrders} />
            ) : recentOrders.length === 0 ? (
              <div className="py-10 text-center text-natural-wood space-y-3 bg-warm-cream/30 rounded-2xl p-6 border border-muted-sand/20">
                <FiShoppingBag className="h-10 w-10 text-natural-wood/40 mx-auto" />
                <h3 className="font-display font-bold text-sm text-dark-charcoal">No Orders Placed Yet</h3>
                <p className="text-xs text-natural-wood max-w-sm mx-auto">Discover our authentic Meerut handloom poshaks & sacred jewellery.</p>
                <Link to="/shop">
                  <Button variant="primary" size="xs" className="font-bold">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 4).map((order) => (
                  <Link
                    key={order.id}
                    to={`/account/orders/${order.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-muted-sand/20 hover:border-temple-gold/40 hover:bg-warm-cream/30 transition-all duration-300 gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-bold text-sm text-dark-charcoal group-hover:text-royal-blue transition-colors">
                          #{order.orderNumber}
                        </span>
                        <Badge variant={statusColors[order.orderStatus] || 'default'} size="xs" className="font-bold">
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-natural-wood/80">
                        {order.orderDate ? formatDate(order.orderDate, { format: 'datetime' }) : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-muted-sand/15">
                      <div className="text-left sm:text-right">
                        <span className="font-display font-bold text-royal-blue text-base block">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <span className="text-[11px] text-natural-wood">
                          {order.items?.length || 1} Item(s)
                        </span>
                      </div>
                      <FiChevronRight className="h-5 w-5 text-natural-wood/60 group-hover:text-royal-blue group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts & Address Preview */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="rounded-3xl bg-white p-6 shadow-md border border-temple-gold/20 space-y-4">
              <h2 className="font-serif text-lg font-bold text-dark-charcoal border-b border-muted-sand/15 pb-3">
                Quick Shortcuts
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/shop">
                  <Button variant="primary" size="sm" isFullWidth className="font-bold">
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/account/profile">
                  <Button variant="outline" size="sm" isFullWidth leftIcon={<FiUser className="h-3.5 w-3.5" />}>
                    Profile
                  </Button>
                </Link>
                <Link to="/account/orders">
                  <Button variant="outline" size="sm" isFullWidth leftIcon={<FiShoppingBag className="h-3.5 w-3.5" />}>
                    Orders
                  </Button>
                </Link>
                <Link to="/account/addresses">
                  <Button variant="outline" size="sm" isFullWidth leftIcon={<FiMapPin className="h-3.5 w-3.5" />}>
                    Addresses
                  </Button>
                </Link>
              </div>

              {recentOrders.length > 0 && (
                <div className="mt-4 pt-4 border-t border-muted-sand/15 flex items-center justify-between text-xs">
                  <span className="text-natural-wood font-medium">Recent Spend Overview</span>
                  <span className="font-display font-bold text-dark-charcoal text-sm">
                    {formatPrice(totalSpent)}
                  </span>
                </div>
              )}
            </div>

            {/* Saved Address Preview Box */}
            <div className="rounded-3xl bg-gradient-to-br from-white via-warm-cream/30 to-temple-gold/5 p-6 shadow-md border border-temple-gold/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-dark-charcoal flex items-center gap-2">
                  <FiMapPin className="h-4 w-4 text-temple-gold" /> Default Address
                </h3>
                <Link to="/account/addresses" className="text-xs font-bold text-royal-blue hover:underline">
                  Manage
                </Link>
              </div>

              {addressesLoading ? (
                <Spinner size="xs" label="Loading address..." />
              ) : defaultAddr ? (
                <div className="text-xs text-dark-charcoal/85 space-y-1 bg-white/80 p-3.5 rounded-2xl border border-muted-sand/20">
                  <p className="font-bold text-dark-charcoal">{defaultAddr.fullName}</p>
                  <p>{defaultAddr.addressLine1}</p>
                  <p className="font-medium text-natural-wood">{defaultAddr.city}, {defaultAddr.state} - {defaultAddr.postalCode}</p>
                </div>
              ) : (
                <div className="text-center py-3 space-y-2">
                  <p className="text-xs text-natural-wood">No default delivery address configured.</p>
                  <Link to="/account/addresses">
                    <Button variant="outline" size="xs" leftIcon={<FiPlus className="h-3 w-3" />}>
                      Add Address
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
