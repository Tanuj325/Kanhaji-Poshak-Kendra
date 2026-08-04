import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCategories, useDeleteCategory, useToggleCategoryStatus } from '@/hooks';
import { ROUTE_PATHS, buildPath } from '@/routes/routePaths';
import { getOptimizedImageUrl, PLACEHOLDER_IMAGE } from '@/utils/imageHelpers';
import { formatDate } from '@/utils/formatDate';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/overlay/Modal';
import ConfirmDialog from '@/components/overlay/ConfirmDialog';
import Input from '@/components/forms/Input';
import Select from '@/components/forms/Select';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/navigation/Pagination';
import { FiPlus, FiSearch, FiTrash2, FiEdit2, FiEye, FiEyeOff, FiLayers } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function CategoriesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') ?? '0', 10);
  const size = parseInt(searchParams.get('size') ?? '10', 10);
  const nameFilter = searchParams.get('name') ?? '';
  const activeFilter = searchParams.get('active') ?? '';
  const sortBy = searchParams.get('sortBy') ?? 'name';
  const sortOrder = searchParams.get('sortOrder') ?? 'asc';

  const [searchInput, setSearchInput] = useState(nameFilter);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryParams = useMemo(() => {
    const params = { page, size, sort: `${sortBy},${sortOrder}` };
    if (nameFilter) params.name = nameFilter;
    if (activeFilter !== '') params.active = activeFilter;
    return params;
  }, [page, size, nameFilter, activeFilter, sortBy, sortOrder]);

  const { data, isLoading, error, refetch } = useCategories(queryParams);
  const deleteMutation = useDeleteCategory();
  const toggleStatusMutation = useToggleCategoryStatus();

  const paginationData = data?.data || data || {};
  const categories = paginationData.content ?? [];
  const totalPages = paginationData.totalPages ?? 1;
  const totalElements = paginationData.totalElements ?? 0;

  const handlePageChange = (newPageDisplay) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPageDisplay - 1));
      return next;
    });
  };

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (searchInput) next.set('name', searchInput);
      else next.delete('name');
      next.set('page', '0');
      return next;
    });
  }, [searchInput, setSearchParams]);

  const handleActiveFilter = useCallback((value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === '') next.delete('active');
      else next.set('active', value);
      next.set('page', '0');
      return next;
    });
  }, [setSearchParams]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // error handled in hook
    }
  }, [deleteTarget, deleteMutation]);

  const handleToggleStatus = useCallback(async (id) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
    } catch {
      // error handled in hook
    }
  }, [toggleStatusMutation]);

  return (
    <>
      <Helmet>
        <title>Categories - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Catalog Categories ({totalElements})
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Manage category taxonomy, subcategories, and navigation ordering
            </p>
          </div>
          <Link
            to={ROUTE_PATHS.ADMIN_CATEGORY_NEW}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <FiPlus className="h-4 w-4" />
            Add Category
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search category by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <select
              value={activeFilter}
              onChange={(e) => handleActiveFilter(e.target.value)}
              className="w-full sm:w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3" role="status" aria-label="Loading categories">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
                  <Skeleton variant="text" className="w-40" />
                  <Skeleton variant="text" className="w-24" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-rose-500 font-semibold mb-3">Failed to load categories</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs" aria-label="Categories list">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3.5 px-4">Category Details</th>
                    <th scope="col" className="py-3.5 px-4">Slug</th>
                    <th scope="col" className="py-3.5 px-4">Parent Category</th>
                    <th scope="col" className="py-3.5 px-4 text-center">Order</th>
                    <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {page * size + idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cat.imageUrl ? getOptimizedImageUrl(cat.imageUrl, 60, 60) : PLACEHOLDER_IMAGE}
                            alt={cat.name}
                            className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{cat.name}</p>
                            {cat.description && (
                              <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px]">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {cat.slug}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {cat.parentCategoryName ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                            <FiLayers className="h-3 w-3 text-amber-600" /> {cat.parentCategoryName}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                        {cat.displayOrder ?? 0}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat.id)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all',
                            cat.active
                              ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          )}
                        >
                          {cat.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/categories/${cat.id}/edit`}
                            className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit Category"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(cat)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete Category"
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
              <FiLayers className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-sm font-bold text-slate-700">No categories found</p>
              <p className="text-xs text-slate-400 mt-1">Create your first category or reset search filters</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/80 px-4 py-3 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                Showing {categories.length} of {totalElements} categories
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

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category Confirmation"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? If subcategories or products are assigned, deletion may be restricted.`}
        confirmText="Delete Category"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
