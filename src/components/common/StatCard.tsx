import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, TrendingUp, Activity, HelpCircle } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import type { MetricCardData } from '../../types';

export interface StatCardProps {
  data: MetricCardData;
}

export const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const isUp = data.trend === 'up';
  const isPositive = data.change >= 0;

  // Resolve icon component dynamically
  const renderIcon = () => {
    switch (data.iconName) {
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-cyan-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-purple-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <Card glow className="flex flex-col justify-between hover:-translate-y-0.5">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {data.title}
          </span>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
            {renderIcon()}
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            {data.value}
          </span>
          {data.badgeText && (
            <span className="text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
              {data.badgeText}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <Badge
            variant={isUp ? 'success' : 'danger'}
            size="sm"
            className="px-1.5 py-0"
          >
            {isUp ? (
              <ArrowUpRight className="w-3.5 h-3.5 inline" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 inline" />
            )}
            <span>{isPositive ? `+${data.change}%` : `${data.change}%`}</span>
          </Badge>
          <span className="text-slate-400">{data.periodText}</span>
        </div>
      </div>
    </Card>
  );
};
