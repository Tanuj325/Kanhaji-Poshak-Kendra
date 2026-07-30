import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRecentActivity } from '@/hooks/useAnalytics';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Pagination from '@/components/navigation/Pagination';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatDate } from '@/utils/formatDate';
import { getErrorMessage } from '@/utils/apiErrorParser';
import {
  FiActivity,
  FiShoppingBag,
  FiUserCheck,
  FiTag,
  FiFilter,
  FiRefreshCw,
  FiClock,
  FiShield,
} from 'react-icons/fi';
import { cn } from '@/utils/cn';

const ACTIVITY_TYPES = [
  { label: 'All Activity Events', value: '' },
  { label: 'Order Placed', value: 'ORDER_PLACED' },
  { label: 'Payment Success', value: 'PAYMENT_SUCCESS' },
  { label: 'Order Status Updated', value: 'ORDER_STATUS_UPDATED' },
  { label: 'Product Updated', value: 'PRODUCT_UPDATED' },
  { label: 'User Registered', value: 'USER_REGISTERED' },
];

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState('');

  const { data, isLoading, isError, error, refetch, isFetching } = useRecentActivity({
    page: page - 1,
    size: 20,
    type: selectedType || undefined,
  });

  const activities = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const getActivityIcon = (type = '') => {
    const t = type.toUpperCase();
    if (t.includes('ORDER')) return <FiShoppingBag className="h-4 w-4 text-blue-600" />;
    if (t.includes('USER') || t.includes('CUSTOMER')) return <FiUserCheck className="h-4 w-4 text-emerald-600" />;
    if (t.includes('COUPON') || t.includes('TAG')) return <FiTag className="h-4 w-4 text-purple-600" />;
    return <FiActivity className="h-4 w-4 text-amber-600" />;
  };

  return (
    <>
      <Helmet>
        <title>Activity Logs - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
              System Audit & Activity Logs
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Audit trail of order lifecycle updates, customer registrations, and catalog modifications
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <FiRefreshCw className={cn('h-3.5 w-3.5 text-amber-600', isFetching && 'animate-spin')} />
            <span>Refresh Audit Logs</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Event:</span>
          </div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Log Timeline */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
            <Spinner label="Loading audit logs..." />
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load activity logs"
            message={getErrorMessage(error)}
            onRetry={refetch}
          />
        ) : activities.length === 0 ? (
          <EmptyState
            title="No activity logs recorded"
            message="No system activity events match the selected filter criteria."
          />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
              {activities.map((act, index) => (
                <div key={act.id ? `activity-${act.id}-${index}` : `act-${index}`} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[33px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-amber-500 shadow-xs">
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        {act.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {act.type && (
                          <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                            {act.type.replace(/_/g, ' ')}
                          </span>
                        )}
                        {act.entityType && (
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                            {act.entityType} #{act.entityId || ''} {act.entityName ? `(${act.entityName})` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono shrink-0">
                      <FiClock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{act.createdAt ? formatDate(act.createdAt, { format: 'datetime' }) : 'Just now'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
