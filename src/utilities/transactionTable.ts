import type { Transaction } from '../types';

export type TransactionSortKey =
  | 'id'
  | 'customerName'
  | 'date'
  | 'amount'
  | 'paymentMethod'
  | 'status';
export type TransactionSortDirection = 'asc' | 'desc';
export type TransactionStatusFilter = 'all' | Transaction['status'];

export interface TransactionSortState {
  key: TransactionSortKey;
  direction: TransactionSortDirection;
}

export interface TransactionTableState {
  search: string;
  statusFilter: TransactionStatusFilter;
  sort: TransactionSortState;
  page: number;
  pageSize: number;
}

export interface TransactionTableResult {
  filteredAndSortedTransactions: Transaction[];
  visibleTransactions: Transaction[];
  totalPages: number;
}

export function compareTransactions(
  a: Transaction,
  b: Transaction,
  key: TransactionSortKey
): number {
  if (key === 'amount') return a.amount - b.amount;
  if (key === 'date') return a.date.localeCompare(b.date);

  const aValue = key === 'customerName' ? a.customerName : a[key];
  const bValue = key === 'customerName' ? b.customerName : b[key];
  return String(aValue).localeCompare(String(bValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function selectTransactionTableRows(
  transactions: Transaction[],
  state: TransactionTableState
): TransactionTableResult {
  const query = state.search.trim().toLowerCase();
  const filteredAndSortedTransactions = transactions
    .filter((transaction) => {
      const matchesStatus =
        state.statusFilter === 'all' || transaction.status === state.statusFilter;
      const matchesSearch =
        !query ||
        transaction.id.toLowerCase().includes(query) ||
        transaction.customerName.toLowerCase().includes(query) ||
        transaction.customerEmail.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const result = compareTransactions(a, b, state.sort.key);
      return state.sort.direction === 'asc' ? result : -result;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedTransactions.length / state.pageSize)
  );
  const safePage = Math.min(Math.max(1, state.page), totalPages);

  return {
    filteredAndSortedTransactions,
    visibleTransactions: filteredAndSortedTransactions.slice(
      (safePage - 1) * state.pageSize,
      safePage * state.pageSize
    ),
    totalPages,
  };
}
