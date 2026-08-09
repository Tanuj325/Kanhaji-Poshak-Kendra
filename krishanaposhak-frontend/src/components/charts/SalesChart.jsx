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
      <p className="mt-0.5 text-xs text-amber-800 font-mono font-bold">
        Revenue: {formatPrice(data.revenue)}
      </p>
      <p className="text-[10px] text-slate-500 font-body">
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
      <div className="flex h-44 sm:h-56 lg:h-64 items-center justify-center w-full min-w-0" role="status" aria-label="Loading chart">
        <Skeleton variant="rect" className="h-36 sm:h-48 lg:h-56 w-full rounded-xl bg-slate-100/60" />
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
        className="h-44 sm:h-56 lg:h-64"
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-44 sm:h-56 lg:h-64 items-center justify-center text-xs text-slate-400 font-body" role="status">
        No sales data available
      </div>
    );
  }

  return (
    <div className="h-44 sm:h-56 lg:h-64 w-full min-w-0 font-display" role="img" aria-label="Sales chart showing revenue and orders over time">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 6, right: 6, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            interval="preserveStartEnd"
            minTickGap={10}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(v) => {
              if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
              if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
              return `₹${v}`;
            }}
            width={38}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.06)' }} />
          <Bar
            dataKey="revenue"
            fill="#d97706"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            aria-label="Revenue bar"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(SalesChart);
