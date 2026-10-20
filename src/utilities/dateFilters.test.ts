import { describe, expect, it } from 'vitest';
import {
  calculatePeriodComparison,
  filterByDateWindow,
  getDateRangeBoundaries,
  normalizePreset,
} from './dateFilters';

describe('date filters', () => {
  it('creates inclusive boundaries for each reporting preset', () => {
    expect(getDateRangeBoundaries('7d')).toMatchObject({
      startDate: '2026-10-12',
      endDate: '2026-10-18',
      previousStartDate: '2026-10-05',
      previousEndDate: '2026-10-11',
    });
    expect(getDateRangeBoundaries('30d').startDate).toBe('2026-09-19');
    expect(getDateRangeBoundaries('90d').startDate).toBe('2026-07-21');
    expect(getDateRangeBoundaries('ytd').startDate).toBe('2026-01-01');
  });

  it('normalizes legacy ranges to year-to-date', () => {
    expect(normalizePreset('12m')).toBe('ytd');
    expect(normalizePreset('all')).toBe('ytd');
  });

  it('filters date-only and ISO timestamps inclusively', () => {
    const records = [
      { id: 'before', date: '2026-10-11T23:59:59Z' },
      { id: 'start', date: '2026-10-12' },
      { id: 'end', date: '2026-10-18T23:59:59Z' },
      { id: 'after', date: '2026-10-19' },
    ];
    expect(filterByDateWindow(records, '2026-10-12', '2026-10-18').map((r) => r.id)).toEqual([
      'start',
      'end',
    ]);
  });

  it('handles positive, negative, neutral and zero-denominator comparisons', () => {
    expect(calculatePeriodComparison(120, 100)).toEqual({
      changePercentage: 20,
      trend: 'positive',
    });
    expect(calculatePeriodComparison(80, 100)).toEqual({
      changePercentage: -20,
      trend: 'negative',
    });
    expect(calculatePeriodComparison(100, 100)).toEqual({
      changePercentage: 0,
      trend: 'neutral',
    });
    expect(calculatePeriodComparison(10, 0)).toEqual({
      changePercentage: 100,
      trend: 'positive',
    });
    expect(calculatePeriodComparison(0, 0)).toEqual({
      changePercentage: 0,
      trend: 'neutral',
    });
  });
});
