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
    <div className="rounded-2xl border border-amber-900/20 bg-white p-3.5 shadow-lg font-display">
      <p className="text-xs font-bold text-amber-950 font-heading">{label}</p>
      {data.unitsSold !== undefined && (
        <p className="mt-1 text-xs text-stone-600 font-body">
          Units Sold: <strong className="text-amber-950 font-mono">{data.unitsSold}</strong>
        </p>
      )}
      {data.revenue !== undefined && data.revenue !== null && (
        <p className="text-xs text-amber-900 font-mono font-bold">
          Revenue: {formatPrice(data.revenue)}
        </p>
      )}
      {data.averageRating !== undefined && (
        <p className="text-xs text-amber-700 font-bold">
          Rating: {Number(data.averageRating).toFixed(1)} / 5
        </p>
      )}
      {data.reviewCount !== undefined && (
        <p className="text-xs text-stone-500 font-body">
          Reviews: {data.reviewCount}
        </p>
      )}
      {data.wishlistCount !== undefined && (
        <p className="text-xs text-stone-500 font-body">
          Wishlisted: {data.wishlistCount}
        </p>
      )}
      {data.productsSold !== undefined && (
        <p className="text-xs text-stone-500 font-body">
          Products Sold: {data.productsSold}
        </p>
      )}
      {data.quantitySold !== undefined && (
        <p className="text-xs text-stone-500 font-body">
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
  color = '#78350f',
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
      <div className="flex h-52 items-center justify-center sm:h-64 font-display" role="status" aria-label="Loading chart">
        <Skeleton variant="rect" className="h-44 w-full sm:h-56 rounded-2xl bg-amber-100/40" />
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
        className="h-52 sm:h-64"
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center text-xs text-stone-500 sm:h-64 font-body" role="status">
        No data available
      </div>
    );
  }

  return (
    <div className="h-52 w-full sm:h-64 font-display" role="img" aria-label={`Bar chart showing ${label}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#78350f' }}
            tickLine={false}
            axisLine={{ stroke: '#f1f5f9' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#451a03' }}
            tickLine={false}
            axisLine={false}
            width={88}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(217, 119, 6, 0.08)' }} />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[0, 6, 6, 0]}
            maxBarSize={20}
            aria-label={label}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(ProductBarChart);
