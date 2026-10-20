/**
 * DATE FILTER UTILITIES FOR METRICFLOW
 *
 * Provides explicit, timezone-safe UTC date boundary calculations,
 * deterministic range filtering, and mathematical comparison percentage logic.
 */

import type { TimeRange, DateFilterPreset } from '../types';

export const ANCHOR_DATE_STRING = '2026-10-18';

export interface DateRangeBoundary {
  preset: DateFilterPreset;
  label: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  previousStartDate: string; // 'YYYY-MM-DD'
  previousEndDate: string; // 'YYYY-MM-DD'
  comparisonLabel: string;
}

/**
 * Normalizes input date to UTC 'YYYY-MM-DD' without local timezone offsets.
 */
export function formatUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses 'YYYY-MM-DD' string safely as UTC midnight.
 */
export function parseUTC(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Offsets a UTC date by a given number of days.
 */
export function offsetDays(dateStr: string, days: number): string {
  const d = parseUTC(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return formatUTC(d);
}

/**
 * Normalizes TimeRange to standard DateFilterPreset.
 */
export function normalizePreset(range: TimeRange): DateFilterPreset {
  if (range === '12m' || range === 'all') return 'ytd';
  return range;
}

/**
 * Calculates explicit date boundaries for the selected preset and its equivalent prior period.
 */
export function getDateRangeBoundaries(presetInput: TimeRange): DateRangeBoundary {
  const preset = normalizePreset(presetInput);
  const end = ANCHOR_DATE_STRING;

  switch (preset) {
    case '7d': {
      // 7 days inclusive: 2026-10-12 to 2026-10-18
      const start = offsetDays(end, -6);
      // Equivalent prior period: 2026-10-05 to 2026-10-11 (7 days)
      const prevEnd = offsetDays(start, -1);
      const prevStart = offsetDays(prevEnd, -6);
      return {
        preset: '7d',
        label: 'Last 7 days',
        startDate: start,
        endDate: end,
        previousStartDate: prevStart,
        previousEndDate: prevEnd,
        comparisonLabel: 'vs previous 7 days',
      };
    }

    case '30d': {
      // 30 days inclusive: 2026-09-19 to 2026-10-18
      const start = offsetDays(end, -29);
      // Equivalent prior period: 2026-08-20 to 2026-09-18 (30 days)
      const prevEnd = offsetDays(start, -1);
      const prevStart = offsetDays(prevEnd, -29);
      return {
        preset: '30d',
        label: 'Last 30 days',
        startDate: start,
        endDate: end,
        previousStartDate: prevStart,
        previousEndDate: prevEnd,
        comparisonLabel: 'vs previous 30 days',
      };
    }

    case '90d': {
      // 90 days inclusive: 2026-07-21 to 2026-10-18
      const start = offsetDays(end, -89);
      // Equivalent prior period: 2026-04-22 to 2026-07-20 (90 days)
      const prevEnd = offsetDays(start, -1);
      const prevStart = offsetDays(prevEnd, -89);
      return {
        preset: '90d',
        label: 'Last 90 days',
        startDate: start,
        endDate: end,
        previousStartDate: prevStart,
        previousEndDate: prevEnd,
        comparisonLabel: 'vs previous 90 days',
      };
    }

    case 'ytd':
    default: {
      // Year to date: 2026-01-01 to 2026-10-18
      const start = '2026-01-01';
      // Calculate day count in YTD
      const daysCount = Math.round(
        (parseUTC(end).getTime() - parseUTC(start).getTime()) / (1000 * 60 * 60 * 24)
      );
      // Equivalent prior year period: 2025-01-01 to 2025-10-18
      const prevStart = '2025-01-01';
      const prevEnd = offsetDays(prevStart, daysCount);
      return {
        preset: 'ytd',
        label: 'This year',
        startDate: start,
        endDate: end,
        previousStartDate: prevStart,
        previousEndDate: prevEnd,
        comparisonLabel: 'vs prior year period',
      };
    }
  }
}

/**
 * Filter an array of items with a 'date' field (in 'YYYY-MM-DD' or ISO format) between start and end inclusive.
 */
export function filterByDateWindow<T extends { date: string }>(
  items: T[],
  startDate: string,
  endDate: string
): T[] {
  return items.filter((item) => {
    const itemDate = item.date.slice(0, 10);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

/**
 * Calculates comparison percentage against equivalent previous period,
 * defining safe handling for missing previous-period values and zero denominators.
 */
export function calculatePeriodComparison(
  currentVal: number,
  previousVal: number
): {
  changePercentage: number;
  trend: 'positive' | 'negative' | 'neutral';
} {
  // If previous value is 0 (or undefined/null)
  if (previousVal === 0 || isNaN(previousVal)) {
    if (currentVal === 0) {
      return { changePercentage: 0, trend: 'neutral' };
    }
    return {
      changePercentage: 100.0,
      trend: currentVal > 0 ? 'positive' : 'negative',
    };
  }

  const diff = currentVal - previousVal;
  const pct = Number(((diff / Math.abs(previousVal)) * 100).toFixed(1));

  return {
    changePercentage: pct,
    trend: pct > 0 ? 'positive' : pct < 0 ? 'negative' : 'neutral',
  };
}
