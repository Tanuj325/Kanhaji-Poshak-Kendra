import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  useTopSellingProducts,
  useTopRatedProducts,
  useMostReviewedProducts,
  useMostWishlistedProducts,
  useLowStockProducts,
  useOutOfStockProducts,
  useTopSellingCategories,
  useRefreshAnalytics,
} from '@/hooks/useAnalytics';
import { ProductBarChart } from '@/components/charts';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/apiErrorParser';
import { cn } from '@/utils/cn';
import {
  FiRotateCw,
  FiStar,
  FiHeart,
  FiMessageSquare,
  FiPackage,
  FiAlertTriangle,
  FiTrendingUp,
} from 'react-icons/fi';

function TopSellingSection() {
  const { data, isLoading, error, refetch } = useTopSellingProducts(10);
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <FiTrendingUp className="h-4 w-4" />
          </div>
          <h3 className="font-serif text-base font-bold text-slate-900">Top Selling Products</h3>
        </div>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="unitsSold"
        color="#F59E0B"
        label="Units Sold"
      />
      {data && data.length > 0 && (
        <div className="mt-4 divide-y divide-slate-100">
          {data.slice(0, 5).map((p, idx) => (
            <div
              key={p.id || idx}
              onClick={() => navigate(`/admin/products/${p.id}/edit`)}
              className="py-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/products/${p.id}/edit`); }}
            >
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">{p.name}</span>
              <div className="text-right">
                <span className="font-bold text-amber-700">{p.unitsSold} sold</span>
                <span className="text-slate-400 ml-2">({formatPrice(p.revenue)})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopRatedSection() {
  const { data, isLoading, error, refetch } = useTopRatedProducts(10);
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <FiStar className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-base font-bold text-slate-900">Highest Rated Items</h3>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="averageRating"
        color="#D97706"
        label="Average Rating"
      />
      {data && data.length > 0 && (
        <div className="mt-4 divide-y divide-slate-100">
          {data.slice(0, 5).map((p, idx) => (
            <div
              key={p.id || idx}
              onClick={() => navigate(`/admin/products/${p.id}/edit`)}
              className="py-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/products/${p.id}/edit`); }}
            >
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">{p.name}</span>
              <span className="font-bold text-amber-700">
                ⭐ {Number(p.averageRating).toFixed(1)} / 5 ({p.reviewCount} reviews)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MostReviewedSection() {
  const { data, isLoading, error, refetch } = useMostReviewedProducts(10);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
          <FiMessageSquare className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-base font-bold text-slate-900">Most Reviewed Catalog Items</h3>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="reviewCount"
        color="#3B82F6"
        label="Review Count"
      />
    </div>
  );
}

function MostWishlistedSection() {
  const { data, isLoading, error, refetch } = useMostWishlistedProducts(10);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
          <FiHeart className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-base font-bold text-slate-900">Most Wishlisted Items</h3>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="wishlistCount"
        color="#F43F5E"
        label="Wishlist Count"
      />
    </div>
  );
}

function InventoryStockSection() {
  const lowStock = useLowStockProducts(10);
  const outOfStock = useOutOfStockProducts();
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 lg:grid-cols-2 font-display">
      {/* Low Stock Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="font-serif text-base font-bold text-slate-900">Low Stock Inventory</h3>
          </div>
          <Badge variant="warning">{lowStock.data?.length ?? 0} items</Badge>
        </div>
        {lowStock.isLoading ? (
          <div className="space-y-3" role="status" aria-label="Loading low stock items">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <Skeleton variant="text" className="w-36" />
                <Skeleton variant="text" className="w-16" />
              </div>
            ))}
          </div>
        ) : lowStock.error ? (
          <ErrorState title="Failed to load" message={getErrorMessage(lowStock.error)} onRetry={lowStock.refetch} />
        ) : lowStock.data && lowStock.data.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto custom-scrollbar">
            {lowStock.data.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => navigate(`/admin/products/${item.id}/edit`)}
                className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/products/${item.id}/edit`); }}
              >
                <span className="font-semibold text-slate-900 truncate max-w-[240px]">{item.name}</span>
                <span className="font-mono font-bold text-amber-700">{item.stock} in stock</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No low stock items reported</p>
        )}
      </div>

      {/* Out of Stock Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiPackage className="h-4 w-4 text-rose-600" />
            <h3 className="font-serif text-base font-bold text-slate-900">Out of Stock Inventory</h3>
          </div>
          <Badge variant="danger">{outOfStock.data?.length ?? 0} items</Badge>
        </div>
        {outOfStock.isLoading ? (
          <div className="space-y-3" role="status" aria-label="Loading out of stock items">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <Skeleton variant="text" className="w-36" />
                <Skeleton variant="text" className="w-16" />
              </div>
            ))}
          </div>
        ) : outOfStock.error ? (
          <ErrorState title="Failed to load" message={getErrorMessage(outOfStock.error)} onRetry={outOfStock.refetch} />
        ) : outOfStock.data && outOfStock.data.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto custom-scrollbar">
            {outOfStock.data.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => navigate(`/admin/products/${item.id}/edit`)}
                className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/admin/products/${item.id}/edit`); }}
              >
                <span className="font-semibold text-slate-900 truncate max-w-[240px]">{item.name}</span>
                <span className="font-mono font-bold text-rose-600">Out of Stock</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No out of stock items</p>
        )}
      </div>
    </div>
  );
}

function TopCategoriesSection() {
  const { data, isLoading, error, refetch } = useTopSellingCategories(10);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs font-display space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base font-bold text-slate-900">Top Selling Categories</h3>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="quantitySold"
        color="#10B981"
        label="Quantity Sold"
      />
    </div>
  );
}

export default function ProductAnalyticsPage() {
  const refreshAnalytics = useRefreshAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshAnalytics();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refreshAnalytics]);

  return (
    <>
      <Helmet>
        <title>Product Analytics - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-6 font-display">
        <Breadcrumb />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Product Demand Analytics
            </h1>
            <p className="mt-1 text-xs text-stone-600 font-body">
              Demand volume, rating distribution, wishlist velocity, and inventory health
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <FiRotateCw className={cn('h-3.5 w-3.5 text-amber-600', isRefreshing && 'animate-spin')} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TopSellingSection />
          <TopRatedSection />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MostReviewedSection />
          <MostWishlistedSection />
        </div>

        {/* Inventory Stock Section */}
        <InventoryStockSection />

        {/* Category Analytics */}
        <TopCategoriesSection />
      </div>
    </>
  );
}
