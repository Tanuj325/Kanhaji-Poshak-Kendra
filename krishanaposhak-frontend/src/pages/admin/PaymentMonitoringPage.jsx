import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { paymentService } from '@/services';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/utils/cn';
import {
  FiRefreshCw,
  FiSearch,
  FiDownload,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiXCircle,
  FiShield,
  FiRepeat,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PaymentMonitoringPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchMonitoringData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await paymentService.getAdminMonitoringData({
        status: statusFilter,
        search: search || undefined,
        page,
        size,
      });
      setData(res?.data || res);
    } catch (err) {
      toast.error('Failed to load payment monitoring telemetry');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search, page, size]);

  useEffect(() => {
    fetchMonitoringData();
  }, [fetchMonitoringData]);

  const handleAction = async (actionFn, successMsg) => {
    if (isProcessingAction) return;
    setIsProcessingAction(true);
    try {
      const res = await actionFn();
      toast.success(res?.data || successMsg);
      await fetchMonitoringData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleExportCSV = () => {
    if (!data?.records || data.records.length === 0) {
      toast.error('No payment records to export');
      return;
    }

    const headers = [
      'Payment ID',
      'Order Number',
      'Customer Name',
      'Email',
      'Method',
      'Payment Status',
      'Order Status',
      'Amount (INR)',
      'Razorpay Order ID',
      'Razorpay Payment ID',
      'Refund Status',
      'Retry Count',
      'Created At',
    ];

    const rows = data.records.map((r) => [
      r.paymentId,
      r.orderNumber,
      `"${r.customerName}"`,
      r.customerEmail,
      r.paymentMethod,
      r.paymentStatus,
      r.orderStatus,
      r.amount,
      r.razorpayOrderId || '',
      r.razorpayPaymentId || '',
      r.refundStatus || '',
      r.retryCount || 0,
      r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payment_monitoring_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Payment telemetry exported to CSV');
  };

  return (
    <>
      <Helmet>
        <title>Payment Monitoring & Recovery | Admin Portal</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-6 font-display min-w-0">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-3.5 sm:pb-4 min-w-0">
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-xl lg:text-3xl font-extrabold text-amber-950 flex items-center gap-2 tracking-tight truncate">
              <FiShield className="text-amber-800 shrink-0" />
              <span className="truncate">Payment & Refund Monitoring</span>
            </h1>
            <p className="mt-0.5 text-[11px] sm:text-sm text-stone-600 font-body truncate">
              Enterprise payment reconciliation, automated refund retries, and transaction telemetry
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center min-w-0 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(paymentService.triggerReconciliation, 'Reconciliation job triggered')}
              disabled={isProcessingAction}
              className="flex items-center justify-center gap-1 text-xs min-h-[36px] sm:min-h-0"
            >
              <FiRefreshCw className={isProcessingAction ? 'animate-spin' : ''} /> Run Reconciliation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(paymentService.triggerRefundRetry, 'Refund retry job triggered')}
              disabled={isProcessingAction}
              className="flex items-center justify-center gap-1 text-xs min-h-[36px] sm:min-h-0"
            >
              <FiRepeat /> Retry Refunds
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction(paymentService.triggerCleanup, 'Cleanup job triggered')}
              disabled={isProcessingAction}
              className="flex items-center justify-center gap-1 text-xs text-amber-700 border-amber-300 hover:bg-amber-50 min-h-[36px] sm:min-h-0"
            >
              <FiClock /> Cleanup Expired
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 min-h-[36px] sm:min-h-0"
            >
              <FiDownload /> Export CSV
            </Button>
          </div>
        </div>

        {/* Telemetry Cards */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 min-w-0">
            <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-2xs min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 block truncate">Total Payments</span>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 truncate">{data.totalPayments}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 sm:p-4 shadow-2xs min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-amber-700 flex items-center gap-1 truncate">
                <FiClock className="shrink-0" /> Pending
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-amber-800 mt-1 truncate">{data.pendingPayments}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 sm:p-4 shadow-2xs min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 flex items-center gap-1 truncate">
                <FiCheckCircle className="shrink-0" /> Captured
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-800 mt-1 truncate">{data.capturedPayments}</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 sm:p-4 shadow-2xs min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-blue-700 flex items-center gap-1 truncate">
                <FiRefreshCw className="shrink-0" /> Recovered
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-blue-800 mt-1 truncate">{data.recoveredPayments}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 sm:p-4 shadow-2xs min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-rose-700 flex items-center gap-1 truncate">
                <FiXCircle className="shrink-0" /> Failed / Unpaid
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-rose-800 mt-1 truncate">{data.webhookFailed}</p>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3 sm:p-4 shadow-2xs min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-purple-700 flex items-center gap-1 truncate">
                <FiAlertTriangle className="shrink-0" /> Refund Pending
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-purple-800 mt-1 truncate">{data.refundPending}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 sm:p-4 shadow-2xs min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-red-700 flex items-center gap-1 truncate">
                <FiRepeat className="shrink-0" /> Refund Failed
              </span>
              <p className="text-lg sm:text-xl font-extrabold text-red-800 mt-1 truncate">{data.refundFailed}</p>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 rounded-xl bg-white p-2.5 sm:p-4 shadow-2xs border border-slate-200 min-w-0">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-1 bg-slate-100/80 rounded-xl max-w-full min-w-0" role="radiogroup" aria-label="Payment status filters">
            {['ALL', 'PENDING', 'PAID', 'FAILED', 'REFUND_PENDING', 'REFUNDED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(0);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-h-[32px] sm:min-h-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                role="radio"
                aria-checked={statusFilter === st}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64 min-w-0">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search order #, email, TXN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none min-h-[38px] sm:min-h-0 transition-all"
            />
          </div>
        </div>

        {/* Data Container */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xs min-w-0 overflow-hidden">
          {isLoading ? (
            <div className="p-8 sm:p-12 text-center min-w-0">
              <Spinner className="mx-auto" />
              <p className="mt-2 text-xs text-slate-500">Loading payment telemetry...</p>
            </div>
          ) : !data?.records || data.records.length === 0 ? (
            <EmptyState
              title="No Payment Records Found"
              description="No payments match your current filter or search criteria."
            />
          ) : (
            <>
              {/* Mobile & Tablet Payment Cards View (< 1024px) */}
              <div className="lg:hidden divide-y divide-slate-100 p-3 sm:p-4 space-y-3 sm:space-y-3.5 min-w-0">
                {data.records.map((row) => (
                  <div key={row.paymentId} className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs space-y-2.5 min-w-0">
                    {/* TOP BAR: Order Number & Payment Status */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 min-w-0">
                      <span className="font-bold text-indigo-600 text-xs sm:text-sm font-mono truncate">
                        Order #{row.orderNumber}
                      </span>

                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0',
                          row.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.paymentStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : row.paymentStatus === 'REFUNDED'
                            ? 'bg-blue-100 text-blue-800'
                            : row.paymentStatus === 'REFUND_PENDING'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        )}
                      >
                        {row.paymentStatus}
                      </span>
                    </div>

                    {/* MIDDLE ROW: Customer Info & Amount */}
                    <div className="flex items-start justify-between gap-3 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{row.customerName}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{row.customerEmail}</p>
                        <div className="flex items-center gap-2 mt-1 min-w-0">
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                            {row.paymentMethod}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0',
                              row.orderStatus === 'CONFIRMED' || row.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : row.orderStatus === 'PENDING'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            {row.orderStatus}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-900 text-sm sm:text-base block">
                          {formatPrice(row.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM METADATA BOX: Refund & Razorpay Telemetry */}
                    <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 space-y-1 text-[10px] min-w-0">
                      {row.refundStatus !== 'NONE' && (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold text-purple-700 shrink-0">Refund: {row.refundStatus}</span>
                          {row.retryCount > 0 && (
                            <span className="rounded bg-purple-100 px-1 text-[9px] text-purple-800 shrink-0">
                              Retry #{row.retryCount}
                            </span>
                          )}
                          {row.failureReason && (
                            <span className="text-rose-600 truncate" title={row.failureReason}>
                              ({row.failureReason})
                            </span>
                          )}
                        </div>
                      )}
                      <div className="font-mono text-slate-500 space-y-0.5 min-w-0">
                        <p className="truncate"><span className="text-slate-400">Ord:</span> {row.razorpayOrderId || 'N/A'}</p>
                        <p className="truncate"><span className="text-slate-400">Pmt:</span> {row.razorpayPaymentId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= 1024px) - EXACT UNCHANGED */}
              <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3">Refund Info</th>
                      <th className="p-3">Razorpay Order / Payment ID</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {data.records.map((row) => (
                      <tr key={row.paymentId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-indigo-600">{row.orderNumber}</td>
                        <td className="p-3">
                          <div className="font-medium text-slate-900">{row.customerName}</div>
                          <div className="text-[11px] text-slate-400">{row.customerEmail}</div>
                        </td>
                        <td className="p-3 font-bold text-slate-900">{formatPrice(row.amount)}</td>
                        <td className="p-3 font-mono text-[11px]">{row.paymentMethod}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              row.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : row.paymentStatus === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : row.paymentStatus === 'REFUNDED'
                                ? 'bg-blue-100 text-blue-800'
                                : row.paymentStatus === 'REFUND_PENDING'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {row.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              row.orderStatus === 'CONFIRMED' || row.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : row.orderStatus === 'PENDING'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {row.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-[11px]">
                          {row.refundStatus !== 'NONE' ? (
                            <div>
                              <span className="font-semibold text-purple-700">{row.refundStatus}</span>
                              {row.retryCount > 0 && (
                                <span className="ml-1 rounded bg-purple-100 px-1 text-[9px] text-purple-800">
                                  Retry #{row.retryCount}
                                </span>
                              )}
                              {row.failureReason && (
                                <p className="text-[10px] text-rose-600 truncate max-w-[150px]" title={row.failureReason}>
                                  {row.failureReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[10px] text-slate-500">
                          <div>Ord: {row.razorpayOrderId || 'N/A'}</div>
                          <div>Pmt: {row.razorpayPaymentId || 'N/A'}</div>
                        </td>
                        <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">
                          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {data && data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-200 bg-slate-50 p-3 min-w-0">
              <span className="text-xs text-slate-500 font-medium">
                Page {data.page + 1} of {data.totalPages} ({data.totalElements} records)
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={data.page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50 min-h-[36px] sm:min-h-0 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={data.page >= data.totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50 min-h-[36px] sm:min-h-0 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
