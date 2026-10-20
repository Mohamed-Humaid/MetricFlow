import React from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { formatCurrency, formatNumber, cn } from '../../utilities/formatters';
import type { KpiMetric } from '../../types';

export interface KpiCardProps {
  metric: KpiMetric;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ metric, className = '' }) => {
  const isPositive = metric.trend === 'positive' || metric.change > 0;
  const isNegative = metric.trend === 'negative' || metric.change < 0;

  // Resolve icon component dynamically
  const renderIcon = () => {
    const iconClass = 'w-5 h-5';
    switch (metric.iconName) {
      case 'DollarSign':
        return <DollarSign className={cn(iconClass, 'text-blue-400')} />;
      case 'ShoppingBag':
        return <ShoppingBag className={cn(iconClass, 'text-indigo-400')} />;
      case 'Users':
        return <Users className={cn(iconClass, 'text-cyan-400')} />;
      case 'TrendingUp':
        return <TrendingUp className={cn(iconClass, isPositive ? 'text-emerald-400' : 'text-rose-400')} />;
      default:
        return <DollarSign className={cn(iconClass, 'text-blue-400')} />;
    }
  };

  // Format value consistently using shared utilities
  const formattedValue =
    metric.formattedValue ??
    (metric.formatType === 'currency'
      ? formatCurrency(metric.rawValue)
      : metric.formatType === 'number'
      ? formatNumber(metric.rawValue)
      : `${metric.rawValue}%`);

  return (
    <Card
      glow
      className={cn(
        'flex flex-col justify-between p-5 transition-all duration-200 hover:-translate-y-0.5 bg-[#0d1527]/80 border-slate-800/90 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 group',
        className
      )}
    >
      <div>
        {/* Header: Title and Icon */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
            {metric.title}
          </span>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner group-hover:border-slate-600 transition-colors">
            {renderIcon()}
          </div>
        </div>

        {/* Metric Value & Target Badge */}
        <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            {formattedValue}
          </span>
          {metric.badgeText && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-md border border-slate-700/60">
              {metric.badgeText}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Trend Indicator & Comparison Label */}
      <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Clearly Distinguishable Positive and Negative Trend Indicator */}
          {isPositive ? (
            <Badge
              variant="success"
              size="sm"
              className="px-2 py-0.5 font-bold tracking-tight bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
            >
              <ArrowUpRight className="w-3.5 h-3.5 inline shrink-0" />
              <span>+{Math.abs(metric.change)}%</span>
            </Badge>
          ) : isNegative ? (
            <Badge
              variant="danger"
              size="sm"
              className="px-2 py-0.5 font-bold tracking-tight bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-sm shadow-rose-500/10"
            >
              <ArrowDownRight className="w-3.5 h-3.5 inline shrink-0" />
              <span>-{Math.abs(metric.change)}%</span>
            </Badge>
          ) : (
            <Badge variant="neutral" size="sm" className="px-2 py-0.5">
              <Minus className="w-3.5 h-3.5 inline shrink-0" />
              <span>0.0%</span>
            </Badge>
          )}

          <span className="text-slate-400 font-normal">
            {metric.comparisonLabel}
          </span>
        </div>
      </div>
    </Card>
  );
};
