/**
 * CENTRALIZED MOCK DATASET FOR METRICFLOW ANALYTICS
 *
 * NOTE: All records in this file are purely illustrative simulated benchmark data
 * for frontend development, testing, and UI validation. No external APIs or
 * databases are utilized.
 */

import type {
  DailyPerformanceRecord,
  Transaction,
  ProductCategorySales,
  SegmentedRevenue,
  RegionalRevenue,
  ProductItem,
  CustomerItem,
  NotificationItem,
  TrafficSource,
  FunnelStage,
  TimeRange,
  KpiMetric,
  MetricCardData,
} from '../types';

export const DATASET_METADATA = {
  isIllustrativeDemoData: true,
  datasetVersion: '2.0.0-deterministic',
  anchorDate: '2026-10-18',
  retentionWindowDays: 365,
  description: 'Deterministic benchmark dataset for MetricFlow SaaS analytics demonstration.',
} as const;

/* -------------------------------------------------------------------------- */
/* 1. Deterministic Pseudo-Random Generator (Mulberry32)                      */
/* -------------------------------------------------------------------------- */
function createSeededRandom(initialSeed: number = 42) {
  let s = initialSeed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/* 2. 365-Day Daily Performance Records (2025-10-19 to 2026-10-18)            */
/* -------------------------------------------------------------------------- */
export function generateDailyRecords(): DailyPerformanceRecord[] {
  const prng = createSeededRandom(1048576);
  const records: DailyPerformanceRecord[] = [];
  const anchor = new Date('2026-10-18T00:00:00Z');

  // Baseline figures calibrated so 365-day total revenue ~ $1,284,500,
  // 30-day total ~ $128,450, and 7-day total ~ $30,200.
  for (let i = 364; i >= 0; i--) {
    const d = new Date(anchor);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Day of week: 0 = Sun, 6 = Sat (weekends have slight SaaS volume dip)
    const dayOfWeek = d.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayFactor = isWeekend ? 0.72 : 1.08;

    // Gradual linear growth over 365 days (from 0.85x up to 1.25x)
    const progress = (365 - i) / 365;
    const growthMultiplier = 0.82 + progress * 0.44;

    // Small deterministic variance (+- 10%)
    const variance = 0.92 + prng() * 0.16;

    const baseRev = 3450;
    const dailyRev = Math.round(baseRev * growthMultiplier * dayFactor * variance);

    // Expenses represent roughly 68-72% of revenue
    const expenseRatio = 0.68 + (prng() * 0.05);
    const dailyExpenses = Math.round(dailyRev * expenseRatio);
    const dailyProfit = dailyRev - dailyExpenses; // exact mathematical agreement

    // Orders scale with revenue (avg order value ~ $70)
    const dailyOrders = Math.max(12, Math.round((dailyRev / 72) * (0.95 + prng() * 0.1)));

    // Active daily customer interactions
    const dailyCustomers = Math.max(8, Math.round(dailyOrders * 0.52));

    records.push({
      date: dateStr,
      revenue: dailyRev,
      expenses: dailyExpenses,
      profit: dailyProfit,
      orders: dailyOrders,
      customers: dailyCustomers,
    });
  }

  return records;
}

export const mockDailyPerformanceRecords: DailyPerformanceRecord[] = generateDailyRecords();

/* -------------------------------------------------------------------------- */
/* 3. Range Filtering & Exact Aggregation Helpers                             */
/* -------------------------------------------------------------------------- */
export function getPerformanceRecordsForRange(range: TimeRange): DailyPerformanceRecord[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  return mockDailyPerformanceRecords.slice(-days);
}

export interface AggregatePerformanceMetrics {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalOrders: number;
  totalCustomers: number;
  netProfitMargin: number; // percentage, e.g. 30.0%
}

export function getAggregateTotalsForRange(range: TimeRange): AggregatePerformanceMetrics {
  const records = getPerformanceRecordsForRange(range);
  const totals = records.reduce(
    (acc, cur) => {
      acc.totalRevenue += cur.revenue;
      acc.totalExpenses += cur.expenses;
      acc.totalProfit += cur.profit;
      acc.totalOrders += cur.orders;
      acc.totalCustomers += cur.customers;
      return acc;
    },
    { totalRevenue: 0, totalExpenses: 0, totalProfit: 0, totalOrders: 0, totalCustomers: 0 }
  );

  const netProfitMargin =
    totals.totalRevenue > 0
      ? Number(((totals.totalProfit / totals.totalRevenue) * 100).toFixed(1))
      : 0;

  return {
    ...totals,
    netProfitMargin,
  };
}

/* -------------------------------------------------------------------------- */
/* 4. Monthly Trend Data (Aggregated directly from Daily Records)              */
/* -------------------------------------------------------------------------- */
export interface MonthlyAggregate {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export function generateMonthlyAggregates(): MonthlyAggregate[] {
  const monthMap: Record<string, { revenue: number; expenses: number; profit: number }> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Take the last 10-12 months from daily records
  mockDailyPerformanceRecords.forEach((record) => {
    const d = new Date(record.date + 'T00:00:00Z');
    const mName = monthNames[d.getUTCMonth()];
    if (!monthMap[mName]) {
      monthMap[mName] = { revenue: 0, expenses: 0, profit: 0 };
    }
    monthMap[mName].revenue += record.revenue;
    monthMap[mName].expenses += record.expenses;
    monthMap[mName].profit += record.profit;
  });

  // Display Jan - Oct 2026
  const orderedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  return orderedMonths.map((m) => ({
    month: m,
    revenue: monthMap[m]?.revenue ?? 80000,
    expenses: monthMap[m]?.expenses ?? 45000,
    profit: monthMap[m]?.profit ?? 35000,
  }));
}

export const mockRevenueTrends = generateMonthlyAggregates();

/* -------------------------------------------------------------------------- */
/* 5. Product Sales Grouped by Product Category                               */
/* -------------------------------------------------------------------------- */
export const mockProductCategorySales: ProductCategorySales[] = [
  {
    category: 'Enterprise Subscriptions',
    revenue: 624500,
    unitsSold: 430,
    percentageOfTotal: 48.6,
    averageOrderValue: 1452.32,
    growth: 16.4,
  },
  {
    category: 'Pro Analytics Suite',
    revenue: 412800,
    unitsSold: 712,
    percentageOfTotal: 32.1,
    averageOrderValue: 579.77,
    growth: 12.8,
  },
  {
    category: 'Starter Developer Tiers',
    revenue: 148200,
    unitsSold: 745,
    percentageOfTotal: 11.5,
    averageOrderValue: 198.92,
    growth: 6.2,
  },
  {
    category: 'Real-time Kafka Pipelines',
    revenue: 64200,
    unitsSold: 85,
    percentageOfTotal: 5.0,
    averageOrderValue: 755.29,
    growth: 24.5,
  },
  {
    category: 'Dedicated Compliance Addons',
    revenue: 34800,
    unitsSold: 29,
    percentageOfTotal: 2.8,
    averageOrderValue: 1200.00,
    growth: 8.1,
  },
];

/* -------------------------------------------------------------------------- */
/* 6. Revenue Segmented by Business Customer Tiers                            */
/* -------------------------------------------------------------------------- */
export const mockSegmentedRevenue: SegmentedRevenue[] = [
  {
    segment: 'Enterprise Organizations (ARR > $50k)',
    revenue: 680800,
    percentage: 53.0,
    activeClients: 142,
    averageContractValue: 4794,
    growthRate: 18.5,
  },
  {
    segment: 'Mid-Market Scaleups (ARR $10k - $50k)',
    revenue: 398200,
    percentage: 31.0,
    activeClients: 368,
    averageContractValue: 1082,
    growthRate: 14.1,
  },
  {
    segment: 'Growth SMBs (ARR $2k - $10k)',
    revenue: 154150,
    percentage: 12.0,
    activeClients: 820,
    averageContractValue: 188,
    growthRate: 7.6,
  },
  {
    segment: 'Early Stage & Developers (ARR < $2k)',
    revenue: 51350,
    percentage: 4.0,
    activeClients: 1240,
    averageContractValue: 41,
    growthRate: 4.2,
  },
];

/* -------------------------------------------------------------------------- */
/* 7. Revenue Segmented by Geographic Region                                  */
/* -------------------------------------------------------------------------- */
export const mockRegionalRevenue: RegionalRevenue[] = [
  { region: 'North America', revenue: 668000, percentage: 52.0, growth: 14.2 },
  { region: 'Europe (EMEA)', revenue: 385350, percentage: 30.0, growth: 12.0 },
  { region: 'Asia-Pacific (APAC)', revenue: 167000, percentage: 13.0, growth: 22.4 },
  { region: 'Latin America (LATAM)', revenue: 64150, percentage: 5.0, growth: 9.8 },
];

/* -------------------------------------------------------------------------- */
/* 8. Transaction Records (Consistent with ID, Customer, Amount, Method)      */
/* -------------------------------------------------------------------------- */
export const mockRecentTransactions: Transaction[] = [
  // Last 7 days (Oct 12 - Oct 18, 2026)
  {
    id: 'tx-901',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@vertexlabs.io',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    amount: 1450.00,
    status: 'completed',
    date: '2026-10-18T14:23:00Z',
    service: 'Enterprise Annual Tier',
    paymentMethod: 'stripe',
  },
  {
    id: 'tx-902',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@solardyne.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    amount: 580.00,
    status: 'completed',
    date: '2026-10-18T11:45:00Z',
    service: 'Pro Analytics Suite',
    paymentMethod: 'credit_card',
  },
  {
    id: 'tx-903',
    customerName: 'Elena Rostova',
    customerEmail: 'e.rostova@fintech-ai.de',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    amount: 2200.00,
    status: 'pending',
    date: '2026-10-18T09:12:00Z',
    service: 'Custom Data Pipeline SLA',
    paymentMethod: 'bank_transfer',
  },
  {
    id: 'tx-904',
    customerName: 'David Kalu',
    customerEmail: 'david@zenithcloud.co',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    amount: 290.00,
    status: 'completed',
    date: '2026-10-17T18:30:00Z',
    service: 'Team Seat Addon',
    paymentMethod: 'apple_pay',
  },
  {
    id: 'tx-905',
    customerName: 'Aria Tanaka',
    customerEmail: 'aria.t@hypermetrics.jp',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    amount: 890.00,
    status: 'refunded',
    date: '2026-10-16T15:10:00Z',
    service: 'Consulting Session',
    paymentMethod: 'credit_card',
  },
  {
    id: 'tx-906',
    customerName: 'Lucas Braun',
    customerEmail: 'l.braun@aurorainsights.ch',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    amount: 199.00,
    status: 'completed',
    date: '2026-10-14T20:15:00Z',
    service: 'Starter Analytics Pro',
    paymentMethod: 'paypal',
  },

  // Last 30 days (Sep 19 - Oct 11, 2026)
  {
    id: 'tx-907',
    customerName: 'Chen Wei',
    customerEmail: 'chen.wei@nexusquantum.sg',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    amount: 1450.00,
    status: 'completed',
    date: '2026-10-08T08:44:00Z',
    service: 'Enterprise Annual Tier',
    paymentMethod: 'stripe',
  },
  {
    id: 'tx-908',
    customerName: 'Maya Patel',
    customerEmail: 'maya@orbitalfin.in',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    amount: 580.00,
    status: 'completed',
    date: '2026-10-02T16:20:00Z',
    service: 'Pro Analytics Suite',
    paymentMethod: 'bank_transfer',
  },
  {
    id: 'tx-909',
    customerName: 'Sofia Rossi',
    customerEmail: 's.rossi@milano-tech.it',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    amount: 1200.00,
    status: 'completed',
    date: '2026-09-24T12:00:00Z',
    service: 'Dedicated HIPAA / SOC2 Instance',
    paymentMethod: 'stripe',
  },

  // Last 90 days (Jul 21 - Sep 18, 2026)
  {
    id: 'tx-910',
    customerName: 'Liam O’Connor',
    customerEmail: 'liam@dublindata.ie',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    amount: 750.00,
    status: 'completed',
    date: '2026-09-08T10:15:00Z',
    service: 'Custom Real-time Kafka Pipelines',
    paymentMethod: 'credit_card',
  },
  {
    id: 'tx-911',
    customerName: 'Hanna Lindqvist',
    customerEmail: 'hanna@nordicmetrics.se',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    amount: 1450.00,
    status: 'completed',
    date: '2026-08-19T14:40:00Z',
    service: 'Enterprise Annual Tier',
    paymentMethod: 'bank_transfer',
  },
  {
    id: 'tx-912',
    customerName: 'Tariq Mansour',
    customerEmail: 'tariq@cairocloud.eg',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    amount: 580.00,
    status: 'completed',
    date: '2026-08-01T09:30:00Z',
    service: 'Pro Analytics Suite',
    paymentMethod: 'stripe',
  },

  // This year / Earlier in 2026
  {
    id: 'tx-913',
    customerName: 'Gabriela Santos',
    customerEmail: 'g.santos@saopaulo-ai.br',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    amount: 2400.00,
    status: 'completed',
    date: '2026-06-15T11:10:00Z',
    service: 'Enterprise Annual Tier',
    paymentMethod: 'bank_transfer',
  },
  {
    id: 'tx-914',
    customerName: 'Kenji Sato',
    customerEmail: 'kenji@tokyoventures.jp',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    amount: 1450.00,
    status: 'completed',
    date: '2026-04-10T16:50:00Z',
    service: 'Enterprise Annual Tier',
    paymentMethod: 'stripe',
  },
  {
    id: 'tx-915',
    customerName: 'Amara Okafor',
    customerEmail: 'amara@lagostech.ng',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    amount: 580.00,
    status: 'completed',
    date: '2026-02-14T13:20:00Z',
    service: 'Pro Analytics Suite',
    paymentMethod: 'credit_card',
  },
];

/* -------------------------------------------------------------------------- */
/* 9. Traffic Sources & Funnel Stages                                         */
/* -------------------------------------------------------------------------- */
export const mockTrafficSources: TrafficSource[] = [
  { name: 'Organic Search', visitors: 45200, percentage: 42, color: '#38bdf8' },
  { name: 'Direct Traffic', visitors: 28400, percentage: 26, color: '#818cf8' },
  { name: 'Referral & Affiliates', visitors: 18100, percentage: 17, color: '#34d399' },
  { name: 'Paid Social Ads', visitors: 11800, percentage: 11, color: '#f472b6' },
  { name: 'Email Campaigns', visitors: 4300, percentage: 4, color: '#fbbf24' },
];

export const mockFunnelStages: FunnelStage[] = [
  { stage: 'Unique Visitors', count: 107800, conversionRate: 100 },
  { stage: 'Product Page Views', count: 48200, conversionRate: 44.7 },
  { stage: 'Checkout Initiated', count: 12400, conversionRate: 25.7 },
  { stage: 'Completed Signups', count: 5230, conversionRate: 42.1 },
];

/* -------------------------------------------------------------------------- */
/* 10. Customers & Products Catalog                                           */
/* -------------------------------------------------------------------------- */
export const mockCustomers: CustomerItem[] = [
  {
    id: 'cust-101',
    name: 'Sarah Jenkins',
    company: 'Vertex Labs Inc',
    email: 'sarah.j@vertexlabs.io',
    plan: 'Enterprise',
    totalSpend: 17400,
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    joinDate: '2025-04-12',
  },
  {
    id: 'cust-102',
    name: 'Marcus Vance',
    company: 'Solardyne Corp',
    email: 'm.vance@solardyne.com',
    plan: 'Pro Suite',
    totalSpend: 6960,
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    joinDate: '2025-08-19',
  },
  {
    id: 'cust-103',
    name: 'Elena Rostova',
    company: 'Fintech AI GmbH',
    email: 'e.rostova@fintech-ai.de',
    plan: 'Enterprise Dedicated',
    totalSpend: 26400,
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    joinDate: '2025-01-05',
  },
  {
    id: 'cust-104',
    name: 'David Kalu',
    company: 'Zenith Cloud Network',
    email: 'david@zenithcloud.co',
    plan: 'Team Tier',
    totalSpend: 3480,
    status: 'trial',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    joinDate: '2026-10-01',
  },
  {
    id: 'cust-105',
    name: 'Aria Tanaka',
    company: 'Hypermetrics Tokyo',
    email: 'aria.t@hypermetrics.jp',
    plan: 'Pro Suite',
    totalSpend: 8900,
    status: 'churned',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    joinDate: '2025-06-11',
  },
  {
    id: 'cust-106',
    name: 'Lucas Braun',
    company: 'Aurora Insights Geneva',
    email: 'l.braun@aurorainsights.ch',
    plan: 'Starter Pro',
    totalSpend: 2388,
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    joinDate: '2025-11-20',
  },
];

export const mockProducts: ProductItem[] = [
  {
    id: 'prod-01',
    name: 'MetricFlow Enterprise Tier',
    category: 'Core SaaS Subscription',
    price: 1450,
    billingPeriod: 'monthly',
    subscribersCount: 42,
    mrrContribution: 60900,
    status: 'active',
  },
  {
    id: 'prod-02',
    name: 'MetricFlow Pro Suite',
    category: 'Core SaaS Subscription',
    price: 580,
    billingPeriod: 'monthly',
    subscribersCount: 78,
    mrrContribution: 45240,
    status: 'active',
  },
  {
    id: 'prod-03',
    name: 'MetricFlow Starter Pro',
    category: 'Entry Tier Subscription',
    price: 199,
    billingPeriod: 'monthly',
    subscribersCount: 84,
    mrrContribution: 16716,
    status: 'active',
  },
  {
    id: 'prod-04',
    name: 'Custom Real-time Kafka Pipelines',
    category: 'Enterprise Add-on',
    price: 750,
    billingPeriod: 'monthly',
    subscribersCount: 6,
    mrrContribution: 4500,
    status: 'beta',
  },
  {
    id: 'prod-05',
    name: 'Dedicated HIPAA / SOC2 Instance',
    category: 'Security Add-on',
    price: 1200,
    billingPeriod: 'monthly',
    subscribersCount: 3,
    mrrContribution: 3600,
    status: 'active',
  },
];

/* -------------------------------------------------------------------------- */
/* 11. Centralized KPI Metrics Structure                                      */
/* -------------------------------------------------------------------------- */
export const kpiMetricsData: KpiMetric[] = [
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    rawValue: 1284500,
    formatType: 'currency',
    change: 12.5,
    trend: 'positive',
    comparisonLabel: 'vs last month',
    iconName: 'DollarSign',
    badgeText: 'Target: $1.2M',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    rawValue: 18420,
    formatType: 'number',
    change: 8.3,
    trend: 'positive',
    comparisonLabel: 'vs last month',
    iconName: 'ShoppingBag',
    badgeText: '+1,410 new',
  },
  {
    id: 'total-customers',
    title: 'Total Customers',
    rawValue: 9450,
    formatType: 'number',
    change: 5.7,
    trend: 'positive',
    comparisonLabel: 'vs last month',
    iconName: 'Users',
    badgeText: '+512 accounts',
  },
  {
    id: 'net-profit',
    title: 'Net Profit',
    rawValue: 385200,
    formatType: 'currency',
    change: -2.4,
    trend: 'negative',
    comparisonLabel: 'vs last month',
    iconName: 'TrendingUp',
    badgeText: '30.0% margin',
  },
];

export const mockKpiMetrics: MetricCardData[] = [
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: '$1,284,500',
    change: 12.5,
    trend: 'up',
    periodText: 'vs last month',
    iconName: 'DollarSign',
    badgeText: 'Target: $1.2M',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    value: '18,420',
    change: 8.3,
    trend: 'up',
    periodText: 'vs last month',
    iconName: 'ShoppingBag',
    badgeText: '+1,410 new',
  },
  {
    id: 'total-customers',
    title: 'Total Customers',
    value: '9,450',
    change: 5.7,
    trend: 'up',
    periodText: 'vs last month',
    iconName: 'Users',
    badgeText: '+512 accounts',
  },
  {
    id: 'net-profit',
    title: 'Net Profit',
    value: '$385,200',
    change: -2.4,
    trend: 'down',
    periodText: 'vs last month',
    iconName: 'TrendingUp',
    badgeText: '30.0% margin',
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Payment Received ($1,450.00)',
    description: 'Vertex Labs renewed their Enterprise Annual Tier successfully.',
    time: '12m ago',
    read: false,
    type: 'success',
  },
  {
    id: 'notif-2',
    title: 'Traffic Surge Alert',
    description: 'Direct referral visits spiked +34% from ProductHunt leaderboard.',
    time: '1h ago',
    read: false,
    type: 'info',
  },
  {
    id: 'notif-3',
    title: 'Monthly Analytics Ready',
    description: 'Your October revenue reconciliation report is ready for export.',
    time: '4h ago',
    read: true,
    type: 'info',
  },
  {
    id: 'notif-4',
    title: 'High CPU API Gateway Load',
    description: 'US-East cluster load peaked at 88% capacity. Auto-scaled smoothly.',
    time: '1d ago',
    read: true,
    type: 'warning',
  },
];
