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
      <p className="mt-1 text-sm text-royal-blue">
        Revenue: {formatPrice(data.revenue)}
      </p>
      <p className="text-sm text-natural-wood">
        Orders: {data.orders ?? 0}
      </p>
    </div>
  );
});

function SalesChart({ data, isLoading, error, onRetry }) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((d) => ({
      label: d.label,
      revenue: d.revenue ?? 0,
      orders: d.orders ?? 0,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center sm:h-72" role="status" aria-label="Loading chart">
        <Skeleton variant="rect" className="h-48 w-full sm:h-64" />
        <span className="sr-only">Loading sales chart...</span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load sales data"
        message={error}
        onRetry={onRetry}
        className="h-56 sm:h-72"
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-natural-wood sm:h-72" role="status">
        No sales data available
      </div>
    );
  }

  return (
    <div className="h-56 w-full sm:h-72" role="img" aria-label="Sales chart showing revenue and orders over time">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#8B7355' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8B7355' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
          <Bar
            dataKey="revenue"
            fill="#4F46E5"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            aria-label="Revenue bar"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(SalesChart);

