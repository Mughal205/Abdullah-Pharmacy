
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: AppView.INVENTORY, label: 'Inventory', icon: '📦' },
    { id: AppView.SALES, label: 'Sales & POS', icon: '💰' },
    { id: AppView.REPORTS, label: 'Reports', icon: '📈' },
    { id: AppView.AI_ASSISTANT, label: 'AI Assistant', icon: '🤖' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <span className="text-3xl">💊</span>
        <h1 className="text-xl font-bold tracking-tight">Abdullah Pharmacy</h1>
      </div>
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 mb-4">
        <button
          onClick={() => {
            if(window.confirm('Are you sure you want to log out?')) {
              onLogout();
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>

      <div className="p-4 bg-slate-800/50 m-4 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase">System Status</p>
        </div>
        <p className="text-sm text-slate-200">Pharmacy #401 - Active</p>
      </div>
    </div>
  );
};

export default Sidebar;
