import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const { theme, toggleTheme } = useDashboard();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter both your username and password.');
      return;
    }

    if (!signIn(username, password)) {
      setError('Invalid demo credentials. Use admin / admin.');
      return;
    }

    setError('');
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center px-4 py-8">
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>

      <section className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
            <Sparkles className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white">MetricFlow</p>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-400 font-mono mt-1">Enterprise SaaS</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to your business analytics workspace.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="demo-username" className="text-xs font-medium text-slate-300">Username</label>
              <input
                id="demo-username"
                name="username"
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError('');
                }}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="demo-password" className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  id="demo-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-11 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2.5 text-xs text-rose-300">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Demo access only. Username and password checks are visible in frontend code and provide no real security.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
