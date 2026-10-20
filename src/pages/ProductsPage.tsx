import React from 'react';
import { Card } from '../components/common/Card';
import { Badge, type BadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockProductCategorySales, mockProducts } from '../data/mockData';
import { formatCurrency } from '../utilities/formatters';
import { Plus, Package, Sparkles, Check, Users, TrendingUp } from 'lucide-react';
import type { ProductItem } from '../types';

const statusMap: Record<ProductItem['status'], BadgeVariant> = {
  active: 'success',
  beta: 'info',
  archived: 'neutral',
};

export const ProductsPage: React.FC = () => {
  const totalSubscribers = mockProducts.reduce((acc, p) => acc + p.subscribersCount, 0);
  const totalMrrContribution = mockProducts.reduce((acc, p) => acc + p.mrrContribution, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Products & Subscription Tiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure SaaS tiers, usage-based add-ons and pricing thresholds.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => alert('New Tier creation modal.')}
        >
          Create New Plan
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Live Catalog</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">
              {mockProducts.length} Plans & Addons
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Plan Subscribers</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">
              {totalSubscribers} active seats
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Tracked MRR</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              {formatCurrency(totalMrrContribution)}
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Category Performance</h3>
            <p className="text-xs text-slate-400">
              Revenue contribution, unit volume and growth across the catalog
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse text-sm">
            <caption className="sr-only">Product category performance</caption>
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/40 text-xs uppercase font-mono tracking-wider text-slate-400">
                <th scope="col" className="py-3 px-5">Category</th>
                <th scope="col" className="py-3 px-5 text-right">Revenue</th>
                <th scope="col" className="py-3 px-5 text-right">Units Sold</th>
                <th scope="col" className="py-3 px-5 text-right">Share</th>
                <th scope="col" className="py-3 px-5 text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {mockProductCategorySales.map((category) => (
                <tr key={category.category} className="hover:bg-slate-800/30 transition-colors">
                  <th scope="row" className="py-3.5 px-5 text-left font-medium text-white">
                    {category.category}
                  </th>
                  <td className="py-3.5 px-5 text-right font-mono text-white">
                    {formatCurrency(category.revenue)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-300">
                    {category.unitsSold.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-300">
                    {category.percentageOfTotal}%
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-emerald-400">
                    +{category.growth}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((prod) => (
          <Card key={prod.id} glow className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={statusMap[prod.status]} size="sm">
                  {prod.status}
                </Badge>
                <span className="text-xs font-mono text-slate-400 capitalize">
                  {prod.billingPeriod}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {prod.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                {prod.category}
              </p>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {formatCurrency(prod.price)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / {prod.billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Subscribers:
                  </span>
                  <span className="font-mono font-semibold text-white">
                    {prod.subscribersCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    MRR Generated:
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {formatCurrency(prod.mrrContribution)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={() => alert(`Editing tier: ${prod.name}`)}
              >
                Configure
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
