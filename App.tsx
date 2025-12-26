
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Settings, 
  Terminal, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  History,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { AppRoute, Expense, DashboardStats } from './types';
import { AUTH_STORAGE_KEY } from './constants';
import Dashboard from './components/Dashboard';
import ExpensesList from './components/ExpensesList';
import Integrations from './components/Integrations';
import WebhookSimulator from './components/WebhookSimulator';
import Login from './components/Login';
import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (auth === 'true') {
      setIsAuthenticated(true);
      setCurrentRoute(AppRoute.DASHBOARD);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentRoute(AppRoute.DASHBOARD);
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoute(AppRoute.LOGIN);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.DASHBOARD: return <Dashboard />;
      case AppRoute.EXPENSES: return <ExpensesList />;
      case AppRoute.INTEGRATIONS: return <Integrations />;
      case AppRoute.WEBHOOK_SIM: return <WebhookSimulator />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: AppRoute.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppRoute.EXPENSES, label: 'Gastos', icon: ReceiptText },
    { id: AppRoute.INTEGRATIONS, label: 'Integrações', icon: Settings },
    { id: AppRoute.WEBHOOK_SIM, label: 'Simulador Webhook', icon: Terminal },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ExpenseFlow</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentRoute(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${currentRoute === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-8 shrink-0">
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:block text-sm text-slate-500">
                Bem-vindo, <span className="font-semibold text-slate-900">Administrador</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                AD
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
