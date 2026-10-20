import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Key, ShieldCheck, Bell, Users, Copy, Check, Save } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useDashboard();
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'notifications' | 'team'>('general');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('MetricFlow Labs');
  const [contactEmail, setContactEmail] = useState('billing@metricflow.io');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const apiKey = 'demo-key-not-connected';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Settings & Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your organization profile, API keys, security policies and webhooks.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Save}
          onClick={handleSave}
        >
          {savedSuccess ? 'Saved Changes!' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Settings sections" className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        {[
          { id: 'general', label: 'General Info' },
          { id: 'api', label: 'API & Webhooks' },
          { id: 'notifications', label: 'Alerts & Digest' },
          { id: 'team', label: 'Team Members' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            aria-selected={activeTab === tab.id}
            role="tab"
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <Check className="w-4 h-4 text-emerald-400" />
          Settings updated successfully. Changes are now active across your team.
        </div>
      )}

      {/* Tab 1: General Info */}
      {activeTab === 'general' && (
        <Card className="space-y-5">
          <h3 className="text-base font-semibold text-white">Workspace Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Billing Notification Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white">Interface Preferences</h4>
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <div>
                <p className="text-xs font-semibold text-white">Theme</p>
                <p className="text-[11px] text-slate-400">
                  Choose the dashboard appearance. Your preference is saved on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={theme === 'light'}
                className="min-w-24 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {theme === 'dark' ? 'Dark theme' : 'Light theme'}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white">Authentication & Security</h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Enforce Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-400">Require all dashboard admins to verify via authenticator app</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: API & Webhooks */}
      {activeTab === 'api' && (
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">API Production Keys</h3>
              <p className="text-xs text-slate-400">Use this token to authenticate server-to-server analytics ingestion</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-400">Secret Token (Keep Secure)</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 font-mono text-xs text-blue-300 flex items-center justify-between">
                <span>{apiKey}</span>
                <Key className="w-4 h-4 text-slate-500" />
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={copiedKey ? Check : Copy}
                onClick={handleCopyKey}
              >
                {copiedKey ? 'Copied' : 'Copy Key'}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white">Webhook Endpoints</h4>
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-mono text-slate-200">https://api.metricflow.io/v1/events/stripe-webhook</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Listening for: invoice.paid, customer.subscription.deleted</p>
              </div>
              <Badge variant="info">Listening</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Alerts & Digest */}
      {activeTab === 'notifications' && (
        <Card className="space-y-4">
          <h3 className="text-base font-semibold text-white">Automated Notifications & Reports</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Weekly Performance Digest</p>
                  <p className="text-[11px] text-slate-400">Receive comprehensive PDF summaries every Monday morning</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Real-Time Slack Alerts on Churn Spike</p>
                  <p className="text-[11px] text-slate-400">Instant webhook trigger when churn rate exceeds 2.5% threshold</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Team */}
      {activeTab === 'team' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Team Access & RBAC</h3>
            <Button variant="secondary" size="sm" icon={Users} onClick={() => alert('Invite member modal')}>
              Invite Member
            </Button>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Alex"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">Alex Rivera</p>
                  <p className="text-slate-400 font-mono text-[11px]">alex@metricflow.io</p>
                </div>
              </div>
              <Badge variant="info">Owner / SuperAdmin</Badge>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Marcus"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">Marcus Vance</p>
                  <p className="text-slate-400 font-mono text-[11px]">m.vance@metricflow.io</p>
                </div>
              </div>
              <Badge variant="neutral">Data Analyst</Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
