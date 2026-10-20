import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrency, formatCompactNumber } from '../../utilities/formatters';
import type { RevenueDataPoint } from '../../types';
import { BarChart3, TrendingUp, DollarSign, Eye, EyeOff } from 'lucide-react';

export interface RevenueChartProps {
  data: RevenueDataPoint[];
  title?: string;
  subtitle?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    payload: RevenueDataPoint;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rawPoint = payload[0].payload;
    const dateLabel = rawPoint.fullDate ? rawPoint.fullDate : label;
    const profitMargin =
      rawPoint.revenue > 0
        ? ((rawPoint.profit / rawPoint.revenue) * 100).toFixed(1)
        : '0.0';

    return (
      <div className="bg-[#0b1329]/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-xl text-xs font-mono min-w-[210px] z-50">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="text-slate-300 font-semibold">{dateLabel}</span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/20">
            {profitMargin}% margin
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              Gross Revenue:
            </span>
            <span className="font-bold text-white">
              {formatCurrency(rawPoint.revenue)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              Net Profit:
            </span>
            <span className="font-bold text-emerald-400">
              {formatCurrency(rawPoint.profit)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800/80 text-[11px] text-slate-500">
            <span>Operational Expenses:</span>
            <span>{formatCurrency(rawPoint.expenses)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  title = 'Revenue & Profit Growth',
  subtitle = 'Continuous performance tracking over the selected timeframe',
}) => {
  const [showProfit, setShowProfit] = useState<boolean>(true);
  const [showRevenue, setShowRevenue] = useState<boolean>(true);

  // Gracefully handle empty datasets
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center bg-[#0d1527]/80">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </div>
        <h4 className="text-base font-semibold text-white tracking-tight">
          No Revenue Records Available
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          No performance records match the active criteria. Try broadening your date range or adjusting filters.
        </p>
      </Card>
    );
  }

  const totalPeriodRevenue = data.reduce((acc, d) => acc + d.revenue, 0);
  const totalPeriodProfit = data.reduce((acc, d) => acc + d.profit, 0);
  const averageMargin =
    totalPeriodRevenue > 0
      ? ((totalPeriodProfit / totalPeriodRevenue) * 100).toFixed(1)
      : '0.0';

  return (
    <Card className="flex flex-col bg-[#0d1527]/85 border-slate-800/90 hover:border-blue-500/30 transition-all duration-200">
      {/* Chart Header & Aggregate Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              {title}
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {data.length} Data Points
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info" size="sm" className="font-mono">
            <DollarSign className="w-3.5 h-3.5 inline mr-0.5 text-blue-400" />
            Total: {formatCurrency(totalPeriodRevenue)}
          </Badge>
          <Badge variant="success" size="sm" className="font-mono">
            <TrendingUp className="w-3.5 h-3.5 inline mr-0.5 text-emerald-400" />
            Margin: {averageMargin}%
          </Badge>
        </div>
      </div>

      {/* Interactive Legend & Series Toggles */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-slate-800/70 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowRevenue((prev) => !prev)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer select-none font-medium ${
              showRevenue ? 'text-blue-400' : 'text-slate-600 line-through'
            }`}
            title="Toggle Revenue Series"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
            <span>Gross Revenue</span>
            {showRevenue ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>

          <button
            onClick={() => setShowProfit((prev) => !prev)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer select-none font-medium ${
              showProfit ? 'text-emerald-400' : 'text-slate-600 line-through'
            }`}
            title="Toggle Net Profit Series"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Net Profit</span>
            {showProfit ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          Showing {data[0]?.month} → {data[data.length - 1]?.month}
        </span>
      </div>

      {/* Main Responsive Recharts Area Container */}
      <div className="w-full h-72 sm:h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 12, right: 12, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Subtle Grid Lines for Dark Theme */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            {/* Formatted Readable X-Axis */}
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
              tick={{ fill: '#94a3b8' }}
            />

            {/* Formatted Y-Axis with Currency Units */}
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(val: number) => `$${formatCompactNumber(val)}`}
            />

            {/* Custom Interactive Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#38bdf8', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            {/* Revenue Area Curve */}
            {showRevenue && (
              <Area
                type="monotone"
                dataKey="revenue"
                name="Gross Revenue"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                activeDot={{ r: 5, fill: '#38bdf8', stroke: '#070b14', strokeWidth: 2 }}
              />
            )}

            {/* Profit Area Curve */}
            {showProfit && (
              <Area
                type="monotone"
                dataKey="profit"
                name="Net Profit"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#profitGradient)"
                activeDot={{ r: 4, fill: '#10b981', stroke: '#070b14', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
