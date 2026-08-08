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
      <p className="mt-1 text-xs text-amber-900 font-mono font-bold">
        Revenue: {formatPrice(data.revenue)}
      </p>
      <p className="text-[11px] text-stone-500 font-body">
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
        <Skeleton variant="rect" className="h-48 w-full sm:h-64 rounded-2xl bg-amber-100/40" />
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
      <div className="flex h-56 items-center justify-center text-xs text-stone-500 sm:h-72 font-body" role="status">
        No sales data available
      </div>
    );
  }

  return (
    <div className="h-48 sm:h-60 lg:h-72 w-full min-w-0 font-display" role="img" aria-label="Sales chart showing revenue and orders over time">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#78350f' }}
            tickLine={false}
            axisLine={{ stroke: '#f1f5f9' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#78350f' }}
            tickLine={false}
            axisLine={{ stroke: '#f1f5f9' }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={38}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(217, 119, 6, 0.08)' }} />
          <Bar
            dataKey="revenue"
            fill="#78350f"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
            aria-label="Revenue bar"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(SalesChart);
