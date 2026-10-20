import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  RefreshCw,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  User,
  Shield,
  CreditCard,
  LogOut,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import type { TimeRange, NavPageId } from '../../types';
import { cn } from '../../utilities/formatters';
import { useAuth } from '../../context/AuthContext';

const timeRangeOptions: { label: string; fullLabel: string; value: TimeRange }[] = [
  { label: '7D', fullLabel: 'Last 7 days', value: '7d' },
  { label: '30D', fullLabel: 'Last 30 days', value: '30d' },
  { label: '90D', fullLabel: 'Last 90 days', value: '90d' },
  { label: 'This Year', fullLabel: 'This year', value: 'ytd' },
];

const pageTitleMap: Record<NavPageId, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview',
    subtitle: 'Real-time performance metrics & business health',
  },
  analytics: {
    title: 'Analytics & Insights',
    subtitle: 'Acquisition cohorts, conversions & deep-dive trends',
  },
  customers: {
    title: 'Customer Directory',
    subtitle: 'Manage client accounts, tiers & lifetime spend',
  },
  transactions: {
    title: 'Transactions & Billing',
    subtitle: 'Real-time invoice records, subscriptions & payments',
  },
  products: {
    title: 'Products & Tiers',
    subtitle: 'Catalog of active plans, subscriptions & recurring add-ons',
  },
  settings: {
    title: 'Settings & Security',
    subtitle: 'API webhooks, team roles & workspace configuration',
  },
};

export const Header: React.FC = () => {
  const { signOut } = useAuth();
  const {
    selectedPage,
    setSelectedPage,
    timeRange,
    setTimeRange,
    searchQuery,
    setSearchQuery,
    toggleMobileSidebar,
    isRefreshing,
    refreshData,
    notifications,
    unreadNotificationCount,
    markAllNotificationsAsRead,
    dismissNotification,
    theme,
    toggleTheme,
  } = useDashboard();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageInfo = pageTitleMap[selectedPage] || pageTitleMap.overview;

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-[#0a0f1d]/90 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-20 select-none shadow-sm">
      {/* Left: Mobile hamburger & Dynamic Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleMobileSidebar}
          aria-label="Open mobile navigation menu"
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {pageInfo.title}
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              Live
            </span>
          </div>
          <p className="hidden sm:block text-xs text-slate-400 truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Middle: Search Bar with Ctrl+K shortcut */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md hidden sm:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search metrics, customers, bills... (⌘K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-9 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-sans"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Clear search query"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Time Range Pills (desktop) */}
        <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              title={opt.fullLabel}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all duration-150 cursor-pointer',
                (timeRange === opt.value || (opt.value === 'ytd' && timeRange === '12m'))
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Mobile Time Range Select */}
        <select
          value={timeRange === '12m' ? 'ytd' : timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          aria-label="Reporting period filter"
          className="md:hidden bg-slate-900/90 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {timeRangeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.fullLabel}
            </option>
          ))}
        </select>

        {/* Refresh Button */}
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          aria-label="Refresh dashboard data"
          title="Refresh dashboard"
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <RefreshCw
            className={cn('w-4 h-4', isRefreshing && 'animate-spin text-blue-400')}
          />
        </button>

        <button
          onClick={toggleTheme}
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={isNotifOpen}
            aria-haspopup="true"
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-mono font-bold text-white flex items-center justify-center ring-2 ring-slate-950">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              role="region"
              aria-label="Notifications list"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0b1329] border border-slate-800 shadow-2xl p-4 z-50 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                      {unreadNotificationCount} unread
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'py-3 flex items-start gap-3 transition-colors',
                        !notif.read && 'bg-blue-950/20 -mx-2 px-2 rounded-xl'
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : notif.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notif.id)}
                        aria-label="Dismiss notification"
                        className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-label="User account menu"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Alex Rivera"
                className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">Alex Rivera</span>
              <span className="text-[10px] text-blue-400 font-mono">Admin Tier</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 hidden md:block" />
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0b1329] border border-slate-800 shadow-2xl p-2 z-50 backdrop-blur-2xl text-xs"
            >
              <div className="p-2 border-b border-slate-800/80 mb-1">
                <p className="font-semibold text-white">Alex Rivera</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">alex@metricflow.io</p>
              </div>

              <div className="space-y-0.5">
                <button
                  role="menuitem"
                  onClick={() => {
                    setSelectedPage('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>My Profile</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setSelectedPage('transactions');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Billing & Invoices</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setSelectedPage('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Security & Webhooks</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setSelectedPage('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>System Preferences</span>
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-800/80">
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsProfileOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
