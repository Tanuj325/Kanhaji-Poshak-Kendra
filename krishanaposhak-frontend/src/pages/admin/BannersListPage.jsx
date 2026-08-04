import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAllBanners, useDeleteBanner, useToggleBannerStatus } from '@/hooks';
import { ROUTE_PATHS } from '@/routes/routePaths';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/navigation/Pagination';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import { formatDate } from '@/utils/formatDate';
import { getErrorMessage } from '@/utils/apiErrorParser';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiImage,
} from 'react-icons/fi';

export default function BannersListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');
  const [filterActive, setFilterActive] = useState(searchParams.get('active') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'displayOrder');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc');
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')) || 10);
  const [page, setPage] = useState(() => {
    const urlPage = parseInt(searchParams.get('page'));
    return isNaN(urlPage) || urlPage < 1 ? 0 : urlPage - 1;
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const deleteBanner = useDeleteBanner();
  const toggleStatus = useToggleBannerStatus();

  const backendSort = sortBy ? `${sortBy},${sortOrder}` : undefined;

  const queryParams = useMemo(() => ({
    title: searchTerm || undefined,
    active: filterActive !== '' ? filterActive === 'true' : undefined,
    sort: backendSort,
    page,
    size: pageSize,
  }), [searchTerm, filterActive, backendSort, page, pageSize]);

  const { data: bannersData, isLoading, isError, error } = useAllBanners(queryParams);

  const banners = bannersData?.content || [];
  const totalItems = bannersData?.totalElements || 0;
  const totalPages = bannersData?.totalPages || 0;

  const debounceTimerRef = useRef(null);

  const doSearch = useCallback((value) => {
    setSearchTerm(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('title', value);
      else next.delete('title');
      next.set('page', '1');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => doSearch(value), 400);
  };

  const handlePageChange = (newPageDisplay) => {
    const newPage = newPageDisplay - 1;
    setPage(newPage);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPageDisplay));
      return next;
    }, { replace: true });
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteBanner.mutateAsync(deleteId);
        toast.success('Hero banner deleted successfully');
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to delete banner'));
      } finally {
        setShowDeleteDialog(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Hero Banners - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Hero Banners ({totalItems})
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Manage homepage carousel banners, CTA buttons, and display sequence
            </p>
          </div>
          <Link
            to={ROUTE_PATHS.ADMIN_BANNER_NEW}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <FiPlus className="h-4 w-4" />
            Add New Banner
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                defaultValue={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search banner by title..."
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
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3" role="status" aria-label="Loading banners">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                  <Skeleton variant="text" className="w-32" />
                  <Skeleton variant="text" className="w-24" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-rose-500 font-semibold">
              Error loading banners: {getErrorMessage(error)}
            </div>
          ) : banners.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs" aria-label="Banners list">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th scope="col" className="py-3.5 px-4">Banner Preview</th>
                    <th scope="col" className="py-3.5 px-4">Title & Subtitle</th>
                    <th scope="col" className="py-3.5 px-4 text-center">Display Order</th>
                    <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {banners.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        {row.imageUrl ? (
                          <img
                            src={row.imageUrl}
                            alt={row.title || 'Banner'}
                            className="h-12 w-24 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="h-12 w-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                            <FiImage className="h-5 w-5" />
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{row.title || 'Untitled Banner'}</p>
                        {row.subtitle && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{row.subtitle}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        #{row.displayOrder ?? 0}
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
                            onClick={() => navigate(`/admin/banners/${row.id}/edit`)}
                            className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit banner"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteId(row.id);
                              setShowDeleteDialog(true);
                            }}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete banner"
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
          ) : (
            <div className="p-12 text-center text-slate-400">
              <FiImage className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-sm font-bold text-slate-700">No hero banners found</p>
              <p className="text-xs text-slate-400 mt-1">Create your first homepage carousel banner</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/80 px-4 py-3 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                Showing {banners.length} of {totalItems} banners
              </span>
              <Pagination
                currentPage={page + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Hero Banner"
          message="Are you sure you want to delete this banner? The image asset will be removed from homepage rotation."
          confirmText="Delete Banner"
          cancelText="Cancel"
          variant="danger"
          isLoading={deleteBanner.isPending}
        />
      )}
    </>
  );
}
