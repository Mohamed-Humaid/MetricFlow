import type { LucideIcon } from 'lucide-react';

export type DateFilterPreset = '7d' | '30d' | '90d' | 'ytd';
export type TimeRange = DateFilterPreset | '12m' | 'all';
export type Theme = 'dark' | 'light';

export type NavPageId =
  | 'overview'
  | 'analytics'
  | 'customers'
  | 'transactions'
  | 'products'
  | 'settings';

export type MetricTrend = 'positive' | 'negative' | 'neutral';

export interface KpiMetric {
  id: string;
  title: string;
  rawValue: number;
  formatType: 'currency' | 'number' | 'percent';
  formattedValue?: string;
  change: number;
  trend: MetricTrend;
  comparisonLabel: string;
  iconName: 'DollarSign' | 'ShoppingBag' | 'Users' | 'TrendingUp';
  badgeText?: string;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  periodText: string;
  iconName: string;
  badgeText?: string;
  target?: string;
}

/**
 * Daily business performance records with dates, revenue, profit, orders and customers.
 * Used for 7-day, 30-day, 90-day, and year-to-date filtering.
 */
export interface DailyPerformanceRecord {
  date: string; // 'YYYY-MM-DD'
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
  customers: number;
}

export interface RevenueDataPoint {
  month: string;
  fullDate?: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface OrderVolumeDataPoint {
  label: string;
  fullDate?: string;
  orders: number;
  revenue?: number;
}

export interface TrafficSource {
  name: string;
  visitors: number;
  percentage: number;
  color: string;
}

export type PaymentMethod =
  | 'credit_card'
  | 'stripe'
  | 'paypal'
  | 'bank_transfer'
  | 'apple_pay';

export interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  avatarUrl: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  service: string;
  paymentMethod: PaymentMethod;
}

/**
 * Product sales grouped by product category.
 */
export interface ProductCategorySales {
  category: string;
  revenue: number;
  unitsSold: number;
  percentageOfTotal: number;
  averageOrderValue: number;
  growth: number;
}

/**
 * Revenue segmented by business customer tiers / market segments.
 */
export interface SegmentedRevenue {
  segment: string;
  revenue: number;
  percentage: number;
  activeClients: number;
  averageContractValue: number;
  growthRate: number;
}

/**
 * Revenue segmented by geographic regions.
 */
export interface RegionalRevenue {
  region: string;
  revenue: number;
  percentage: number;
  growth: number;
}

export interface CustomerItem {
  id: string;
  name: string;
  company: string;
  email: string;
  plan: string;
  totalSpend: number;
  status: 'active' | 'trial' | 'churned';
  avatarUrl: string;
  joinDate: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  subscribersCount: number;
  mrrContribution: number;
  status: 'active' | 'archived' | 'beta';
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface NavItem {
  id: NavPageId;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface DashboardFilterState {
  timeRange: TimeRange;
  searchQuery: string;
  selectedCategory: string;
}

export interface DashboardContextValue {
  theme: Theme;
  toggleTheme: () => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPage: NavPageId;
  setSelectedPage: (page: NavPageId) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  isRefreshing: boolean;
  refreshData: () => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
}
