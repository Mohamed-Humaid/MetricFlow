import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatNumber, formatCurrency } from '../../utilities/formatters';
import type { OrderVolumeDataPoint } from '../../types';
import { ShoppingBag, TrendingUp } from 'lucide-react';

export interface OrderVolumeChartProps {
  data: OrderVolumeDataPoint[];
  title?: string;
  subtitle?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: OrderVolumeDataPoint;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rawPoint = payload[0].payload;
    const dateLabel = rawPoint.fullDate ? rawPoint.fullDate : label;

    return (
      <div className="bg-[#0b1329]/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-xs font-mono min-w-[180px] z-50">
        <p className="text-slate-300 font-semibold mb-2 pb-1.5 border-b border-slate-800">
          {dateLabel}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
              Orders Fulfilled:
            </span>
            <span className="font-bold text-white">
              {formatNumber(rawPoint.orders)}
            </span>
          </div>

          {rawPoint.revenue !== undefined && (
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span>Period Revenue:</span>
              <span className="text-emerald-400 font-semibold font-mono">
                {formatCurrency(rawPoint.revenue)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const OrderVolumeChart: React.FC<OrderVolumeChartProps> = ({
  data,
  title = 'Order Volume Over Time',
  subtitle = 'Comparative transaction velocity and checkout frequency',
}) => {
  // Graceful empty state handling
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center bg-[#0d1527]/80">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
          <ShoppingBag className="w-6 h-6 text-indigo-400" />
        </div>
        <h4 className="text-base font-semibold text-white tracking-tight">
          No Order Records Available
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          No order records were logged for the selected time duration.
        </p>
      </Card>
    );
  }

  const totalOrders = data.reduce((acc, d) => acc + d.orders, 0);
  const peakOrders = Math.max(...data.map((d) => d.orders));

  return (
    <Card className="flex flex-col bg-[#0d1527]/85 border-slate-800/90 hover:border-indigo-500/30 transition-all duration-200">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              {title}
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {data.length} Intervals
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm" className="font-mono bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
            <ShoppingBag className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
            Total: {formatNumber(totalOrders)}
          </Badge>
          <Badge variant="success" size="sm" className="font-mono">
            <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
            Peak: {formatNumber(peakOrders)}
          </Badge>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="w-full h-64 sm:h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="orderBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.55} />
              </linearGradient>
            </defs>

            {/* Subtle grid lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            {/* Formatted X-Axis */}
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
              tick={{ fill: '#94a3b8' }}
            />

            {/* Formatted Y-Axis */}
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(val: number) => formatNumber(val)}
            />

            {/* Custom Interactive Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
            />

            {/* Bar with rounded top caps */}
            <Bar
              dataKey="orders"
              name="Order Volume"
              fill="url(#orderBarGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
