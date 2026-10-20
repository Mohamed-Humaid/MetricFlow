import React, { useMemo } from 'react';
import { Card } from '../components/common/Card';
import { TransactionsTable } from '../components/tables/TransactionsTable';
import { mockRecentTransactions } from '../data/mockData';
import { formatCurrency } from '../utilities/formatters';
import { useDashboard } from '../hooks/useDashboard';
import { filterByDateWindow, getDateRangeBoundaries } from '../utilities/dateFilters';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { timeRange } = useDashboard();
  const boundaries = useMemo(() => getDateRangeBoundaries(timeRange), [timeRange]);
  const periodTransactions = useMemo(
    () =>
      filterByDateWindow(
        mockRecentTransactions,
        boundaries.startDate,
        boundaries.endDate
      ),
    [boundaries]
  );

  const totalCompleted = mockRecentTransactions
    .filter((transaction) => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalPending = mockRecentTransactions
    .filter((transaction) => transaction.status === 'pending')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Transactions & Billing Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time ledger of inbound payments, automated recurring billings, and refunds.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Completed Volume</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">
              {formatCurrency(totalCompleted)}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Pending Settlements</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
              {formatCurrency(totalPending)}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Gateway Success Rate</span>
            <div className="text-2xl font-bold font-mono text-white mt-0.5">99.2%</div>
          </div>
        </Card>
      </div>

      <TransactionsTable
        transactions={periodTransactions}
        title="Transactions & Billing Ledger"
        subtitle={`Search by transaction ID, customer or email; ${boundaries.label.toLowerCase()} (${boundaries.startDate} to ${boundaries.endDate})`}
        initialPageSize={10}
        exportPeriodLabel={boundaries.preset}
      />
    </div>
  );
};
