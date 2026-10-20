import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CustomersPage } from './pages/CustomersPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ProductsPage } from './pages/ProductsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { selectedPage } = useDashboard();

  if (!isAuthenticated) return <LoginPage />;

  const renderCurrentView = () => {
    switch (selectedPage) {
      case 'overview':
        return <DashboardPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'products':
        return <ProductsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <DashboardLayout>{renderCurrentView()}</DashboardLayout>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </AuthProvider>
  );
};

export default App;
