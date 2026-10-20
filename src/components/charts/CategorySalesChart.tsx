import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utilities/formatters';
import type { ProductCategorySales } from '../../types';
import { PieChart as PieIcon, Layers } from 'lucide-react';

export interface CategorySalesChartProps {
  data: ProductCategorySales[];
  title?: string;
  subtitle?: string;
}

const CATEGORY_COLORS = [
  '#38bdf8', // Cyan / Light Blue
  '#818cf8', // Indigo
  '#34d399', // Emerald
  '#f472b6', // Pink
  '#fbbf24', // Amber
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProductCategorySales & { color: string };
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#0b1329]/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-xs font-mono min-w-[200px] z-50">
        <div className="flex items-center gap-2 pb-1.5 mb-2 border-b border-slate-800">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-semibold text-white truncate">{item.category}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Total Revenue:</span>
            <span className="font-bold text-white font-mono">
              {formatCurrency(item.revenue)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Revenue Share:</span>
            <span className="font-bold text-cyan-400 font-mono">
              {item.percentageOfTotal}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Units Sold:</span>
            <span className="font-mono text-slate-300">{item.unitsSold.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CategorySalesChart: React.FC<CategorySalesChartProps> = ({
  data,
  title = 'Sales by Product Category',
  subtitle = 'Revenue distribution and unit volume across catalog lines',
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Gracefully handle empty datasets
  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center bg-[#0d1527]/80">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
          <PieIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <h4 className="text-base font-semibold text-white tracking-tight">
          No Category Data Available
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Category breakdown information is not currently recorded.
        </p>
      </Card>
    );
  }

  const totalCategoryRevenue = data.reduce((acc, d) => acc + d.revenue, 0);

  const enhancedData = data.map((item, index) => ({
    ...item,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  return (
    <Card className="flex flex-col bg-[#0d1527]/85 border-slate-800/90 hover:border-cyan-500/30 transition-all duration-200">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              {title}
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {data.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        <Badge variant="info" size="sm" className="font-mono">
          <Layers className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
          {formatCurrency(totalCategoryRevenue)}
        </Badge>
      </div>

      {/* Donut Chart Visual */}
      <div className="w-full h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={enhancedData}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={86}
              paddingAngle={3}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {enhancedData.map((entry, index) => (
                <Cell
                  key={`category-cell-${index}`}
                  fill={entry.color}
                  stroke="#070b14"
                  strokeWidth={activeIndex === index ? 3 : 1.5}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.15)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Callout inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
            {activeIndex !== null ? enhancedData[activeIndex]?.category : 'Total Sales'}
          </span>
          <span className="text-base sm:text-lg font-bold text-white font-mono">
            {activeIndex !== null
              ? `${enhancedData[activeIndex]?.percentageOfTotal}%`
              : formatCurrency(totalCategoryRevenue)}
          </span>
        </div>
      </div>

      {/* Structured Category Breakdown Legend */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
        {enhancedData.map((cat, idx) => (
          <div
            key={cat.category}
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center justify-between text-xs p-1 rounded-lg transition-colors cursor-pointer ${
              activeIndex === idx ? 'bg-slate-800/50' : 'hover:bg-slate-800/25'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-slate-300 truncate font-medium">{cat.category}</span>
            </div>

            <div className="flex items-center gap-3 font-mono shrink-0">
              <span className="text-slate-400 text-[11px]">{cat.percentageOfTotal}%</span>
              <span className="text-white font-semibold text-right min-w-[70px]">
                {formatCurrency(cat.revenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
