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
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-md font-display max-w-xs z-50">
      <p className="text-[11px] font-bold text-slate-900 font-heading truncate">{label}</p>
      {data.unitsSold !== undefined && (
        <p className="mt-0.5 text-xs text-slate-600 font-body">
          Units Sold: <strong className="text-amber-900 font-mono">{data.unitsSold}</strong>
        </p>
      )}
      {data.revenue !== undefined && data.revenue !== null && (
        <p className="text-xs text-amber-800 font-mono font-bold">
          Revenue: {formatPrice(data.revenue)}
        </p>
      )}
      {data.averageRating !== undefined && (
        <p className="text-xs text-amber-700 font-bold">
          Rating: {Number(data.averageRating).toFixed(1)} / 5
        </p>
      )}
      {data.reviewCount !== undefined && (
        <p className="text-[11px] text-slate-500 font-body">
          Reviews: {data.reviewCount}
        </p>
      )}
      {data.wishlistCount !== undefined && (
        <p className="text-[11px] text-slate-500 font-body">
          Wishlisted: {data.wishlistCount}
        </p>
      )}
      {data.productsSold !== undefined && (
        <p className="text-[11px] text-slate-500 font-body">
          Products Sold: {data.productsSold}
        </p>
      )}
      {data.quantitySold !== undefined && (
        <p className="text-[11px] text-slate-500 font-body">
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
  color = '#d97706',
  label = 'Units Sold',
  onItemClick,
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
      <div className="flex h-44 sm:h-56 items-center justify-center w-full min-w-0 font-display" role="status" aria-label="Loading chart">
        <Skeleton variant="rect" className="h-36 sm:h-48 w-full rounded-xl bg-slate-100/60" />
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
        className="h-44 sm:h-56"
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-44 sm:h-56 items-center justify-center text-xs text-slate-400 font-body" role="status">
        No data available
      </div>
    );
  }

  return (
    <div className="h-44 sm:h-56 w-full min-w-0 font-display" role="img" aria-label={`Bar chart showing ${label}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 9, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 9, fill: '#334155' }}
            tickLine={false}
            axisLine={false}
            width={84}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.06)' }} />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[0, 4, 4, 0]}
            maxBarSize={18}
            aria-label={label}
            onClick={(entry) => {
              const rawData = entry?.payload || entry;
              if (onItemClick) {
                onItemClick(rawData);
              }
            }}
            className={onItemClick ? 'cursor-pointer hover:opacity-85' : ''}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(ProductBarChart);
