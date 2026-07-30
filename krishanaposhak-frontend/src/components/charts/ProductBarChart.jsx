import { memo, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import { formatPrice } from '@/utils/formatPrice';

const CustomTooltip = memo(function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-muted-sand/30 bg-white p-3 shadow-card">
      <p className="text-sm font-medium text-dark-charcoal">{label}</p>
      {data.unitsSold !== undefined && (
        <p className="mt-1 text-sm text-natural-wood">
          Units Sold: {data.unitsSold}
        </p>
      )}
      {data.revenue !== undefined && data.revenue !== null && (
        <p className="text-sm text-royal-blue">
          Revenue: {formatPrice(data.revenue)}
        </p>
      )}
      {data.averageRating !== undefined && (
        <p className="text-sm text-temple-gold">
          Rating: {Number(data.averageRating).toFixed(1)} / 5
        </p>
      )}
      {data.reviewCount !== undefined && (
        <p className="text-sm text-natural-wood">
          Reviews: {data.reviewCount}
        </p>
      )}
      {data.wishlistCount !== undefined && (
        <p className="text-sm text-natural-wood">
          Wishlisted: {data.wishlistCount}
        </p>
      )}
      {data.productsSold !== undefined && (
        <p className="text-sm text-natural-wood">
          Products Sold: {data.productsSold}
        </p>
      )}
      {data.quantitySold !== undefined && (
        <p className="text-sm text-natural-wood">
          Quantity: {data.quantitySold}
        </p>
      )}
    </div>
  );
});

function ProductBarChart({
  data,
  isLoading,
  error,
  onRetry,
  dataKey = 'unitsSold',
  color = '#4F46E5',
  label = 'Units Sold',
}) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((d) => ({
      ...d,
      name: d.name || d.label || '',
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center" role="status" aria-label="Loading chart">
        <Skeleton variant="rect" className="h-56 w-full" />
        <span className="sr-only">Loading chart data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load data"
        message={error}
        onRetry={onRetry}
        className="h-64"
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-natural-wood" role="status">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64 w-full" role="img" aria-label={`Bar chart showing ${label}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#8B7355' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#2D2D2D' }}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
            aria-label={label}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(ProductBarChart);

