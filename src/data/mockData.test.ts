import { describe, expect, it } from 'vitest';
import { getAggregateTotalsForRange, mockDailyPerformanceRecords } from './mockData';

describe('performance aggregates', () => {
  it('derives revenue, expenses, profit, orders and customers from daily records', () => {
    const result = getAggregateTotalsForRange('7d');
    const records = mockDailyPerformanceRecords.slice(-7);
    const expected = records.reduce(
      (totals, record) => ({
        totalRevenue: totals.totalRevenue + record.revenue,
        totalExpenses: totals.totalExpenses + record.expenses,
        totalProfit: totals.totalProfit + record.profit,
        totalOrders: totals.totalOrders + record.orders,
        totalCustomers: totals.totalCustomers + record.customers,
      }),
      { totalRevenue: 0, totalExpenses: 0, totalProfit: 0, totalOrders: 0, totalCustomers: 0 }
    );

    expect(result).toMatchObject(expected);
    expect(result.totalProfit).toBe(result.totalRevenue - result.totalExpenses);
    expect(result.netProfitMargin).toBe(
      Number(((result.totalProfit / result.totalRevenue) * 100).toFixed(1))
    );
  });

  it('returns the expected record count for supported ranges', () => {
    expect(getAggregateTotalsForRange('7d').totalOrders).toBeGreaterThan(0);
    expect(mockDailyPerformanceRecords.slice(-30)).toHaveLength(30);
    expect(mockDailyPerformanceRecords.slice(-90)).toHaveLength(90);
    expect(mockDailyPerformanceRecords.slice(-365)).toHaveLength(365);
  });
});
