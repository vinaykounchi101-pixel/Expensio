import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Wallet, X, WalletCards } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/budgets', label: 'Budgets', icon: Wallet },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
];

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useApp();

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <WalletCards className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">Expensio</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) => 
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-accent text-accent-foreground shadow-sm relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      
      <nav className="fixed bottom-0 z-40 flex w-full border-t border-border bg-card sm:hidden pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="sr-only">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
