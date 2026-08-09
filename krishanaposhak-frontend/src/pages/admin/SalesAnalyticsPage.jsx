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

      <div className="space-y-4 sm:space-y-5 font-display min-w-0">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/60 pb-3.5 sm:pb-4">
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight truncate">
              Sales & Revenue Analytics
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500 font-body">
              Backend-powered financial and order volume breakdown
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50 min-h-[36px] sm:min-h-0 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <FiRotateCw className={cn('h-3.5 w-3.5 text-amber-600', isRefreshing && 'animate-spin')} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Date Range Selector Bar */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3 shadow-2xs min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg overflow-x-auto custom-scrollbar max-w-full min-w-0" role="radiogroup" aria-label="Sales date range filter">
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-bold rounded-md transition-all focus:outline-none whitespace-nowrap shrink-0 cursor-pointer min-h-[32px] sm:min-h-0',
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FiCalendar className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-600 shrink-0">From:</span>
                  <Input
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="py-1 px-2 text-[11px] bg-white min-h-[34px] sm:min-h-0 rounded-md"
                    aria-label="Start Date"
                  />
                </div>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-semibold text-slate-600 shrink-0">To:</span>
                  <Input
                    type="date"
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="py-1 px-2 text-[11px] bg-white min-h-[34px] sm:min-h-0 rounded-md"
                    aria-label="End Date"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metric Summary Cards (KPI Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 min-w-0">
          {/* Total Revenue */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Total Revenue
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                <FiDollarSign className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 min-w-0">
              {isLoading ? (
                <Skeleton variant="text" className="h-7 w-24" />
              ) : (
                <p className="font-serif text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {formatPrice(totals.totalRevenue)}
                </p>
              )}
              <p className="mt-0.5 text-[10px] text-slate-400">Total gross revenue</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Total Orders
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                <FiShoppingCart className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 min-w-0">
              {isLoading ? (
                <Skeleton variant="text" className="h-7 w-16" />
              ) : (
                <p className="font-serif text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {totals.totalOrders.toLocaleString()}
                </p>
              )}
              <p className="mt-0.5 text-[10px] text-slate-400">Completed transactions</p>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Avg Order Value
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20 shrink-0">
                <FiTrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 min-w-0">
              {isLoading ? (
                <Skeleton variant="text" className="h-7 w-20" />
              ) : (
                <p className="font-serif text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {formatPrice(totals.avgOrderValue)}
                </p>
              )}
              <p className="mt-0.5 text-[10px] text-slate-400">AOV per transaction</p>
            </div>
          </div>
        </div>

        {/* Main Revenue Trend Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-3 min-w-0">
            <div className="min-w-0">
              <h3 className="font-heading text-sm font-bold text-slate-900 truncate">Revenue Trend</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                Period: <span className="font-semibold text-amber-700">{RANGES.find((r) => r.id === range)?.label}</span>
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
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-3 min-w-0">
            <h3 className="font-heading text-sm font-bold text-slate-900 truncate">Sales Period Breakdown</h3>
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">{salesData.length} records</span>
          </div>

          {isLoading ? (
            <div className="space-y-2.5" role="status" aria-label="Loading sales breakdown table">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <Skeleton variant="text" className="w-24" />
                  <Skeleton variant="text" className="w-16" />
                  <Skeleton variant="text" className="w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load breakdown"
              message={getErrorMessage(error)}
              onRetry={currentQuery.refetch}
              className="py-6"
            />
          ) : salesData.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar rounded-lg border border-slate-100">
              <table className="w-full text-left text-xs" aria-label="Sales breakdown details">
                <thead className="bg-slate-50 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th scope="col" className="py-2.5 px-3 sm:px-3.5">Period / Date</th>
                    <th scope="col" className="py-2.5 px-3 sm:px-3.5 text-right">Completed Orders</th>
                    <th scope="col" className="py-2.5 px-3 sm:px-3.5 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {salesData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 sm:px-3.5 font-semibold text-slate-900 whitespace-nowrap">{row.label}</td>
                      <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono font-medium text-slate-600">{row.orders ?? 0}</td>
                      <td className="py-2.5 px-3 sm:px-3.5 text-right font-mono font-bold text-amber-700 whitespace-nowrap">
                        {formatPrice(row.revenue ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No sales data found for the selected period.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
