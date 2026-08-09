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

function TopSellingSection({ onSelectProduct }) {
  const { data, isLoading, error, refetch } = useTopSellingProducts(10);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs font-display space-y-3 sm:space-y-4 min-w-0">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
            <FiTrendingUp className="h-3.5 w-3.5" />
          </div>
          <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">Top Selling Products</h3>
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
        onItemClick={onSelectProduct}
      />
      {data && data.length > 0 && (
        <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 pt-2">
          {data.slice(0, 5).map((p, idx) => (
            <div
              key={p.id || p.productId || idx}
              onClick={() => onSelectProduct(p)}
              className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors min-w-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(p); }}
            >
              <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[200px] text-[11px] sm:text-xs">{p.name}</span>
              <div className="text-right shrink-0 text-[11px] sm:text-xs">
                <span className="font-bold text-amber-700">{p.unitsSold} sold</span>
                <span className="text-slate-400 ml-1.5 font-mono">({formatPrice(p.revenue)})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopRatedSection({ onSelectProduct }) {
  const { data, isLoading, error, refetch } = useTopRatedProducts(10);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs font-display space-y-3 sm:space-y-4 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
          <FiStar className="h-3.5 w-3.5" />
        </div>
        <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">Highest Rated Items</h3>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="averageRating"
        color="#D97706"
        label="Average Rating"
        onItemClick={onSelectProduct}
      />
      {data && data.length > 0 && (
        <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 pt-2">
          {data.slice(0, 5).map((p, idx) => (
            <div
              key={p.id || p.productId || idx}
              onClick={() => onSelectProduct(p)}
              className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors min-w-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(p); }}
            >
              <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[200px] text-[11px] sm:text-xs">{p.name}</span>
              <span className="font-bold text-amber-700 shrink-0 text-[11px] sm:text-xs">
                ⭐ {Number(p.averageRating).toFixed(1)} <span className="text-slate-400 font-normal">({p.reviewCount})</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MostReviewedSection({ onSelectProduct }) {
  const { data, isLoading, error, refetch } = useMostReviewedProducts(10);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs font-display space-y-3 sm:space-y-4 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
          <FiMessageSquare className="h-3.5 w-3.5" />
        </div>
        <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">Most Reviewed Catalog Items</h3>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="reviewCount"
        color="#3B82F6"
        label="Review Count"
        onItemClick={onSelectProduct}
      />
      {data && data.length > 0 && (
        <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 pt-2">
          {data.slice(0, 5).map((p, idx) => (
            <div
              key={p.id || p.productId || idx}
              onClick={() => onSelectProduct(p)}
              className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors min-w-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(p); }}
            >
              <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[200px] text-[11px] sm:text-xs">{p.name}</span>
              <span className="font-bold text-blue-600 shrink-0 text-[11px] sm:text-xs">
                {p.reviewCount} reviews
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MostWishlistedSection({ onSelectProduct }) {
  const { data, isLoading, error, refetch } = useMostWishlistedProducts(10);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs font-display space-y-3 sm:space-y-4 min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
          <FiHeart className="h-3.5 w-3.5" />
        </div>
        <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">Most Wishlisted Items</h3>
      </div>
      <ProductBarChart
        data={data}
        isLoading={isLoading}
        error={error ? getErrorMessage(error) : null}
        onRetry={refetch}
        dataKey="wishlistCount"
        color="#F43F5E"
        label="Wishlist Count"
        onItemClick={onSelectProduct}
      />
      {data && data.length > 0 && (
        <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 pt-2">
          {data.slice(0, 5).map((p, idx) => (
            <div
              key={p.id || p.productId || idx}
              onClick={() => onSelectProduct(p)}
              className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors min-w-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(p); }}
            >
              <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[200px] text-[11px] sm:text-xs">{p.name}</span>
              <span className="font-bold text-rose-600 shrink-0 text-[11px] sm:text-xs">
                ❤️ {p.wishlistCount} saves
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InventoryStockSection({ onSelectProduct }) {
  const lowStock = useLowStockProducts(10);
  const outOfStock = useOutOfStockProducts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-6 font-display min-w-0">
      {/* Low Stock Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs min-w-0">
        <div className="flex items-center justify-between mb-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <FiAlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">Low Stock Inventory</h3>
          </div>
          <Badge variant="warning">{lowStock.data?.length ?? 0} items</Badge>
        </div>
        {lowStock.isLoading ? (
          <div className="space-y-2.5" role="status" aria-label="Loading low stock items">
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
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
            {lowStock.data.map((item, idx) => (
              <div
                key={item.id || item.productId || idx}
                onClick={() => onSelectProduct(item)}
                className="py-2 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors min-w-0"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(item); }}
              >
                <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-[240px] text-[11px] sm:text-xs">{item.name}</span>
                <span className="font-mono font-bold text-amber-700 shrink-0 text-[11px] sm:text-xs">{item.stock} in stock</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No low stock items reported</p>
        )}
      </div>

      {/* Out of Stock Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs min-w-0">
        <div className="flex items-center justify-between mb-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <FiPackage className="h-4 w-4 text-rose-600 shrink-0" />
            <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">Out of Stock Inventory</h3>
          </div>
          <Badge variant="danger">{outOfStock.data?.length ?? 0} items</Badge>
        </div>
        {outOfStock.isLoading ? (
          <div className="space-y-2.5" role="status" aria-label="Loading out of stock items">
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
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
            {outOfStock.data.map((item, idx) => (
              <div
                key={item.id || item.productId || idx}
                onClick={() => onSelectProduct(item)}
                className="py-2 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors min-w-0"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectProduct(item); }}
              >
                <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-[240px] text-[11px] sm:text-xs">{item.name}</span>
                <span className="font-mono font-bold text-rose-600 shrink-0 text-[11px] sm:text-xs">Out of Stock</span>
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
    <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-2xs font-display space-y-3 sm:space-y-4 min-w-0">
      <div className="flex items-center justify-between min-w-0">
        <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900 truncate">Top Selling Categories</h3>
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
  const navigate = useNavigate();

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshAnalytics();
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refreshAnalytics]);

  const handleSelectProduct = useCallback((target) => {
    if (!target) return;
    const slugOrId = typeof target === 'object' ? (target.slug || target.id || target.productId) : target;
    if (slugOrId) {
      navigate(`/product/${slugOrId}`);
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Product Analytics - Admin - Krishana Poshak</title>
      </Helmet>

      <div className="space-y-4 sm:space-y-5 font-display min-w-0">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/60 pb-3.5 sm:pb-4">
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight truncate">
              Product Demand Analytics
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500 font-body">
              Demand volume, rating distribution, wishlist velocity, and inventory health
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all disabled:opacity-50 min-h-[36px] sm:min-h-0 shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <FiRotateCw className={cn('h-3.5 w-3.5 text-amber-600', isRefreshing && 'animate-spin')} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-6 min-w-0">
          <TopSellingSection onSelectProduct={handleSelectProduct} />
          <TopRatedSection onSelectProduct={handleSelectProduct} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-6 min-w-0">
          <MostReviewedSection onSelectProduct={handleSelectProduct} />
          <MostWishlistedSection onSelectProduct={handleSelectProduct} />
        </div>

        {/* Inventory Stock Section */}
        <InventoryStockSection onSelectProduct={handleSelectProduct} />

        {/* Category Analytics */}
        <TopCategoriesSection />
      </div>
    </>
  );
}
