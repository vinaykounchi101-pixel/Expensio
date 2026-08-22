import React from 'react';
import { Menu, Search, UserCircle } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

export function Navbar() {
  const { toggleSidebar } = useApp();
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/expenses')) return 'Expenses';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/budgets')) return 'Budgets';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{getTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden relative sm:flex items-center">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-input bg-transparent pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <ThemeToggle />
        <button className="rounded-full p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <UserCircle className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
