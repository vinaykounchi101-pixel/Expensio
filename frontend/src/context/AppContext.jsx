import React, { createContext, useState, useCallback, useContext } from 'react';
import { Toast } from '../components/common/Toast';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const addToast = useCallback(({ title, message, variant = 'info' }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, variant }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar, addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:bottom-8 md:right-8">
        {toasts.map(t => (
          <Toast key={t.id} variant={t.variant} title={t.title} message={t.message} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
