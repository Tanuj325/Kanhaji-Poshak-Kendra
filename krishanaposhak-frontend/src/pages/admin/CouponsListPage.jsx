import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAllCoupons, useDeleteCoupon, useToggleCouponStatus } from '@/hooks';
import { ROUTE_PATHS } from '@/routes/routePaths';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/navigation/Pagination';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiTag,
} from 'react-icons/fi';

export default function CouponsListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('code') || '');
  const [filterActive, setFilterActive] = useState(searchParams.get('active') ?? '');
  const [filterExpired, setFilterExpired] = useState(searchParams.get('expired') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')) || 10);
  const [page, setPage] = useState(() => {
    const urlPage = parseInt(searchParams.get('page'));
    return isNaN(urlPage) || urlPage < 1 ? 0 : urlPage - 1;
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const deleteCoupon = useDeleteCoupon();
  const toggleStatus = useToggleCouponStatus();

  const backendSort = sortBy ? `${sortBy},${sortOrder}` : undefined;

  const queryParams = useMemo(
    () => ({
      code: searchTerm || undefined,
      active: filterActive !== '' ? filterActive === 'true' : undefined,
      expired: filterExpired !== '' ? filterExpired === 'true' : undefined,
      sort: backendSort,
      page,
      size: pageSize,
    }),
    [searchTerm, filterActive, filterExpired, backendSort, page, pageSize],
  );

  const { data: couponsData, isLoading, isError, error } = useAllCoupons(queryParams);

  const coupons = couponsData?.content || [];
  const totalItems = couponsData?.totalElements || 0;
  const totalPages = couponsData?.totalPages || 0;

  const debounceTimerRef = useRef(null);

  const doSearch = useCallback(
    (value) => {
      setSearchTerm(value);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set('code', value);
          else next.delete('code');
          next.set('page', '1');
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => doSearch(value), 400);
  };

  const handlePageChange = (newPageDisplay) => {
    const newPage = newPageDisplay - 1;
    setPage(newPage);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(newPageDisplay));
        return next;
      },
      { replace: true },
    );
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteCoupon.mutateAsync(deleteId);
        toast.success('Coupon deleted successfully');
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to delete coupon'));
      } finally {
        setShowDeleteDialog(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Coupons - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Coupons & Promo Codes ({totalItems})
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Manage promotional discount rules, usage caps, and validity windows
            </p>
          </div>
          <Link
            to={ROUTE_PATHS.ADMIN_COUPON_NEW}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <FiPlus className="h-4 w-4" />
            Create Coupon
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                defaultValue={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search coupon code..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <select
              value={filterActive}
              onChange={(e) => {
                setFilterActive(e.target.value);
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  if (e.target.value !== '') next.set('active', e.target.value);
                  else next.delete('active');
                  next.set('page', '1');
                  return next;
                });
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>

            <select
              value={filterExpired}
              onChange={(e) => {
                setFilterExpired(e.target.value);
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  if (e.target.value !== '') next.set('expired', e.target.value);
                  else next.delete('expired');
                  next.set('page', '1');
                  return next;
                });
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="">All Validity States</option>
              <option value="false">Valid Only</option>
              <option value="true">Expired Only</option>
            </select>
          </div>
        </div>

        {/* Data Container */}
        {isLoading ? (
          <>
            {/* Mobile & Tablet Loading Skeletons (< 1024px) */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3.5" role="status" aria-label="Loading coupons">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200/80 bg-white p-3.5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <Skeleton variant="text" className="w-20 h-5 rounded-md" />
                    <Skeleton variant="text" className="w-14 h-4 rounded-full" />
                  </div>
                  <Skeleton variant="text" className="w-full h-3" />
                  <div className="bg-slate-50 rounded-lg p-2 grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <Skeleton variant="text" className="w-10 h-2" />
                      <Skeleton variant="text" className="w-16 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <Skeleton variant="text" className="w-8 h-2" />
                      <Skeleton variant="text" className="w-12 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <Skeleton variant="text" className="w-32 h-3" />
                    <div className="flex gap-1">
                      <Skeleton variant="text" className="w-14 h-6 rounded-lg" />
                      <Skeleton variant="text" className="w-6 h-6 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Loading Skeletons (>= 1024px) */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <div className="p-6 space-y-3" role="status" aria-label="Loading coupons">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <Skeleton variant="text" className="w-32" />
                    <Skeleton variant="text" className="w-24" />
                    <Skeleton variant="text" className="w-20" />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : isError ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-rose-500 font-semibold shadow-xs">
            Error loading coupons: {getErrorMessage(error)}
          </div>
        ) : coupons.length > 0 ? (
          <>
            {/* Mobile & Tablet Coupon Cards View (< 1024px) */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {coupons.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-amber-300/90 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between group"
                >
                  {/* Top Header Row: Code & Status Toggle */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs inline-block truncate">
                      {row.code}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleStatus.mutate(row.id)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold transition-all border shrink-0',
                        row.active
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      )}
                    >
                      {row.active ? <FiCheckCircle className="h-2.5 w-2.5 text-emerald-600 shrink-0" /> : <FiXCircle className="h-2.5 w-2.5 text-slate-500 shrink-0" />}
                      <span>{row.active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  {/* Coupon Description (if present) */}
                  {row.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                      {row.description}
                    </p>
                  )}

                  {/* Structured Metadata Box: Discount & Usage */}
                  <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 grid grid-cols-2 gap-2 items-center text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Discount
                      </span>
                      <p className="font-bold text-slate-900 text-xs">
                        {row.discountType === 'PERCENTAGE'
                          ? `${row.discountValue}% OFF`
                          : `${formatPrice(row.discountValue)} FLAT`}
                      </p>
                      {row.minimumOrderAmount > 0 && (
                        <span className="block text-[9px] text-slate-400 font-normal truncate">
                          Min spend: {formatPrice(row.minimumOrderAmount)}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Usage
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200/70 inline-block">
                        {row.usedCount ?? 0} {row.usageLimit ? `/ ${row.usageLimit}` : '/ ∞'}
                      </span>
                    </div>
                  </div>

                  {/* Validity Window */}
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-2 gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px] shrink-0">Valid</span>
                    <span className="truncate">
                      {formatDate(row.validFrom, { format: 'date' })} → {formatDate(row.validUntil, { format: 'date' })}
                    </span>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/coupons/${row.id}/edit`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors"
                      title="Edit coupon"
                    >
                      <FiEdit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteId(row.id);
                        setShowDeleteDialog(true);
                      }}
                      className="p-1 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 transition-colors"
                      title="Delete coupon"
                      aria-label="Delete coupon"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Pagination Container (< 1024px) */}
            {totalPages > 1 && (
              <div className="lg:hidden rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2 mt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <span className="text-xs text-slate-500">
                    Showing {coupons.length} of {totalItems} coupons
                  </span>
                  <Pagination
                    currentPage={page + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}

            {/* Desktop Table View (>= 1024px) - EXACT UNCHANGED */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs" aria-label="Coupons list">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th scope="col" className="py-3.5 px-4">Coupon Code</th>
                      <th scope="col" className="py-3.5 px-4">Discount</th>
                      <th scope="col" className="py-3.5 px-4 text-center">Usage (Used / Limit)</th>
                      <th scope="col" className="py-3.5 px-4 font-mono">Validity Window</th>
                      <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                      <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-xs inline-block">
                            {row.code}
                          </span>
                          {row.description && (
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{row.description}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {row.discountType === 'PERCENTAGE'
                            ? `${row.discountValue}% OFF`
                            : `${formatPrice(row.discountValue)} FLAT`}
                          {row.minimumOrderAmount > 0 && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              Min spend: {formatPrice(row.minimumOrderAmount)}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                            {row.usedCount ?? 0} {row.usageLimit ? `/ ${row.usageLimit}` : '/ ∞'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {formatDate(row.validFrom, { format: 'date' })} → {formatDate(row.validUntil, { format: 'date' })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleStatus.mutate(row.id)}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all',
                              row.active
                                ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            )}
                          >
                            {row.active ? <FiCheckCircle className="h-3 w-3" /> : <FiXCircle className="h-3 w-3" />}
                            <span>{row.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/coupons/${row.id}/edit`)}
                              className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Edit coupon"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteId(row.id);
                                setShowDeleteDialog(true);
                              }}
                              className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Delete coupon"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200/80 px-4 py-3 bg-slate-50/50">
                  <span className="text-xs text-slate-500">
                    Showing {coupons.length} of {totalItems} coupons
                  </span>
                  <Pagination
                    currentPage={page + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Mobile/Tablet Empty State (< 1024px) */}
            <div className="lg:hidden rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-slate-400 shadow-xs">
              <FiTag className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-sm font-bold text-slate-700">No coupons found</p>
              <p className="text-xs text-slate-400 mt-1">Create your first promo code or clear search filter</p>
            </div>

            {/* Desktop Empty State (>= 1024px) */}
            <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
              <div className="p-12 text-center text-slate-400">
                <FiTag className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
                <p className="text-sm font-bold text-slate-700">No coupons found</p>
                <p className="text-xs text-slate-400 mt-1">Create your first promo code or clear search filter</p>
              </div>
            </div>
          </>
        )}
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Coupon"
          message="Are you sure you want to delete this promo code? Active customer carts using this code will no longer receive discounts."
          confirmText="Delete Coupon"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleteCoupon.isPending}
        />
      )}
    </>
  );
}
