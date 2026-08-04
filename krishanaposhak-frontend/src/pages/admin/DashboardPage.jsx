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
    <div className="flex flex-wrap items-center gap-2 font-display">
      <button
        type="button"
        onClick={() => navigate('/admin/products/new')}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-all active:scale-[0.98]"
      >
        <FiPlus className="h-4 w-4" />
        <span>Add Product</span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/admin/orders')}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
      >
        <FiShoppingCart className="h-4 w-4 text-amber-600" />
        <span>View Orders</span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/admin/coupons/new')}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
      >
        <FiTag className="h-4 w-4 text-amber-600" />
        <span>Create Coupon</span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/admin/analytics/sales')}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all"
      >
        <FiBarChart2 className="h-4 w-4 text-amber-600" />
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
    },
    {
      title: 'Active Customers',
      value: overview?.activeCustomers ?? '—',
      icon: FiCheckCircle,
      change: 'Active users',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    },
    {
      title: 'New Devotees Today',
      value: overview?.newCustomersToday ?? '—',
      icon: FiCalendar,
      change: 'Registered today',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    {
      title: 'Avg Order Value',
      value: overview?.averageCustomerSpend != null
        ? formatPrice(overview.averageCustomerSpend)
        : '—',
      icon: FiDollarSign,
      change: 'Per devotee spend',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
  ], [overview]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-display">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl border', card.color)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <Skeleton variant="text" className="h-8 w-24" />
              ) : (
                <p className="font-serif text-2xl font-bold text-slate-900">{card.value}</p>
              )}
              <p className="mt-1 text-[11px] font-medium text-slate-400">{card.change}</p>
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
    <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 scrollbar-hide" role="radiogroup" aria-label="Sales time range">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            'min-h-[36px] shrink-0 px-3 py-1 text-xs font-bold rounded-lg transition-all focus:outline-none',
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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Sales Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Revenue trend analytics across time periods</p>
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
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 font-display">
        <h3 className="font-serif text-base font-bold text-slate-900 mb-4">Top Selling Products</h3>
        <ErrorState title="Failed to load" message={getErrorMessage(error)} onRetry={refetch} className="py-8" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-serif text-base font-bold text-slate-900">Top Selling Products</h3>
          <p className="text-xs text-slate-500 mt-0.5">Best performing catalog items</p>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => navigate('/admin/products')}
          rightIcon={<FiArrowRight className="h-3 w-3" />}
          className="text-amber-700 hover:text-amber-900 font-bold"
        >
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading top products">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="circle" className="h-9 w-9" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" className="w-36" />
                <Skeleton variant="text" className="w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-2">
          {data.map((product, index) => (
            <div
              key={product.id || index}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 hover:border-amber-400/30 hover:bg-amber-50/30 cursor-pointer transition-all"
              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/products/${product.id}/edit`); }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-mono text-xs font-bold text-amber-700">
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-serif text-base font-bold text-slate-900">Inventory Health</h3>
          <p className="text-xs text-slate-500 mt-0.5">Low and out of stock warnings</p>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => navigate('/admin/products')}
          rightIcon={<FiArrowRight className="h-3 w-3" />}
          className="text-amber-700 hover:text-amber-900 font-bold"
        >
          Manage Stock
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Low Stock */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <FiAlertCircle className="h-3.5 w-3.5 text-amber-600" /> Low Stock
            </span>
            <Badge variant="warning">{lowStock.data?.length ?? 0}</Badge>
          </div>
          {lowStock.isLoading ? (
            <Skeleton variant="text" className="h-12 w-full" />
          ) : lowStock.data && lowStock.data.length > 0 ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
              {lowStock.data.slice(0, 4).map((product, i) => (
                <div
                  key={product.id || i}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-amber-500/10 cursor-pointer"
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                >
                  <span className="truncate max-w-[140px] font-medium text-slate-800">{product.name}</span>
                  <span className="font-mono font-bold text-amber-700">{product.stock} left</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">All products well stocked</p>
          )}
        </div>

        {/* Out of Stock */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <FiPackage className="h-3.5 w-3.5 text-rose-600" /> Out of Stock
            </span>
            <Badge variant="danger">{outOfStock.data?.length ?? 0}</Badge>
          </div>
          {outOfStock.isLoading ? (
            <Skeleton variant="text" className="h-12 w-full" />
          ) : outOfStock.data && outOfStock.data.length > 0 ? (
            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
              {outOfStock.data.slice(0, 4).map((product, i) => (
                <div
                  key={product.id || i}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                >
                  <span className="truncate max-w-[140px] font-medium text-slate-800">{product.name}</span>
                  <span className="font-mono font-bold text-rose-600">0 left</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">No out of stock items</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentActivitySection() {
  const { data, isLoading, error, refetch } = useRecentActivity();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-serif text-base font-bold text-slate-900">Recent Admin Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Audit log of latest system actions</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading recent activity">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton variant="circle" className="h-8 w-8" />
              <div className="flex-1 space-y-1">
                <Skeleton variant="text" className="w-48" />
                <Skeleton variant="text" className="w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load activity" message={getErrorMessage(error)} onRetry={refetch} className="py-6" />
      ) : data && data.content && data.content.length > 0 ? (
        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
          {data.content.map((activity, index) => (
            <div key={activity.id ? `activity-${activity.id}-${index}` : `act-${index}`} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 shrink-0">
                <FiInbox className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900">{activity.description}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
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

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Real-time enterprise metrics & catalog operations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <QuickActions />
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <FiRotateCw className={cn('h-3.5 w-3.5 text-amber-600', isRefreshing && 'animate-spin')} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* SaaS Stat Cards */}
        <StatCards overview={overview.data} isLoading={overview.isLoading} />

        {/* Sales Chart Section */}
        <SalesSection />

        {/* Top Products & Inventory Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TopSellingProductsSection />
          <StockStatusSection />
        </div>

        {/* Activity & Recent Actions */}
        <div className="grid gap-6 lg:grid-cols-1">
          <RecentActivitySection />
        </div>
      </div>
    </>
  );
}
