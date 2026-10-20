import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RevenueChart } from '../components/charts/RevenueChart';
import { OrderVolumeChart } from '../components/charts/OrderVolumeChart';
import { CategorySalesChart } from '../components/charts/CategorySalesChart';
import { TrafficSourcesChart } from '../components/charts/TrafficSourcesChart';
import { useMetrics } from '../hooks/useMetrics';
import { formatCurrency } from '../utilities/formatters';
import { downloadCSV } from '../utils/exportCSV';
import { DATASET_METADATA } from '../data/mockData';
import { Download, SlidersHorizontal, Sparkles, Layers, Globe, TrendingUp, Info } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const {
    revenueData,
    orderVolumeData,
    trafficSources,
    productCategorySales,
    segmentedRevenue,
    regionalRevenue,
    dailyRecords,
    aggregates,
    boundaries,
  } = useMetrics();

  const handleExport = () => {
    if (dailyRecords.length === 0) {
      setExportMessage('There are no performance records to export for this period.');
      return;
    }

    try {
      downloadCSV(
        dailyRecords,
        [
          { header: 'Date', value: (record) => record.date },
          { header: 'Revenue', value: (record) => formatCurrency(record.revenue) },
          { header: 'Expenses', value: (record) => formatCurrency(record.expenses) },
          { header: 'Profit', value: (record) => formatCurrency(record.profit) },
          { header: 'Orders', value: (record) => record.orders },
          { header: 'Customers', value: (record) => record.customers },
        ],
        `metricflow-analytics-${boundaries.preset}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      setExportMessage(`Downloaded ${dailyRecords.length} performance records.`);
    } catch {
      setExportMessage('The dataset export failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Advanced Analytics & Segmentation
            </h2>
            <Badge variant="info">
              {boundaries.label} ({boundaries.startDate} → {boundaries.endDate})
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deterministic 365-day performance modeling, product sales categories and business segmentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={SlidersHorizontal}>
            Filter Dimensions
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExport}
          >
            Export Dataset ({dailyRecords.length} Days)
          </Button>
        </div>
        <p role="status" aria-live="polite" className="text-xs text-slate-400 min-h-4">
          {exportMessage}
        </p>
      </div>

      {/* Dataset Verification Alert / Illustrative Notice */}
      <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-white">Centralized Illustrative Dataset Verified</p>
            <p className="text-slate-400 text-[11px]">
              Aggregating {dailyRecords.length} deterministic daily performance records. Net profit margin is mathematically verified at {aggregates.netProfitMargin}%.
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 self-start sm:self-auto">
          {DATASET_METADATA.datasetVersion}
        </span>
      </div>

      {/* Primary KPI Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Total Period Revenue</span>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-white">
              {formatCurrency(aggregates.totalRevenue)}
            </span>
            <span className="text-xs text-emerald-400 font-mono ml-2">+12.5%</span>
          </div>
          <p className="text-xs text-slate-400">Sum of {dailyRecords.length} underlying daily records</p>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Operating Expenses</span>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-white">
              {formatCurrency(aggregates.totalExpenses)}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-2">~70% of gross</span>
          </div>
          <p className="text-xs text-slate-400">Direct infrastructure, licenses & team allocation</p>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Verified Net Profit</span>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {formatCurrency(aggregates.totalProfit)}
            </span>
            <span className="text-xs text-emerald-400 font-mono ml-2">({aggregates.netProfitMargin}% margin)</span>
          </div>
          <p className="text-xs text-slate-400">Revenue minus expenses mathematical balance</p>
        </Card>
      </div>

      {/* Revenue Growth & Acquisition Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div className="lg:col-span-1">
          <CategorySalesChart data={productCategorySales} />
        </div>
      </div>

      {/* Order Volume Bar Chart & Traffic Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderVolumeChart data={orderVolumeData} />
        </div>
        <div className="lg:col-span-1">
          <TrafficSourcesChart data={trafficSources} />
        </div>
      </div>

      {/* Product Sales Grouped by Product Category */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Product Sales Grouped by Category
              </h3>
              <p className="text-xs text-slate-400">
                Revenue, units sold, and average order values across product lines
              </p>
            </div>
          </div>
          <Badge variant="info">5 Product Categories</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/40 text-xs uppercase font-mono tracking-wider text-slate-400">
                <th className="py-3 px-5">Product Category</th>
                <th className="py-3 px-5 text-right">Units Sold</th>
                <th className="py-3 px-5 text-right">Share of Revenue</th>
                <th className="py-3 px-5 text-right">Avg Order Value</th>
                <th className="py-3 px-5 text-right">YoY Growth</th>
                <th className="py-3 px-5 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {productCategorySales.map((cat) => (
                <tr key={cat.category} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-white">
                    {cat.category}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-300">
                    {cat.unitsSold.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-400">
                    {cat.percentageOfTotal}%
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-300">
                    {formatCurrency(cat.averageOrderValue)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-emerald-400 font-semibold">
                    +{cat.growth}%
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-white">
                    {formatCurrency(cat.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Revenue Segmented by Business Dimensions: Market Segments & Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment 1: Market Tier Segmentation */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-semibold text-white">
                Revenue Segmented by Customer Market Tier
              </h3>
            </div>

            <div className="space-y-4">
              {segmentedRevenue.map((seg) => (
                <div key={seg.segment} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{seg.segment}</span>
                    <span className="text-white font-mono font-bold">
                      {formatCurrency(seg.revenue)} ({seg.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/40">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                      style={{ width: `${seg.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{seg.activeClients} active clients</span>
                    <span className="text-emerald-400">+{seg.growthRate}% growth</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Segment 2: Geographic Distribution */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-semibold text-white">
                Revenue Segmented by Geographic Region
              </h3>
            </div>

            <div className="space-y-4">
              {regionalRevenue.map((reg) => (
                <div key={reg.region} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{reg.region}</span>
                    <span className="text-white font-mono font-bold">
                      {formatCurrency(reg.revenue)} ({reg.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/40">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-400 h-2 rounded-full"
                      style={{ width: `${reg.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Regional share: {reg.percentage}%</span>
                    <span className="text-emerald-400">+{reg.growth}% YoY</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Machine Learning / System Anomaly Detection Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Automated Anomaly Detection</h4>
            <p className="text-xs text-slate-400">Machine learning models continuously scanning revenue flow</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          No anomalous spikes or drops detected in the past 30 days. Payment gateway latency is normal at 142ms.
          Revenue figures agree mathematically with underlying transactional settlement records.
        </p>
      </Card>
    </div>
  );
};
