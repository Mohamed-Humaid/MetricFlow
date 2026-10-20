import { describe, expect, it } from 'vitest';
import { selectTransactionTableRows } from './transactionTable';
import type { Transaction } from '../types';

const transactions: Transaction[] = [
  {
    id: 'tx-1',
    customerName: 'Zoe Adams',
    customerEmail: 'zoe@example.com',
    avatarUrl: '',
    amount: 300,
    status: 'pending',
    date: '2026-10-02',
    service: 'Pro',
    paymentMethod: 'stripe',
  },
  {
    id: 'tx-2',
    customerName: 'Alex Brown',
    customerEmail: 'alex@example.com',
    avatarUrl: '',
    amount: 100,
    status: 'completed',
    date: '2026-10-03',
    service: 'Starter',
    paymentMethod: 'credit_card',
  },
  {
    id: 'tx-3',
    customerName: 'Mina Chen',
    customerEmail: 'mina@example.com',
    avatarUrl: '',
    amount: 200,
    status: 'failed',
    date: '2026-10-01',
    service: 'Enterprise',
    paymentMethod: 'paypal',
  },
];

const state = {
  search: '',
  statusFilter: 'all' as const,
  sort: { key: 'amount' as const, direction: 'asc' as const },
  page: 1,
  pageSize: 2,
};

describe('transaction table selection', () => {
  it('combines search, status filtering, sorting and pagination', () => {
    const result = selectTransactionTableRows(transactions, state);
    expect(result.filteredAndSortedTransactions.map((row) => row.id)).toEqual([
      'tx-2',
      'tx-3',
      'tx-1',
    ]);
    expect(result.visibleTransactions.map((row) => row.id)).toEqual(['tx-2', 'tx-3']);
    expect(result.totalPages).toBe(2);

    const filtered = selectTransactionTableRows(transactions, {
      ...state,
      search: 'MINA@EXAMPLE',
      statusFilter: 'failed',
    });
    expect(filtered.visibleTransactions.map((row) => row.id)).toEqual(['tx-3']);
  });

  it('returns an empty result for unmatched search and safe pagination', () => {
    const result = selectTransactionTableRows(transactions, {
      ...state,
      search: 'missing',
      page: 99,
    });
    expect(result.filteredAndSortedTransactions).toEqual([]);
    expect(result.visibleTransactions).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});
