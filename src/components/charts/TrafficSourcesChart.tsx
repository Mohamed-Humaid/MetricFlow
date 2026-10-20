import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card } from '../common/Card';
import { formatCompactNumber } from '../../utilities/formatters';
import type { TrafficSource } from '../../types';

export interface TrafficSourcesChartProps {
  data: TrafficSource[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: TrafficSource;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono">
        <p className="text-white font-semibold">{item.name}</p>
        <p className="text-slate-400 mt-1">
          Visitors:{' '}
          <span className="text-cyan-400 font-bold">
            {item.visitors.toLocaleString()}
          </span>{' '}
          ({item.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ({ data }) => {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Acquisition Channels
          </h3>
          <p className="text-xs text-slate-400">
            Visitor breakdown across marketing funnels
          </p>
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => formatCompactNumber(val)}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visitors" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
        {data.slice(0, 4).map((source) => (
          <div key={source.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: source.color }}
            />
            <span className="text-slate-400 truncate">{source.name}:</span>
            <span className="text-white font-mono font-medium ml-auto">
              {source.percentage}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
