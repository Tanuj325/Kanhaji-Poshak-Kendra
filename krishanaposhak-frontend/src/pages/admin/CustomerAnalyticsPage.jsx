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
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 font-display">
        <ErrorState title="Failed to load devotee metrics" message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-display">
      {isLoading
        ? [1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rect" className="h-28 rounded-2xl" />)
        : cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-2xl font-bold text-slate-900">{card.value}</p>
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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display space-y-4">
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading customer table">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
              <Skeleton variant="text" className="w-40" />
              <Skeleton variant="text" className="w-48" />
              <Skeleton variant="text" className="w-24" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load user list" message={getErrorMessage(error)} onRetry={refetch} className="py-8" />
      ) : content.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs" aria-label="Customer Analytics Data">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200/80">
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
        <p className="text-xs text-slate-400 py-8 text-center">No devotee records found for this view.</p>
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

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Devotee & Customer Analytics
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Acquisition metrics, spending tiers, order frequency, and retention
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <FiRotateCw className={cn('h-3.5 w-3.5 text-amber-600', isRefreshing && 'animate-spin')} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Customer Overview Metrics */}
        <CustomerOverviewSection />

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6 overflow-x-auto custom-scrollbar pb-1" aria-label="Customer Analytics Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'whitespace-nowrap py-3 px-1 border-b-2 text-xs font-bold transition-all focus:outline-none',
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
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
