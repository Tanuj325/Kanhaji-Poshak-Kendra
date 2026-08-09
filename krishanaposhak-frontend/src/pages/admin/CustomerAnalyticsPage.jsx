import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  useCustomerOverview,
  useNewCustomers,
  useRepeatCustomers,
  useInactiveCustomers,
  useRecentCustomers,
  useTopSpenders,
  useRefreshAnalytics,
} from '@/hooks/useAnalytics';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Pagination from '@/components/navigation/Pagination';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { cn } from '@/utils/cn';
import {
  FiRotateCw,
  FiUser,
  FiUserCheck,
  FiUserPlus,
  FiDollarSign,
  FiShoppingCart,
  FiCalendar,
} from 'react-icons/fi';

const TABS = [
  { id: 'top-spenders', label: 'Top Spenders' },
  { id: 'new', label: 'New Devotees (7 Days)' },
  { id: 'repeat', label: 'Repeat Customers' },
  { id: 'recent', label: 'Recent Registrations' },
  { id: 'inactive', label: 'Inactive Devotees (30 Days)' },
];

function CustomerOverviewSection() {
  const { data: overview, isLoading, error, refetch } = useCustomerOverview();

  const cards = useMemo(() => {
    if (!overview) return [];
    return [
      { title: 'Total Devotees', value: overview.totalCustomers ?? '—', icon: FiUser },
      { title: 'Active Devotees', value: overview.activeCustomers ?? '—', icon: FiUserCheck },
      { title: 'New Today', value: overview.newCustomersToday ?? '—', icon: FiUserPlus },
      { title: 'New This Week', value: overview.newCustomersThisWeek ?? '—', icon: FiCalendar },
      { title: 'Repeat Buyers', value: overview.repeatCustomers ?? '—', icon: FiUserCheck },
      { title: 'Avg Orders / Devotee', value: overview.averageOrdersPerCustomer != null ? Number(overview.averageOrdersPerCustomer).toFixed(1) : '—', icon: FiShoppingCart },
      { title: 'Avg Spend / Devotee', value: overview.averageCustomerSpend != null ? formatPrice(overview.averageCustomerSpend) : '—', icon: FiDollarSign },
    ];
  }, [overview]);

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 font-display min-w-0">
        <ErrorState title="Failed to load devotee metrics" message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 font-display min-w-0">
      {isLoading
        ? [1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rect" className="h-24 rounded-xl" />)
        : cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 truncate">{card.title}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-2 font-serif text-lg sm:text-xl font-bold text-slate-900 truncate">{card.value}</p>
              </div>
            );
          })}
    </div>
  );
}

function CustomerListSection({ activeTab }) {
  const [page, setPage] = useState(0);
  const size = 15;
  const navigate = useNavigate();

  const params = useMemo(() => ({ page, size }), [page, size]);

  const newQuery = useNewCustomers(params);
  const repeatQuery = useRepeatCustomers(params);
  const inactiveQuery = useInactiveCustomers(params);
  const recentQuery = useRecentCustomers(params);
  const topSpendersQuery = useTopSpenders(params);

  const currentQuery = useMemo(() => {
    switch (activeTab) {
      case 'new': return newQuery;
      case 'repeat': return repeatQuery;
      case 'inactive': return inactiveQuery;
      case 'recent': return recentQuery;
      case 'top-spenders':
      default: return topSpendersQuery;
    }
  }, [activeTab, newQuery, repeatQuery, inactiveQuery, recentQuery, topSpendersQuery]);

  const { data: pageData, isLoading, error, refetch } = currentQuery;
  const content = pageData?.content || [];
  const totalPages = pageData?.totalPages || 1;

  return (
    <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-2xs font-display space-y-4 min-w-0">
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading customer table">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
              <Skeleton variant="text" className="w-36" />
              <Skeleton variant="text" className="w-44" />
              <Skeleton variant="text" className="w-20" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load user list" message={getErrorMessage(error)} onRetry={refetch} className="py-6" />
      ) : content.length > 0 ? (
        <div className="space-y-4 min-w-0">
          {/* Mobile & Tablet Card Grid (<1024px) */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {content.map((user) => {
              const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Devotee Customer';
              return (
                <div
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-amber-300/90 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-2.5 min-w-0 group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/users/${user.id}`); }}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight truncate group-hover:text-amber-900 transition-colors">
                      {name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shrink-0">
                      {user.orderCount ?? user.totalOrders ?? 0} orders
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                    {user.phoneNumber && (
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user.phoneNumber}</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between border border-slate-100 text-xs min-w-0">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lifetime Spend</span>
                      <span className="font-mono font-bold text-amber-700 text-xs sm:text-sm">
                        {user.totalSpent != null ? formatPrice(user.totalSpent) : '—'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        {activeTab === 'top-spenders' || activeTab === 'repeat' ? 'Last Order' : 'Registered'}
                      </span>
                      <span className="font-mono text-[11px] text-slate-600">
                        {user.lastOrderDate
                          ? formatDate(user.lastOrderDate, { format: 'date' })
                          : user.createdAt
                          ? formatDate(user.createdAt, { format: 'date' })
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>=1024px) */}
          <div className="hidden lg:block overflow-x-auto custom-scrollbar rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs" aria-label="Customer Analytics Data">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th scope="col" className="py-3 px-4">Devotee Name</th>
                  <th scope="col" className="py-3 px-4">Contact Info</th>
                  <th scope="col" className="py-3 px-4 text-center">Total Orders</th>
                  <th scope="col" className="py-3 px-4 text-right">Lifetime Spend</th>
                  <th scope="col" className="py-3 px-4 text-right">
                    {activeTab === 'top-spenders' || activeTab === 'repeat' ? 'Last Order' : 'Registered Date'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {content.map((user) => {
                  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Devotee Customer';
                  return (
                    <tr
                      key={user.id}
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/users/${user.id}`); }}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{name}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {user.email}
                        {user.phoneNumber && <span className="block text-[11px] text-slate-400 font-sans">{user.phoneNumber}</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {user.orderCount ?? user.totalOrders ?? '0'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                        {user.totalSpent != null ? formatPrice(user.totalSpent) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        {user.lastOrderDate
                          ? formatDate(user.lastOrderDate, { format: 'date' })
                          : user.createdAt
                          ? formatDate(user.createdAt, { format: 'date' })
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-end pt-2">
              <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-6 text-center">No devotee records found for this view.</p>
      )}
    </div>
  );
}

export default function CustomerAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('top-spenders');
  const refreshAnalytics = useRefreshAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshAnalytics();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refreshAnalytics]);

  return (
    <>
      <Helmet>
        <title>Customer Analytics - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-5 font-display min-w-0">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/60 pb-3.5 sm:pb-4">
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight truncate">
              Devotee & Customer Analytics
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500 font-body">
              Acquisition metrics, spending tiers, order frequency, and retention
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50 min-h-[36px] sm:min-h-0 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <FiRotateCw className={cn('h-3.5 w-3.5 text-amber-600', isRefreshing && 'animate-spin')} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Customer Overview Metrics */}
        <CustomerOverviewSection />

        {/* Tab Navigation */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-2 sm:p-2.5 shadow-2xs min-w-0">
          <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg overflow-x-auto custom-scrollbar max-w-full min-w-0" aria-label="Customer Analytics Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-md transition-all focus:outline-none whitespace-nowrap shrink-0 cursor-pointer min-h-[34px] sm:min-h-0',
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                )}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Table */}
        <CustomerListSection activeTab={activeTab} />
      </div>
    </>
  );
}
