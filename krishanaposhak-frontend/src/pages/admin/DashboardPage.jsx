import { memo, useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  useTopSellingProducts,
  useTopRatedProducts,
  useMostWishlistedProducts,
  useLowStockProducts,
  useOutOfStockProducts,
  useTopSellingCategories,
  useDailySales,
  useWeeklySales,
  useMonthlySales,
  useYearlySales,
  useCustomerOverview,
  useRecentActivity,
  useRefreshAnalytics,
} from '@/hooks/useAnalytics';
import { SalesChart } from '@/components/charts';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { cn } from '@/utils/cn';
import {
  FiRotateCw,
  FiShoppingCart,
  FiUser,
  FiStar,
  FiHeart,
  FiDollarSign,
  FiArrowRight,
  FiCalendar,
  FiInbox,
  FiTrendingUp,
  FiAlertCircle,
  FiPackage,
  FiPlus,
  FiTag,
  FiCheckCircle,
  FiBarChart2,
} from 'react-icons/fi';

const QuickActions = memo(function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5 font-display w-full md:w-auto">
      <button
        type="button"
        onClick={() => navigate('/admin/products/new')}
        className="inline-flex min-h-[42px] items-center justify-center sm:justify-start gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-2 text-xs font-black text-amber-950 shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all active:scale-[0.98] border border-amber-300/50"
      >
        <FiPlus className="h-4 w-4 stroke-[3]" />
        <span>Add Product</span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/admin/orders')}
        className="inline-flex min-h-[42px] items-center justify-center sm:justify-start gap-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-white/20 transition-all active:scale-[0.98]"
      >
        <FiShoppingCart className="h-4 w-4 text-amber-400" />
        <span>View Orders</span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/admin/coupons/new')}
        className="inline-flex min-h-[42px] items-center justify-center sm:justify-start gap-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-white/20 transition-all active:scale-[0.98]"
      >
        <FiTag className="h-4 w-4 text-amber-400" />
        <span>Create Coupon</span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/admin/analytics/sales')}
        className="inline-flex min-h-[42px] items-center justify-center sm:justify-start gap-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-white/20 transition-all active:scale-[0.98]"
      >
        <FiBarChart2 className="h-4 w-4 text-amber-400" />
        <span>Full Analytics</span>
      </button>
    </div>
  );
});

