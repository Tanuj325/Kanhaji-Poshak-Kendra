import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  useDailySales,
  useWeeklySales,
  useMonthlySales,
  useYearlySales,
  useCustomSales,
  useRefreshAnalytics,
} from '@/hooks/useAnalytics';
import { SalesChart } from '@/components/charts';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Input from '@/components/forms/Input';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { cn } from '@/utils/cn';
import {
  FiRotateCw,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiCalendar,
  FiBarChart2,
} from 'react-icons/fi';

const RANGES = [
  { id: 'daily', label: 'Today' },
  { id: 'weekly', label: 'Last 7 Days' },
  { id: 'monthly', label: 'Last 30 Days' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'custom', label: 'Custom Range' },
];

export default function SalesAnalyticsPage() {
  const [range, setRange] = useState('daily');
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAnalytics = useRefreshAnalytics();

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshAnalytics();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refreshAnalytics]);

  const dailyQuery = useDailySales();
  const weeklyQuery = useWeeklySales();
  const monthlyQuery = useMonthlySales();
  const yearlyQuery = useYearlySales();

  const formattedStartISO = startDateStr ? new Date(startDateStr).toISOString() : '';
  const formattedEndISO = endDateStr ? new Date(endDateStr + 'T23:59:59').toISOString() : '';

  const customQuery = useCustomSales(formattedStartISO, formattedEndISO);

  const currentQuery = useMemo(() => {
    switch (range) {
      case 'weekly':
        return weeklyQuery;
      case 'monthly':
        return monthlyQuery;
      case 'yearly':
        return yearlyQuery;
      case 'custom':
        return customQuery;
      case 'daily':
      default:
        return dailyQuery;
    }
  }, [range, dailyQuery, weeklyQuery, monthlyQuery, yearlyQuery, customQuery]);

  const salesData = currentQuery.data || [];
  const isLoading = currentQuery.isLoading;
  const error = currentQuery.error;

  const totals = useMemo(() => {
    if (!salesData || !Array.isArray(salesData) || salesData.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
    }
    const rev = salesData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
    const ord = salesData.reduce((acc, curr) => acc + (curr.orders || 0), 0);
    const avg = ord > 0 ? rev / ord : 0;
    return { totalRevenue: rev, totalOrders: ord, avgOrderValue: avg };
  }, [salesData]);

  return (
    <>
      <Helmet>
        <title>Sales Analytics - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Sales & Revenue Analytics
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Backend-powered financial and order volume breakdown
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <FiRotateCw className={cn('h-3.5 w-3.5 text-amber-600', isRefreshing && 'animate-spin')} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Date Range Selector Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl" role="radiogroup" aria-label="Sales date range filter">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg transition-all focus:outline-none',
                    range === r.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  )}
                  role="radio"
                  aria-checked={range === r.id}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {range === 'custom' && (
              <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <FiCalendar className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-slate-700">From:</span>
                  <Input
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="py-1 px-2 text-xs bg-white"
                    aria-label="Start Date"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">To:</span>
                  <Input
                    type="date"
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="py-1 px-2 text-xs bg-white"
                    aria-label="End Date"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Revenue
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <FiDollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <Skeleton variant="text" className="h-8 w-28" />
              ) : (
                <p className="font-serif text-2xl font-bold text-slate-900">{formatPrice(totals.totalRevenue)}</p>
              )}
              <p className="mt-1 text-[11px] text-slate-400">Total gross revenue</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Orders
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <FiShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <Skeleton variant="text" className="h-8 w-20" />
              ) : (
                <p className="font-serif text-2xl font-bold text-slate-900">{totals.totalOrders.toLocaleString()}</p>
              )}
              <p className="mt-1 text-[11px] text-slate-400">Completed transactions</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Avg Order Value
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
                <FiTrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <Skeleton variant="text" className="h-8 w-24" />
              ) : (
                <p className="font-serif text-2xl font-bold text-slate-900">{formatPrice(totals.avgOrderValue)}</p>
              )}
              <p className="mt-1 text-[11px] text-slate-400">AOV per transaction</p>
            </div>
          </div>
        </div>

        {/* Main Revenue Trend Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Revenue Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Filtered period: <span className="font-semibold text-amber-700">{RANGES.find((r) => r.id === range)?.label}</span>
              </p>
            </div>
          </div>
          <SalesChart
            data={salesData}
            isLoading={isLoading}
            error={error ? getErrorMessage(error) : null}
            onRetry={currentQuery.refetch}
          />
        </div>

        {/* Sales Breakdown Data Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-bold text-slate-900">Sales Period Breakdown</h3>
            <span className="text-xs font-semibold text-slate-500">{salesData.length} records</span>
          </div>

          {isLoading ? (
            <div className="space-y-3" role="status" aria-label="Loading sales breakdown table">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <Skeleton variant="text" className="w-28" />
                  <Skeleton variant="text" className="w-20" />
                  <Skeleton variant="text" className="w-24" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load breakdown"
              message={getErrorMessage(error)}
              onRetry={currentQuery.refetch}
              className="py-8"
            />
          ) : salesData.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs" aria-label="Sales breakdown details">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200/80">
                  <tr>
                    <th scope="col" className="py-3 px-4">Period / Date</th>
                    <th scope="col" className="py-3 px-4 text-right">Completed Orders</th>
                    <th scope="col" className="py-3 px-4 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.label}</td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-600">{row.orders ?? 0}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                        {formatPrice(row.revenue ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-8 text-center">
              No sales data found for the selected period.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
