import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAllOrders, useUpdateOrderStatus } from '@/hooks';
import { buildPath } from '@/routes/routePaths';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/navigation/Pagination';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import {
  FiEye,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
} from 'react-icons/fi';

const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PACKING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

const PAYMENT_STATUSES = [
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
];

const STATUS_BADGES = {
  PENDING: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  PACKING: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
  SHIPPED: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
  OUT_FOR_DELIVERY: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  RETURNED: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
};

const PAYMENT_BADGES = {
  PENDING: 'bg-amber-500/10 text-amber-700',
  PAID: 'bg-emerald-500/10 text-emerald-700 font-bold',
  FAILED: 'bg-rose-500/10 text-rose-700',
  REFUNDED: 'bg-blue-500/10 text-blue-700',
  PARTIALLY_REFUNDED: 'bg-purple-500/10 text-purple-700',
};

export default function OrdersListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const updateOrderStatus = useUpdateOrderStatus();

  const [filterOrderStatus, setFilterOrderStatus] = useState(searchParams.get('orderStatus') ?? '');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState(searchParams.get('paymentStatus') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')) || 10);
  const [page, setPage] = useState(() => {
    const urlPage = parseInt(searchParams.get('page'));
    return isNaN(urlPage) || urlPage < 1 ? 0 : urlPage - 1;
  });

  const backendSort = sortBy ? `${sortBy},${sortOrder}` : undefined;

  const queryParams = useMemo(
    () => ({
      orderStatus: filterOrderStatus || undefined,
      paymentStatus: filterPaymentStatus || undefined,
      sort: backendSort,
      page,
      size: pageSize,
    }),
    [filterOrderStatus, filterPaymentStatus, backendSort, page, pageSize],
  );

  const { data: ordersData, isLoading, isError, error } = useAllOrders(queryParams);

  const orders = ordersData?.content || [];
  const totalItems = ordersData?.totalElements || 0;
  const totalPages = ordersData?.totalPages || 0;

  const updateUrlParams = useCallback(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              next.set(key, String(value));
            } else {
              next.delete(key);
            }
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleStatusFilterChange = (status) => {
    setFilterOrderStatus(status);
    setPage(0);
    updateUrlParams({ orderStatus: status || undefined, page: '1' });
  };

  const handlePaymentFilterChange = (value) => {
    setFilterPaymentStatus(value);
    setPage(0);
    updateUrlParams({ paymentStatus: value || undefined, page: '1' });
  };

  const handlePageChange = (newPageDisplay) => {
    const newPage = newPageDisplay - 1;
    setPage(newPage);
    updateUrlParams({ page: String(newPageDisplay) });
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, 'Failed to update status'));
        },
      },
    );
  };

  return (
    <>
      <Helmet>
        <title>Orders - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-200/60 pb-4 sm:pb-5">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-950 tracking-tight">
              Devotee Orders ({totalItems})
            </h1>
            <p className="mt-0.5 sm:mt-1 text-xs text-stone-600 font-body">
              Manage fulfillment, status progression, payments, and order details
            </p>
          </div>
        </div>

        {/* Status Quick Filter Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto custom-scrollbar pb-1.5" aria-label="Order Status Tabs">
            <button
              onClick={() => handleStatusFilterChange('')}
              className={cn(
                'min-h-[44px] whitespace-nowrap px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0',
                filterOrderStatus === ''
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              All Orders
            </button>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={cn(
                  'min-h-[44px] whitespace-nowrap px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0',
                  filterOrderStatus === status
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                )}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {/* Payment Filter */}
            <select
              value={filterPaymentStatus}
              onChange={(e) => handlePaymentFilterChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none min-h-[44px]"
            >
              <option value="">All Payment Statuses</option>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            {/* Sort Field */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                updateUrlParams({ sortBy: e.target.value, page: '1' });
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none min-h-[44px]"
            >
              <option value="createdAt">Date Created (Newest First)</option>
              <option value="orderNumber">Order Number</option>
              <option value="totalAmount">Total Amount</option>
              <option value="orderStatus">Order Status</option>
            </select>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                updateUrlParams({ size: e.target.value, page: '1' });
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none min-h-[44px]"
            >
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>

        {/* Data Container: Mobile/Tablet Card List (< 1024px) vs Desktop Table (>= 1024px) */}
        {isLoading ? (
          <div className="space-y-3">
            {/* Desktop Loading Skeleton */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white p-6 space-y-3 shadow-xs">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                  <Skeleton variant="text" className="w-28" />
                  <Skeleton variant="text" className="w-32" />
                  <Skeleton variant="text" className="w-24" />
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Loading Skeleton */}
            <div className="block lg:hidden space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-2xs">
                  <div className="flex justify-between">
                    <Skeleton variant="text" className="w-24 h-4" />
                    <Skeleton variant="text" className="w-20 h-4" />
                  </div>
                  <Skeleton variant="text" className="w-36 h-4" />
                  <div className="flex justify-between pt-2">
                    <Skeleton variant="text" className="w-16 h-4" />
                    <Skeleton variant="text" className="w-20 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center text-rose-600 font-semibold text-xs sm:text-sm">
            Error loading orders: {getErrorMessage(error)}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {/* Desktop Table Layout (>= 1024px) — PRESERVED 100% */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs" aria-label="Orders list">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th scope="col" className="py-3.5 px-4">Order #</th>
                      <th scope="col" className="py-3.5 px-4">Customer Info</th>
                      <th scope="col" className="py-3.5 px-4">Date</th>
                      <th scope="col" className="py-3.5 px-4 text-center">Payment</th>
                      <th scope="col" className="py-3.5 px-4 text-center">Order Status</th>
                      <th scope="col" className="py-3.5 px-4 text-right">Total</th>
                      <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => navigate(buildPath.adminOrderDetail(row.id))}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                          {row.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">
                            {row.userFirstName || row.shippingAddress?.fullName || 'Customer'} {row.userLastName || ''}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {row.userEmail || row.shippingAddress?.email || '—'}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">
                          {formatDate(row.createdAt || row.orderDate, { format: 'date' })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                              PAYMENT_BADGES[row.paymentStatus] || 'bg-slate-100 text-slate-600'
                            )}
                          >
                            {row.paymentStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={cn(
                              'inline-block border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                              STATUS_BADGES[row.orderStatus] || 'bg-slate-100 text-slate-600 border-slate-200'
                            )}
                          >
                            {(row.orderStatus || 'PENDING').replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                          {formatPrice(row.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => navigate(buildPath.adminOrderDetail(row.id))}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              title="View order details"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <select
                              value={row.orderStatus || ''}
                              onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                              className="text-[10px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-amber-500 focus:outline-none"
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s.replace(/_/g, ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile & Tablet Responsive Cards Layout (< 1024px) */}
            <div className="block lg:hidden space-y-3.5">
              {orders.map((row) => (
                <div
                  key={row.id}
                  onClick={() => navigate(buildPath.adminOrderDetail(row.id))}
                  className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-amber-500/40 transition-all cursor-pointer space-y-3.5"
                >
                  {/* Top Row: Order Icon, Number, Datetime, Status Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 shrink-0">
                        <FiShoppingBag className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-bold text-slate-900 truncate">
                          #{row.orderNumber}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {formatDate(row.createdAt || row.orderDate, { format: 'datetime' })}
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0',
                        STATUS_BADGES[row.orderStatus] || 'bg-slate-100 text-slate-600 border-slate-200'
                      )}
                    >
                      {(row.orderStatus || 'PENDING').replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer Details & Order Total Grid Block */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50/70 rounded-xl p-3 border border-slate-100">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer</p>
                      <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {row.userFirstName || row.shippingAddress?.fullName || 'Customer'} {row.userLastName || ''}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        {row.userEmail || row.shippingAddress?.email || '—'}
                      </p>
                    </div>

                    <div className="text-right min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                      <p className="text-sm font-mono font-extrabold text-amber-900 mt-0.5">
                        {formatPrice(row.totalAmount)}
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        <span className="text-[9px] text-slate-400 font-medium">Pay:</span>
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider',
                            PAYMENT_BADGES[row.paymentStatus] || 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {row.paymentStatus || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar: Full-Width Status Select & Details Button */}
                  <div
                    className="flex items-center gap-2 pt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex-1 min-w-0">
                      <select
                        value={row.orderStatus || ''}
                        onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                        className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-amber-500 focus:outline-none min-h-[40px] shadow-2xs"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            Status: {s.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(buildPath.adminOrderDetail(row.id))}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-white px-3.5 py-2 text-xs font-bold hover:bg-slate-800 transition-all min-h-[40px] shrink-0 shadow-2xs"
                    >
                      <FiEye className="h-3.5 w-3.5 text-amber-400" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs">
                <span className="text-xs text-slate-500 text-center sm:text-left">
                  Showing {orders.length} of {totalItems} orders
                </span>
                <Pagination
                  currentPage={page + 1}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-12 text-center text-slate-400 shadow-xs">
            <FiShoppingBag className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
            <p className="text-sm font-bold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400 mt-1">Try changing status or payment filters</p>
          </div>
        )}
      </div>
    </>
  );
}