function StatCards({ overview, isLoading }) {
  const cards = useMemo(() => [
    {
      title: 'Total Devotees',
      value: overview?.totalCustomers ?? '—',
      icon: FiUser,
      change: '+12% this month',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
    {
      title: 'Active Customers',
      value: overview?.activeCustomers ?? '—',
      icon: FiCheckCircle,
      change: 'Active users',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      title: 'New Devotees Today',
      value: overview?.newCustomersToday ?? '—',
      icon: FiCalendar,
      change: 'Registered today',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    {
      title: 'Avg Order Value',
      value: overview?.averageCustomerSpend != null
        ? formatPrice(overview.averageCustomerSpend)
        : '—',
      icon: FiDollarSign,
      change: 'Per devotee spend',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    },
  ], [overview]);

  return (
    <div className="grid gap-3.5 sm:gap-4 grid-cols-2 lg:grid-cols-4 font-display">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-amber-50/20 to-stone-50/30 p-3.5 sm:p-4 lg:p-5 shadow-[0_4px_20px_rgba(44,40,36,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(217,119,6,0.12)] hover:border-amber-500/40 flex flex-col justify-between group"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            
            <div className="flex items-center justify-between gap-1.5 relative z-10">
              <div className={cn('flex h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 shrink-0 items-center justify-center rounded-xl border shadow-2xs', card.color)}>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold border truncate', card.badgeBg)}>
                {card.change}
              </span>
            </div>

            <div className="mt-3 relative z-10">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 font-display truncate">{card.title}</p>
              {isLoading ? (
                <Skeleton variant="text" className="h-6 sm:h-8 w-20 sm:w-24 mt-1" />
              ) : (
                <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-black text-amber-950 tracking-tight mt-0.5 truncate">{card.value}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SalesTimeRange = memo(function SalesTimeRange({ range, onChange }) {
  const ranges = ['daily', 'weekly', 'monthly', 'yearly'];
  return (
    <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 scrollbar-hide shrink-0" role="radiogroup" aria-label="Sales time range">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            'min-h-[30px] sm:min-h-[36px] shrink-0 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all focus:outline-none',
            range === r
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900',
          )}
          role="radio"
          aria-checked={range === r}
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
});

function SalesSection() {
  const [range, setRange] = useState('daily');
  const daily = useDailySales();
  const weekly = useWeeklySales();
  const monthly = useMonthlySales();
  const yearly = useYearlySales();

  const queries = { daily, weekly, monthly, yearly };
  const { data, isLoading, error, refetch } = queries[range];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 lg:p-6 shadow-xs font-display">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-slate-900">Sales Overview</h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Revenue trend analytics across time periods</p>
        </div>
        <SalesTimeRange range={range} onChange={setRange} />
      </div>
      <SalesChart
        data={data || []}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
      />
    </div>
  );
}

function TopSellingProductsSection() {
  const { data, isLoading, error, refetch } = useTopSellingProducts(5);
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 lg:p-6 font-display">
        <h3 className="font-serif text-base font-bold text-slate-900 mb-4">Top Selling Products</h3>
        <ErrorState title="Failed to load" message={getErrorMessage(error)} onRetry={refetch} className="py-8" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 lg:p-6 shadow-xs font-display">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900">Top Selling Products</h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Best performing catalog items</p>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => navigate('/admin/products')}
          rightIcon={<FiArrowRight className="h-3 w-3" />}
          className="text-amber-700 hover:text-amber-900 font-bold text-[11px] sm:text-xs"
        >
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2.5 sm:space-y-3" role="status" aria-label="Loading top products">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2.5 sm:gap-3">
              <Skeleton variant="circle" className="h-7 w-7 sm:h-9 sm:w-9 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton variant="text" className="w-36 max-w-full" />
                <Skeleton variant="text" className="w-24 max-w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-2">
          {data.map((product, index) => (
            <div
              key={product.id || index}
              className="flex items-center gap-2.5 sm:gap-3 rounded-xl border border-slate-100 p-2 sm:p-2.5 hover:border-amber-400/30 hover:bg-amber-50/30 cursor-pointer transition-all min-w-0"
              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/products/${product.id}/edit`); }}
            >
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-mono text-[11px] sm:text-xs font-bold text-amber-700">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  {product.unitsSold} units sold · {formatPrice(product.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-6 text-center">No sales data recorded yet</p>
      )}
    </div>
  );
}

function StockStatusSection() {
  const lowStock = useLowStockProducts(10);
  const outOfStock = useOutOfStockProducts();
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-display">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h3 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-slate-900">Inventory Health</h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Low and out of stock warnings</p>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => navigate('/admin/products')}
          rightIcon={<FiArrowRight className="h-3 w-3" />}
          className="text-amber-700 hover:text-amber-900 font-bold text-[11px] sm:text-xs"
        >
          Manage Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Low Stock */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-50/40 to-amber-500/5 p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <span className="text-xs sm:text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <FiAlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Low Stock
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-extrabold text-amber-800 border border-amber-500/30 font-mono shadow-2xs">
              {lowStock.data?.length ?? 0}
            </span>
          </div>
          {lowStock.isLoading ? (
            <Skeleton variant="text" className="h-10 sm:h-12 w-full" />
          ) : lowStock.data && lowStock.data.length > 0 ? (
            <div className="space-y-1.5 max-h-36 sm:max-h-40 overflow-y-auto custom-scrollbar">
              {lowStock.data.slice(0, 4).map((product, i) => (
                <div
                  key={product.id || i}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-2xs hover:bg-white hover:border-amber-400/40 cursor-pointer transition-all"
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                >
                  <span className="truncate flex-1 min-w-0 pr-2 font-semibold text-slate-800 text-[11px] sm:text-xs">{product.name}</span>
                  <span className="font-mono font-bold text-[10px] sm:text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/80 shrink-0">{product.stock} left</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 py-2">All products well stocked</p>
          )}
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-rose-50/40 to-rose-500/5 p-3 sm:p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <span className="text-xs sm:text-xs font-extrabold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <FiPackage className="h-3.5 w-3.5 text-rose-600 shrink-0" /> Out of Stock
            </span>
            <span className="inline-flex items-center rounded-full bg-rose-500/20 px-2 py-0.5 text-[11px] font-extrabold text-rose-800 border border-rose-500/30 font-mono shadow-2xs">
              {outOfStock.data?.length ?? 0}
            </span>
          </div>
          {outOfStock.isLoading ? (
            <Skeleton variant="text" className="h-10 sm:h-12 w-full" />
          ) : outOfStock.data && outOfStock.data.length > 0 ? (
            <div className="space-y-1.5 max-h-36 sm:max-h-40 overflow-y-auto custom-scrollbar">
              {outOfStock.data.slice(0, 4).map((product, i) => (
                <div
                  key={product.id || i}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/80 border border-slate-200/60 shadow-2xs hover:bg-white hover:border-rose-400/40 cursor-pointer transition-all"
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                >
                  <span className="truncate flex-1 min-w-0 pr-2 font-semibold text-slate-800 text-[11px] sm:text-xs">{product.name}</span>
                  <span className="font-mono font-bold text-[10px] sm:text-[11px] text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-200/80 shrink-0">0 left</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 py-2">No out of stock items</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentActivitySection() {
  const { data, isLoading, error, refetch } = useRecentActivity();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 lg:p-6 shadow-xs font-display">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900">Recent Admin Activity</h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Audit log of latest system actions</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2.5 sm:space-y-3" role="status" aria-label="Loading recent activity">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-2.5 sm:gap-3">
              <Skeleton variant="circle" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" />
              <div className="flex-1 space-y-1 min-w-0">
                <Skeleton variant="text" className="w-48 max-w-full" />
                <Skeleton variant="text" className="w-24 max-w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load activity" message={getErrorMessage(error)} onRetry={refetch} className="py-6" />
      ) : data && data.content && data.content.length > 0 ? (
        <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-72 overflow-y-auto custom-scrollbar">
          {data.content.map((activity, index) => (
            <div key={activity.id ? `activity-${activity.id}-${index}` : `act-${index}`} className="flex items-start gap-2.5 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 shrink-0">
                <FiInbox className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-900 break-words">{activity.description}</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono mt-0.5">
                  {activity.createdAt ? formatDate(activity.createdAt, { format: 'datetime' }) : ''}
                  {activity.type && ` · ${activity.type.replace(/_/g, ' ')}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-6 text-center">No recent activity recorded</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const refreshAnalytics = useRefreshAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const overview = useCustomerOverview();

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshAnalytics();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refreshAnalytics]);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-3.5 sm:space-y-5 lg:space-y-6 font-display">
        <Breadcrumb />

        {/* Luxury Executive Hero Welcome Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-stone-950 to-amber-900 p-5 sm:p-7 text-white shadow-xl overflow-hidden border border-amber-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 backdrop-blur-md border border-amber-400/30 font-heading">
                  <FiShield className="h-3 w-3" /> Enterprise Admin Console
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 font-body max-w-lg">
                Real-time enterprise metrics, catalog operations & sales performance analytics
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <QuickActions />
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-amber-400/20 backdrop-blur-md border border-amber-400/30 px-3.5 py-2 text-xs font-bold text-amber-300 shadow-xs hover:bg-amber-400/30 transition-all disabled:opacity-50 active:scale-[0.98] w-full sm:w-auto"
              >
                <FiRotateCw className={cn('h-4 w-4 text-amber-300', isRefreshing && 'animate-spin')} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* SaaS Stat Cards */}
        <StatCards overview={overview.data} isLoading={overview.isLoading} />

        {/* Sales Chart Section */}
        <SalesSection />

        {/* Top Products & Inventory Grid */}
        <div className="grid gap-3.5 sm:gap-5 lg:gap-6 lg:grid-cols-2">
          <TopSellingProductsSection />
          <StockStatusSection />
        </div>

        {/* Activity & Recent Actions */}
        <div className="grid gap-3.5 sm:gap-5 lg:gap-6 lg:grid-cols-1">
          <RecentActivitySection />
        </div>
      </div>
    </>
  );
}
