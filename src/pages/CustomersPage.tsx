import React, { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Badge, type BadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { mockCustomers } from '../data/mockData';
import { formatCurrency, formatDate } from '../utilities/formatters';
import { UserPlus, Search, Download, Building2 } from 'lucide-react';
import type { CustomerItem } from '../types';

const statusMap: Record<CustomerItem['status'], BadgeVariant> = {
  active: 'success',
  trial: 'warning',
  churned: 'danger',
};

export const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'churned'>('all');

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.plan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || cust.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalSpendSum = mockCustomers.reduce((acc, c) => acc + c.totalSpend, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Customer Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Accounts, subscription tiers, and lifetime value records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => alert('Exporting customers list (CSV)...')}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => alert('New Customer onboarding modal would open here.')}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Total Accounts</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {mockCustomers.length}
          </div>
          <span className="text-xs text-blue-400 mt-1">Enterprise & Pro tiers</span>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Active Retained</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            {mockCustomers.filter((c) => c.status === 'active').length}
          </div>
          <span className="text-xs text-slate-400 mt-1">83% retention rate</span>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Combined Lifetime Value</span>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-400">
            {formatCurrency(totalSpendSum)}
          </div>
          <span className="text-xs text-emerald-400 mt-1">+14.2% YoY</span>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-xs font-mono uppercase text-slate-400">Trial Conversion</span>
          <div className="mt-2 text-2xl font-bold font-mono text-white">68.5%</div>
          <span className="text-xs text-emerald-400 mt-1">+4.2% this quarter</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
          {(['all', 'active', 'trial', 'churned'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={`px-3 py-1 rounded-lg capitalize font-mono font-medium transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Customer Directory Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/40 text-xs uppercase font-mono tracking-wider text-slate-400">
                <th className="py-3 px-5">Customer & Organization</th>
                <th className="py-3 px-5">Subscribed Plan</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Member Since</th>
                <th className="py-3 px-5 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatarUrl}
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white">{cust.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>{cust.company}</span>
                            <span className="text-slate-600">•</span>
                            <span className="font-mono">{cust.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-medium">
                      {cust.plan}
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge variant={statusMap[cust.status]}>
                        {cust.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-xs font-mono text-slate-400">
                      {formatDate(cust.joinDate)}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-white">
                      {formatCurrency(cust.totalSpend)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
