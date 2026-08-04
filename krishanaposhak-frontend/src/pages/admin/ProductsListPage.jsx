import { Helmet } from 'react-helmet-async';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { productService } from '@/services';
import { useRootCategories } from '@/hooks/useCategories';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { buildPath, ROUTE_PATHS } from '@/routes/routePaths';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Pagination from '@/components/navigation/Pagination';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { cn } from '@/utils/cn';
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiPackage,
  FiStar,
} from 'react-icons/fi';

export default function ProductsListPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Root categories for dropdown filter
  const { data: categoriesData } = useRootCategories();
  const categoryList = useMemo(() => {
    return Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || categoriesData?.content || [];
  }, [categoriesData]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(searchParams.get('categoryId') || '');
  const [filterActive, setFilterActive] = useState(searchParams.get('active') ?? '');
  const [selectedFeatured, setSelectedFeatured] = useState(searchParams.get('featured') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')) || 10);
  const [page, setPage] = useState(() => {
    const urlPage = parseInt(searchParams.get('page'));
    return isNaN(urlPage) || urlPage < 1 ? 0 : urlPage - 1;
  });

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const debounceTimerRef = useRef(null);

  const doDebouncedSearch = useCallback((value) => {
    setSearchTerm(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('search', value);
      else next.delete('search');
      next.set('page', '0');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleSearchChange = (e) => {
    const rawValue = e.target.value;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      doDebouncedSearch(rawValue);
    }, 400);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategoryId(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('categoryId', value);
      else next.delete('categoryId');
      next.set('page', '0');
      return next;
    }, { replace: true });
  };

  const handleActiveFilterChange = (value) => {
    setFilterActive(value);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value !== '') next.set('active', value);
      else next.delete('active');
      next.set('page', '0');
      return next;
    }, { replace: true });
  };

  const handleFeaturedChange = (checked) => {
    setSelectedFeatured(checked);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (checked) next.set('featured', 'true');
      else next.delete('featured');
      next.set('page', '0');
      return next;
    }, { replace: true });
  };

  const handleSortChange = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sortBy', field);
      next.set('sortOrder', newOrder);
      next.set('page', '0');
      return next;
    }, { replace: true });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(parseInt(value));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('size', value);
      next.set('page', '0');
      return next;
    }, { replace: true });
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

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await productService.delete(deleteId);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PRODUCTS] });
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error(getErrorMessage(err, 'Failed to delete product'));
      } finally {
        setShowDeleteDialog(false);
        setDeleteId(null);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await productService.toggleStatus(id);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PRODUCTS] });
      toast.success(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update status'));
    }
  };

  const backendSort = sortBy && sortOrder ? `${sortBy},${sortOrder}` : undefined;

  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.ADMIN_PRODUCTS,
      {
        search: searchTerm,
        categoryId: selectedCategoryId,
        active: filterActive || undefined,
        featured: selectedFeatured || undefined,
        sort: backendSort,
        page,
        size: pageSize,
      }
    ],
    queryFn: () =>
      productService.getAllAdmin({
        search: searchTerm || undefined,
        categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
        active: filterActive !== '' ? filterActive === 'true' : undefined,
        featured: selectedFeatured || undefined,
        sort: backendSort,
        page,
        size: pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const products = productsData?.content || [];
  const totalItems = productsData?.totalElements || 0;
  const totalPages = productsData?.totalPages || 0;

  const getThumbnailImageUrl = (images) => {
    if (!images || images.length === 0) return null;
    const thumbnail = images.find(img => img.thumbnail);
    return thumbnail ? thumbnail.imageUrl : images[0].imageUrl;
  };

  const getPriceDisplay = (variants) => {
    if (!variants || variants.length === 0) return { price: 0, discountPrice: null };
    const v = variants.find(x => x.active) || variants[0];
    return { price: v.price || 0, discountPrice: v.discountPrice || null };
  };

  const getTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  return (
    <>
      <Helmet>
        <title>Products - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Product Catalog ({totalItems})
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Manage inventory, pricing, variants, and catalog visibility
            </p>
          </div>
          <Link
            to={ROUTE_PATHS.ADMIN_PRODUCT_NEW}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-[#0B1728] shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl active:scale-[0.98] sm:w-auto"
          >
            <FiPlus className="h-4 w-4" />
            Add New Product
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                defaultValue={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search name, SKU..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="">All Categories</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Active Status */}
            <select
              value={filterActive}
              onChange={(e) => handleActiveFilterChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>

            {/* Featured toggle & Page size */}
            <div className="flex items-center justify-between gap-2 px-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedFeatured}
                  onChange={(e) => handleFeaturedChange(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
                <span>Featured</span>
              </label>

              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600"
              >
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3" role="status" aria-label="Loading products">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
                  <Skeleton variant="text" className="w-48" />
                  <Skeleton variant="text" className="w-24" />
                  <Skeleton variant="text" className="w-20" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-rose-500 font-semibold mb-3">{getErrorMessage(error, 'Error loading products')}</p>
              <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_PRODUCTS] })}>
                Retry
              </Button>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs" aria-label="Product list">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 w-12 text-center">#</th>
                    <th scope="col" className="py-3.5 px-4">Item Details</th>
                    <th scope="col" className="py-3.5 px-4">Category</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Price</th>
                    <th scope="col" className="py-3.5 px-4 text-center">Stock</th>
                    <th scope="col" className="py-3.5 px-4 text-center">Status</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product, idx) => {
                    const thumb = getThumbnailImageUrl(product.images);
                    const { price, discountPrice } = getPriceDisplay(product.variants);
                    const stock = getTotalStock(product.variants);

                    return (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                          {page * pageSize + idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={product.name}
                                className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                <FiPackage className="h-5 w-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate max-w-[220px]">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {product.featured && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-700">
                                    <FiStar className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> Featured
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {product.variants?.length || 0} variants
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-600">
                          {product.categoryName || 'Unassigned'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          {discountPrice ? (
                            <div>
                              <span className="text-amber-700">{formatPrice(discountPrice)}</span>
                              <span className="block text-[10px] text-slate-400 line-through">
                                {formatPrice(price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-900">{formatPrice(price)}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {stock === 0 ? (
                            <Badge variant="danger">Out of Stock</Badge>
                          ) : stock < 10 ? (
                            <Badge variant="warning">{stock} left</Badge>
                          ) : (
                            <span className="font-semibold text-slate-700">{stock}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(product.id, product.active)}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all',
                              product.active
                                ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            )}
                          >
                            {product.active ? <FiCheckCircle className="h-3 w-3" /> : <FiXCircle className="h-3 w-3" />}
                            <span>{product.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => navigate(buildPath.product(product.slug || product.id))}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              title="View in Store"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(buildPath.adminProductEdit(product.id))}
                              className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Edit product"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(product.id)}
                              className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Delete product"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <FiPackage className="h-10 w-10 mx-auto mb-2 opacity-30 text-amber-500" />
              <p className="text-sm font-bold text-slate-700">No products found</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting search query or category filters</p>
            </div>
          )}

          {/* Table Footer / Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/80 px-4 py-3 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                Showing {products.length} of {totalItems} items
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
      {showDeleteDialog && (
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </>
  );
}
