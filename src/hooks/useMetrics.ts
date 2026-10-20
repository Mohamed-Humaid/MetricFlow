import { useMemo } from 'react';
import { useDashboard } from './useDashboard';
import {
  mockDailyPerformanceRecords,
  mockTrafficSources,
  mockRecentTransactions,
  mockFunnelStages,
  mockProductCategorySales,
  mockSegmentedRevenue,
  mockRegionalRevenue,
} from '../data/mockData';
import {
  getDateRangeBoundaries,
  filterByDateWindow,
  calculatePeriodComparison,
  type DateRangeBoundary,
} from '../utilities/dateFilters';
import { formatCurrency, formatNumber, formatShortDate } from '../utilities/formatters';
import type {
  KpiMetric,
  MetricCardData,
  Transaction,
  DailyPerformanceRecord,
  RevenueDataPoint,
  OrderVolumeDataPoint,
  ProductCategorySales,
} from '../types';

export function useMetrics() {
  const { timeRange, searchQuery } = useDashboard();

  // 1. Get explicit, timezone-safe reporting period boundaries
  const boundaries: DateRangeBoundary = useMemo(() => {
    return getDateRangeBoundaries(timeRange);
  }, [timeRange]);

  // 2. Filter underlying records for current period and equivalent previous period
  const currentDailyRecords: DailyPerformanceRecord[] = useMemo(() => {
    return filterByDateWindow(
      mockDailyPerformanceRecords,
      boundaries.startDate,
      boundaries.endDate
    );
  }, [boundaries]);

  const previousDailyRecords: DailyPerformanceRecord[] = useMemo(() => {
    return filterByDateWindow(
      mockDailyPerformanceRecords,
      boundaries.previousStartDate,
      boundaries.previousEndDate
    );
  }, [boundaries]);

  // 3. Mathematical aggregates for current period
  const currentAggregates = useMemo(() => {
    const totals = currentDailyRecords.reduce(
      (acc, cur) => {
        acc.revenue += cur.revenue;
        acc.expenses += cur.expenses;
        acc.profit += cur.profit;
        acc.orders += cur.orders;
        acc.customers += cur.customers;
        return acc;
      },
      { revenue: 0, expenses: 0, profit: 0, orders: 0, customers: 0 }
    );
    const netProfitMargin =
      totals.revenue > 0 ? Number(((totals.profit / totals.revenue) * 100).toFixed(1)) : 0;
    return { ...totals, netProfitMargin };
  }, [currentDailyRecords]);

  // 4. Mathematical aggregates for equivalent previous period
  const previousAggregates = useMemo(() => {
    return previousDailyRecords.reduce(
      (acc, cur) => {
        acc.revenue += cur.revenue;
        acc.expenses += cur.expenses;
        acc.profit += cur.profit;
        acc.orders += cur.orders;
        acc.customers += cur.customers;
        return acc;
      },
      { revenue: 0, expenses: 0, profit: 0, orders: 0, customers: 0 }
    );
  }, [previousDailyRecords]);

  // 5. Calculate comparison percentages against equivalent previous period
  const revenueComparison = useMemo(() => {
    return calculatePeriodComparison(currentAggregates.revenue, previousAggregates.revenue);
  }, [currentAggregates.revenue, previousAggregates.revenue]);

  const ordersComparison = useMemo(() => {
    return calculatePeriodComparison(currentAggregates.orders, previousAggregates.orders);
  }, [currentAggregates.orders, previousAggregates.orders]);

  const customersComparison = useMemo(() => {
    return calculatePeriodComparison(currentAggregates.customers, previousAggregates.customers);
  }, [currentAggregates.customers, previousAggregates.customers]);

  const profitComparison = useMemo(() => {
    return calculatePeriodComparison(currentAggregates.profit, previousAggregates.profit);
  }, [currentAggregates.profit, previousAggregates.profit]);

  // 6. Filter transactions by both date window and search query
  const filteredTransactions = useMemo(() => {
    const inWindow = filterByDateWindow(
      mockRecentTransactions,
      boundaries.startDate,
      boundaries.endDate
    );

    if (!searchQuery.trim()) {
      return inWindow;
    }
    const query = searchQuery.toLowerCase();
    return inWindow.filter(
      (tx: Transaction) =>
        tx.customerName.toLowerCase().includes(query) ||
        tx.customerEmail.toLowerCase().includes(query) ||
        tx.service.toLowerCase().includes(query) ||
        tx.id.toLowerCase().includes(query) ||
        tx.paymentMethod.toLowerCase().includes(query)
    );
  }, [boundaries, searchQuery]);

  // 7. Strongly typed KPI Metrics derived strictly from underlying records
  const kpiMetrics = useMemo<KpiMetric[]>(() => {
    return [
      {
        id: 'total-revenue',
        title: 'Total Revenue',
        rawValue: currentAggregates.revenue,
        formatType: 'currency',
        formattedValue: formatCurrency(currentAggregates.revenue),
        change: revenueComparison.changePercentage,
        trend: revenueComparison.trend,
        comparisonLabel: boundaries.comparisonLabel,
        iconName: 'DollarSign',
        badgeText: boundaries.label,
      },
      {
        id: 'total-orders',
        title: 'Total Orders',
        rawValue: currentAggregates.orders,
        formatType: 'number',
        formattedValue: formatNumber(currentAggregates.orders),
        change: ordersComparison.changePercentage,
        trend: ordersComparison.trend,
        comparisonLabel: boundaries.comparisonLabel,
        iconName: 'ShoppingBag',
        badgeText: `${currentAggregates.orders} orders`,
      },
      {
        id: 'total-customers',
        title: 'Total Customers',
        rawValue: currentAggregates.customers,
        formatType: 'number',
        formattedValue: formatNumber(currentAggregates.customers),
        change: customersComparison.changePercentage,
        trend: customersComparison.trend,
        comparisonLabel: boundaries.comparisonLabel,
        iconName: 'Users',
        badgeText: 'Active in period',
      },
      {
        id: 'net-profit',
        title: 'Net Profit',
        rawValue: currentAggregates.profit,
        formatType: 'currency',
        formattedValue: formatCurrency(currentAggregates.profit),
        change: profitComparison.changePercentage,
        trend: profitComparison.trend,
        comparisonLabel: boundaries.comparisonLabel,
        iconName: 'TrendingUp',
        badgeText: `${currentAggregates.netProfitMargin}% margin`,
      },
    ];
  }, [
    currentAggregates,
    revenueComparison,
    ordersComparison,
    customersComparison,
    profitComparison,
    boundaries,
  ]);

  const legacyMetrics = useMemo<MetricCardData[]>(() => {
    return kpiMetrics.map((k) => ({
      id: k.id,
      title: k.title,
      value: k.formattedValue ?? formatCurrency(k.rawValue),
      change: k.change,
      trend: k.trend === 'positive' ? 'up' : 'down',
      periodText: k.comparisonLabel,
      iconName: k.iconName,
      badgeText: k.badgeText,
    }));
  }, [kpiMetrics]);

  // 8. Chart revenue points dynamically prepared for current period
  const dynamicRevenueData: RevenueDataPoint[] = useMemo(() => {
    if (boundaries.preset === 'ytd') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const map: Record<string, { revenue: number; expenses: number; profit: number }> = {};
      currentDailyRecords.forEach((r) => {
        const m = monthNames[new Date(r.date + 'T00:00:00Z').getUTCMonth()];
        if (!map[m]) map[m] = { revenue: 0, expenses: 0, profit: 0 };
        map[m].revenue += r.revenue;
        map[m].expenses += r.expenses;
        map[m].profit += r.profit;
      });
      return monthNames.map((m) => ({
        month: m,
        revenue: map[m]?.revenue ?? 0,
        expenses: map[m]?.expenses ?? 0,
        profit: map[m]?.profit ?? 0,
      }));
    }

    return currentDailyRecords.map((r) => ({
      month: formatShortDate(r.date),
      fullDate: r.date,
      revenue: r.revenue,
      expenses: r.expenses,
      profit: r.profit,
    }));
  }, [boundaries.preset, currentDailyRecords]);

  // 9. Order volume data dynamically prepared for current period
  const dynamicOrderVolumeData: OrderVolumeDataPoint[] = useMemo(() => {
    if (boundaries.preset === 'ytd') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const map: Record<string, { orders: number; revenue: number }> = {};
      currentDailyRecords.forEach((r) => {
        const m = monthNames[new Date(r.date + 'T00:00:00Z').getUTCMonth()];
        if (!map[m]) map[m] = { orders: 0, revenue: 0 };
        map[m].orders += r.orders;
        map[m].revenue += r.revenue;
      });
      return monthNames.map((m) => ({
        label: m,
        orders: map[m]?.orders ?? 0,
        revenue: map[m]?.revenue ?? 0,
      }));
    }

    return currentDailyRecords.map((r) => ({
      label: formatShortDate(r.date),
      fullDate: r.date,
      orders: r.orders,
      revenue: r.revenue,
    }));
  }, [boundaries.preset, currentDailyRecords]);

  // 10. Product category sales dynamically consistent with current period total revenue
  const dynamicCategorySales: ProductCategorySales[] = useMemo(() => {
    return mockProductCategorySales.map((cat) => {
      const catRevenue = Math.round(currentAggregates.revenue * (cat.percentageOfTotal / 100));
      const catUnits = Math.max(1, Math.round(currentAggregates.orders * (cat.percentageOfTotal / 100)));
      return {
        ...cat,
        revenue: catRevenue,
        unitsSold: catUnits,
      };
    });
  }, [currentAggregates.revenue, currentAggregates.orders]);

  return {
    kpiMetrics,
    metrics: legacyMetrics,
    dailyRecords: currentDailyRecords,
    aggregates: {
      totalRevenue: currentAggregates.revenue,
      totalExpenses: currentAggregates.expenses,
      totalProfit: currentAggregates.profit,
      totalOrders: currentAggregates.orders,
      totalCustomers: currentAggregates.customers,
      netProfitMargin: currentAggregates.netProfitMargin,
    },
    revenueData: dynamicRevenueData,
    orderVolumeData: dynamicOrderVolumeData,
    trafficSources: mockTrafficSources,
    transactions: filteredTransactions,
    funnelStages: mockFunnelStages,
    productCategorySales: dynamicCategorySales,
    segmentedRevenue: mockSegmentedRevenue,
    regionalRevenue: mockRegionalRevenue,
    timeRange,
    boundaries,
  };
}
