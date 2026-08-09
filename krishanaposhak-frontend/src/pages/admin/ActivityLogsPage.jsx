import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRecentActivity } from '@/hooks/useAnalytics';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Pagination from '@/components/navigation/Pagination';
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
    if (t.includes('ORDER')) return <FiShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />;
    if (t.includes('USER') || t.includes('CUSTOMER')) return <FiUserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />;
    if (t.includes('COUPON') || t.includes('TAG')) return <FiTag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />;
    return <FiActivity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />;
  };

  return (
    <>
      <Helmet>
        <title>Activity Logs - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-6 font-display min-w-0">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/60 pb-3.5 sm:pb-4 min-w-0">
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-2xl lg:text-3xl font-extrabold text-amber-950 tracking-tight truncate">
              System Audit & Activity Logs
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-xs text-stone-600 font-body truncate">
              Audit trail of order lifecycle updates, customer registrations, and catalog modifications
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50 min-h-[36px] sm:min-h-0 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <FiRefreshCw className={cn('h-3.5 w-3.5 text-amber-600', isFetching && 'animate-spin')} />
            <span>Refresh Audit Logs</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <FiFilter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Filter Event:</span>
          </div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none min-h-[38px] sm:min-h-0 min-w-0"
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
          <div className="p-8 sm:p-12 text-center bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 min-w-0">
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
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-6 min-w-0 overflow-hidden">
            <div className="relative space-y-5 sm:space-y-6 min-w-0">
              {/* Connecting line behind timeline icons */}
              {activities.length > 1 && (
                <div className="absolute left-[13px] sm:left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 z-0 pointer-events-none" />
              )}

              {activities.map((act, index) => (
                <div key={act.id ? `activity-${act.id}-${index}` : `act-${index}`} className="relative flex items-start gap-3 sm:gap-4 z-10 min-w-0 group">
                  {/* Timeline icon badge flex item - 100% immune to text overlap */}
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white border-2 border-amber-500 shadow-2xs shrink-0 z-10 mt-0.5">
                    {getActivityIcon(act.type)}
                  </div>

                  {/* Content details flex-1 */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 min-w-0">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed break-words">
                          {act.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 min-w-0">
                          {act.type && (
                            <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-800 uppercase tracking-wider shrink-0">
                              {act.type.replace(/_/g, ' ')}
                            </span>
                          )}
                          {act.entityType && (
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-full">
                              {act.entityType} #{act.entityId || ''} {act.entityName ? `(${act.entityName})` : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0 self-start sm:self-auto mt-0.5 sm:mt-0">
                        <FiClock className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{act.createdAt ? formatDate(act.createdAt, { format: 'datetime' }) : 'Just now'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end pt-3 sm:pt-4 border-t border-slate-100 min-w-0">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
