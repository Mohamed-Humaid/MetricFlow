import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Receipt,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { cn } from '../../utilities/formatters';
import type { NavPageId } from '../../types';

interface NavItemConfig {
  id: NavPageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'blue' | 'emerald' | 'amber';
}

const navItems: NavItemConfig[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'Live', badgeVariant: 'blue' },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: Receipt, badge: 'New', badgeVariant: 'emerald' },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    selectedPage,
    setSelectedPage,
    isMobileSidebarOpen,
    closeMobileSidebar,
  } = useDashboard();

  const handleNavClick = (pageId: NavPageId) => {
    setSelectedPage(pageId);
    closeMobileSidebar();
  };

  const renderNavLinks = (isMobile: boolean = false) => {
    const showLabels = isMobile || isSidebarOpen;

    return (
      <div className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/5 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              )}
              title={!showLabels ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full shadow-sm shadow-cyan-400" />
              )}

              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform duration-150',
                  isActive
                    ? 'text-blue-400 scale-105'
                    : 'text-slate-400 group-hover:text-slate-200'
                )}
              />

              {showLabels && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border',
                        item.badgeVariant === 'blue'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/25'
                          : item.badgeVariant === 'emerald'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* =========================================================================
          DESKTOP FIXED SIDEBAR (hidden on mobile, visible on lg and up)
         ========================================================================= */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed top-0 left-0 bottom-0 border-r border-slate-800/80 bg-[#0a0f1d]/95 backdrop-blur-2xl transition-all duration-300 z-30 select-none shadow-2xl',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  MetricFlow
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-semibold">
                  Enterprise SaaS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          <div>
            {isSidebarOpen && (
              <p className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Core Navigation
              </p>
            )}
            {renderNavLinks(false)}
          </div>

          {/* Quick Help Box when expanded */}
          {isSidebarOpen && (
            <div className="px-1 pt-2">
              <div className="rounded-xl p-3.5 bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-900/40 text-xs">
                <div className="flex items-center gap-2 text-blue-300 font-semibold mb-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>Documentation</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
                  Need help integrating webhook analytics? Check our API docs.
                </p>
                <a
                  href="#docs"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPage('settings');
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  View Quickstart <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800/80">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/70',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Alex Rivera"
                className="w-9 h-9 rounded-full object-cover border border-blue-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>

            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">Alex Rivera</p>
                <p className="text-[11px] text-slate-400 truncate font-mono">alex@metricflow.io</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================================
          RESPONSIVE MOBILE SIDEBAR DRAWER WITH OVERLAY
         ========================================================================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Sidebar"
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0a0f1d] border-r border-slate-800 p-4 flex flex-col justify-between shadow-2xl z-50 transform transition-transform duration-300"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-lg tracking-tight text-white">
                      MetricFlow
                    </span>
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-blue-400 font-semibold">
                      Enterprise SaaS
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeMobileSidebar}
                  aria-label="Close navigation menu"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="pt-4">
                <p className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Navigation
                </p>
                {renderNavLinks(true)}
              </div>
            </div>

            {/* Mobile Footer / User */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Alex Rivera"
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/40"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Alex Rivera</p>
                  <p className="text-[11px] text-slate-400 truncate font-mono">alex@metricflow.io</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
