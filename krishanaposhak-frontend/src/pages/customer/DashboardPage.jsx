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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileDashboard from '@/components/customer/mobile/MobileDashboard';
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
  const isDesktop = useMediaQuery('(min-width: 1024px)');
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

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (user?.firstName && user?.lastName) score += 20;
    if (user?.email) score += 20;
    if (user?.phoneNumber) score += 20;
    if (user?.gender || user?.dateOfBirth) score += 20;
    if (addrList.length > 0) score += 20;
    return score;
  }, [user, addrList]);

  if (!isDesktop) {
    return <MobileDashboard />;
  }

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
        className="space-y-6 max-w-6xl font-display"
      >
        <Breadcrumb items={breadcrumbItems} />

        {/* Luxury Hero Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-stone-950 to-amber-900 p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-amber-500/20">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <Avatar
                  name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                  src={user?.profileImageUrl}
                  size="xl"
                  className="border-2 border-amber-400 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-xs">
                  <FiStar className="h-3.5 w-3.5 fill-amber-950" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 backdrop-blur-md border border-amber-400/30 font-heading">
                    <FiShield className="h-3 w-3" /> Devotee Member
                  </span>
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {user?.firstName || 'Devotee'}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 font-body max-w-lg">
                  Explore your exclusive deity poshaks, track recent order deliveries, and manage your saved address book.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/shop">
                <Button variant="primary" size="md" className="font-bold shadow-md bg-amber-600 hover:bg-amber-700 text-amber-950 rounded-xl min-h-[44px]">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-body">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-xs font-semibold text-stone-300 shrink-0">
                Profile Completion: <strong className="text-amber-300">{profileCompletion}%</strong>
              </span>
              <div className="h-2 flex-1 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
            {profileCompletion < 100 && (
              <Link to="/account/profile" className="text-xs text-amber-300 hover:underline font-bold flex items-center gap-1">
                Complete profile details <FiChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <DashboardCard
            icon={<FiShoppingBag className="h-5 w-5 text-amber-900" />}
            label="Total Orders"
            value={totalOrders}
            onClick={() => navigate('/account/orders')}
          />
          <DashboardCard
            icon={<FiHeart className="h-5 w-5 text-amber-900" />}
            label="Saved Wishlist"
            value={wishlistCount}
            onClick={() => navigate('/account/wishlist')}
          />
          <DashboardCard
            icon={<FiBell className="h-5 w-5 text-amber-900" />}
            label="Notifications"
            value={unreadCount}
            onClick={() => navigate('/account/notifications')}
          />
          <DashboardCard
            icon={<FiMapPin className="h-5 w-5 text-amber-900" />}
            label="Saved Addresses"
            value={addrList.length}
            onClick={() => navigate('/account/addresses')}
          />
        </div>

        {/* Dashboard Main Grid Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Recent Orders Overview */}
          <div className="lg:col-span-8 rounded-3xl bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(44,40,36,0.03)] border border-amber-900/10 space-y-5">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-extrabold text-amber-950 flex items-center gap-2">
                  <FiClock className="h-5 w-5 text-amber-800" /> Recent Orders
                </h2>
                <p className="text-xs text-stone-500 mt-0.5 font-body">Track your recent purchases and delivery status</p>
              </div>
              <Link to="/account/orders" className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline">
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
              <div className="py-10 text-center text-stone-600 space-y-3 bg-amber-50/50 rounded-2xl p-6 border border-amber-900/10 font-body">
                <FiShoppingBag className="h-10 w-10 text-amber-900/30 mx-auto" />
                <h3 className="font-heading font-extrabold text-sm text-amber-950">No Orders Placed Yet</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">Discover our authentic Meerut handloom poshaks & sacred jewellery.</p>
                <Link to="/shop">
                  <Button variant="primary" size="xs" className="font-bold bg-amber-900 text-white rounded-xl min-h-[36px]">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 4).map((order) => (
                  <Link
                    key={order.id}
                    to={`/account/orders/${order.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-amber-900/10 hover:border-amber-700/30 hover:bg-amber-50/40 transition-all duration-200 gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-heading font-bold text-sm text-amber-950 group-hover:text-amber-900 transition-colors">
                          #{order.orderNumber}
                        </span>
                        <Badge variant={statusColors[order.orderStatus] || 'default'} size="xs" className="font-bold">
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-stone-500 font-body">
                        {order.orderDate ? formatDate(order.orderDate, { format: 'datetime' }) : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-900/10">
                      <div className="text-left sm:text-right font-body">
                        <span className="font-heading font-bold text-amber-950 text-base block font-mono">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {order.items?.length || 1} Item(s)
                        </span>
                      </div>
                      <FiChevronRight className="h-5 w-5 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts & Address Preview */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(44,40,36,0.03)] border border-amber-900/10 space-y-4">
              <h2 className="font-heading text-lg font-extrabold text-amber-950 border-b border-amber-900/10 pb-3">
                Quick Shortcuts
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <Link to="/shop">
                  <Button variant="primary" size="sm" isFullWidth className="font-bold bg-amber-900 text-white rounded-xl min-h-[40px]">
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/account/profile">
                  <Button variant="outline" size="sm" isFullWidth leftIcon={<FiUser className="h-3.5 w-3.5 text-amber-800" />} className="rounded-xl border-amber-900/20 font-bold min-h-[40px]">
                    Profile
                  </Button>
                </Link>
                <Link to="/account/orders">
                  <Button variant="outline" size="sm" isFullWidth leftIcon={<FiShoppingBag className="h-3.5 w-3.5 text-amber-800" />} className="rounded-xl border-amber-900/20 font-bold min-h-[40px]">
                    Orders
                  </Button>
                </Link>
                <Link to="/account/addresses">
                  <Button variant="outline" size="sm" isFullWidth leftIcon={<FiMapPin className="h-3.5 w-3.5 text-amber-800" />} className="rounded-xl border-amber-900/20 font-bold min-h-[40px]">
                    Addresses
                  </Button>
                </Link>
              </div>

              {recentOrders.length > 0 && (
                <div className="mt-4 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs font-body">
                  <span className="text-stone-500 font-medium">Recent Spend Overview</span>
                  <span className="font-heading font-extrabold text-amber-950 text-sm font-mono">
                    {formatPrice(totalSpent)}
                  </span>
                </div>
              )}
            </div>

            {/* Saved Address Preview Box */}
            <div className="rounded-3xl bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20 p-6 shadow-[0_4px_20px_rgba(44,40,36,0.03)] border border-amber-900/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-extrabold text-amber-950 flex items-center gap-2">
                  <FiMapPin className="h-4 w-4 text-amber-800" /> Default Address
                </h3>
                <Link to="/account/addresses" className="text-xs font-bold text-amber-900 hover:underline">
                  Manage
                </Link>
              </div>

              {addressesLoading ? (
                <Spinner size="xs" label="Loading address..." />
              ) : defaultAddr ? (
                <div className="text-xs text-stone-700 space-y-1 bg-white p-4 rounded-2xl border border-amber-900/10 font-body">
                  <p className="font-bold text-amber-950">{defaultAddr.fullName}</p>
                  <p>{defaultAddr.addressLine1}</p>
                  <p className="font-medium text-stone-500">{defaultAddr.city}, {defaultAddr.state} - {defaultAddr.postalCode}</p>
                </div>
              ) : (
                <div className="text-center py-3 space-y-2 font-body">
                  <p className="text-xs text-stone-500">No default delivery address configured.</p>
                  <Link to="/account/addresses">
                    <Button variant="outline" size="xs" leftIcon={<FiPlus className="h-3 w-3 text-amber-800" />} className="rounded-xl border-amber-900/20 font-bold min-h-[36px]">
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
