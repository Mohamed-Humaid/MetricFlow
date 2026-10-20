import React from 'react';
import { KpiCard } from '../components/common/KpiCard';
import { RevenueChart } from '../components/charts/RevenueChart';
import { OrderVolumeChart } from '../components/charts/OrderVolumeChart';
import { CategorySalesChart } from '../components/charts/CategorySalesChart';
import { TrafficSourcesChart } from '../components/charts/TrafficSourcesChart';
import { TransactionsTable } from '../components/tables/TransactionsTable';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useMetrics } from '../hooks/useMetrics';
import { Zap, ShieldCheck, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const {
    kpiMetrics,
    revenueData,
    orderVolumeData,
    productCategorySales,
    trafficSources,
    transactions,
    funnelStages,
    boundaries,
  } = useMetrics();

  return (
    <div className="space-y-6 pb-12">
      {/* Banner / Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 border border-cyan-500/20 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Live Production Feed
            </span>
            <Badge variant="info" size="sm">
              v1.0.0
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome back, Alex
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time business performance overview for your software services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>
              {boundaries.label}: <strong className="text-white">{boundaries.startDate} → {boundaries.endDate}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Health: <strong className="text-emerald-400 font-mono">99.98%</strong></span>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Zap}
            onClick={() => alert('Generating AI Insights report...')}
          >
            Insights AI
          </Button>
        </div>
      </div>

      {/* Responsive KPI Metrics Grid: 1 col on mobile, 2 on medium, 4 on wide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpiMetrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Primary Visualizations: Revenue Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-1">
          <CategorySalesChart data={productCategorySales} />
        </div>
      </div>

      {/* Secondary Visualizations: Order Volume Bar Chart & Acquisition Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderVolumeChart data={orderVolumeData} />
        </div>
        <div className="lg:col-span-1">
          <TrafficSourcesChart data={trafficSources} />
        </div>
      </div>

      {/* Lower Section: Transactions & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionsTable
            transactions={transactions}
            exportPeriodLabel={boundaries.preset}
          />
        </div>

        {/* Funnel & Conversion Card */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    Acquisition Funnel
                  </h3>
                  <p className="text-xs text-slate-400">
                    Step-by-step visitor conversion
                  </p>
                </div>
                <Badge variant="info">Q4 Target</Badge>
              </div>

              <div className="space-y-3.5 mt-2">
                {funnelStages.map((stage, idx) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        {idx + 1}. {stage.stage}
                      </span>
                      <span className="text-cyan-400 font-mono font-semibold">
                        {stage.count.toLocaleString()} ({stage.conversionRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/40">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, stage.conversionRate)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Funnel Efficiency:</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                4.85% <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
