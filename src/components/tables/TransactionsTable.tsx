import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from 'lucide-react';
import { Badge, type BadgeVariant } from '../common/Badge';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utilities/formatters';
import { downloadCSV } from '../../utils/exportCSV';
import {
  selectTransactionTableRows,
  type TransactionSortKey,
  type TransactionSortState,
  type TransactionStatusFilter,
} from '../../utilities/transactionTable';
import type { Transaction } from '../../types';

export interface TransactionsTableProps {
  transactions: Transaction[];
  title?: string;
  subtitle?: string;
  initialPageSize?: number;
  exportPeriodLabel?: string;
}

const statusVariantMap: Record<Transaction['status'], BadgeVariant> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'info',
};

const statusFilters: { value: TransactionStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const sortLabels: Record<TransactionSortKey, string> = {
  id: 'transaction ID',
  customerName: 'customer',
  date: 'date',
  amount: 'amount',
  paymentMethod: 'payment method',
  status: 'status',
};

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  title = 'Transactions',
  subtitle = 'Search, filter, sort and review customer billing activity',
  initialPageSize = 5,
  exportPeriodLabel = 'all-data',
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>('all');
  const [sort, setSort] = useState<TransactionSortState>({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const { filteredAndSortedTransactions, visibleTransactions, totalPages } = useMemo(
    () =>
      selectTransactionTableRows(transactions, {
        search,
        statusFilter,
        sort,
        page,
        pageSize,
      }),
    [page, pageSize, search, sort, statusFilter, transactions]
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleSort = (key: TransactionSortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'date' ? 'desc' : 'asc' }
    );
    setPage(1);
  };

  const renderSortIcon = (key: TransactionSortKey) => {
    if (sort.key !== key) return <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />;
    return sort.direction === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
    );
  };

  const renderHeader = (key: TransactionSortKey, label: string, className = '') => (
    <th
      scope="col"
      aria-sort={sort.key === key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={`py-3 px-5 ${className}`}
    >
      <button
        type="button"
        onClick={() => handleSort(key)}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        aria-label={`Sort by ${sortLabels[key]}; currently ${sort.key === key ? sort.direction + 'ending' : 'unsorted'}`}
      >
        {label}
        {renderSortIcon(key)}
      </button>
    </th>
  );

  const hasActiveQuery = search.trim().length > 0 || statusFilter !== 'all';
  const emptyMessage = hasActiveQuery
    ? 'No transactions match the current search and filters.'
    : 'No transactions available.';

  const handleExport = () => {
    if (filteredAndSortedTransactions.length === 0) {
      setExportMessage('There are no matching transactions to export.');
      return;
    }

    try {
      downloadCSV(
        filteredAndSortedTransactions,
        [
          { header: 'Transaction ID', value: (transaction) => transaction.id },
          { header: 'Customer', value: (transaction) => transaction.customerName },
          { header: 'Email', value: (transaction) => transaction.customerEmail },
          { header: 'Date', value: (transaction) => formatDate(transaction.date) },
          { header: 'Amount', value: (transaction) => formatCurrency(transaction.amount) },
          {
            header: 'Payment Method',
            value: (transaction) => transaction.paymentMethod.replace('_', ' '),
          },
          { header: 'Status', value: (transaction) => transaction.status },
        ],
        `metricflow-transactions-${exportPeriodLabel}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      setExportMessage(`Exported ${filteredAndSortedTransactions.length} transactions.`);
    } catch {
      setExportMessage('The transaction export failed. Please try again.');
    }
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-5 border-b border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 self-start">
            {filteredAndSortedTransactions.length} records
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <label className="relative flex-1 max-w-sm">
            <span className="sr-only">Search transactions</span>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              placeholder="Search ID, customer or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </label>

          <div className="flex flex-wrap items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                aria-pressed={statusFilter === filter.value}
                className={`px-3 py-1 rounded-lg font-mono font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  statusFilter === filter.value
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p role="status" aria-live="polite" className="text-xs text-slate-400 min-h-4">
            {exportMessage}
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left border-collapse text-sm">
          <caption className="sr-only">Transaction data table</caption>
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/40 text-xs text-slate-400">
              {renderHeader('id', 'Transaction ID')}
              {renderHeader('customerName', 'Customer')}
              {renderHeader('date', 'Date')}
              {renderHeader('amount', 'Amount', 'text-right')}
              {renderHeader('paymentMethod', 'Payment Method')}
              {renderHeader('status', 'Status')}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {visibleTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 px-5 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-800/30 transition-colors duration-150">
                  <td className="py-3.5 px-5 font-mono text-xs text-blue-400">{transaction.id}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={transaction.avatarUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-medium text-slate-100">{transaction.customerName}</div>
                        <div className="text-xs text-slate-400 font-mono">{transaction.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 text-xs font-mono">{formatDate(transaction.date)}</td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-white">{formatCurrency(transaction.amount)}</td>
                  <td className="py-3.5 px-5 text-slate-400 text-xs font-mono capitalize">
                    {transaction.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-5">
                    <Badge variant={statusVariantMap[transaction.status]} size="sm">
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <label htmlFor="transaction-page-size">Rows per page</label>
          <select
            id="transaction-page-size"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="bg-slate-950/60 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span>
            {filteredAndSortedTransactions.length === 0
              ? '0 results'
              : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredAndSortedTransactions.length)} of ${filteredAndSortedTransactions.length}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Card>
  );
};
