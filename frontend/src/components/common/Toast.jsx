import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export function Toast({ variant = 'info', title, message, onClose, className = '' }) {
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    info: 'bg-card border-border text-foreground',
    success: 'bg-success/10 border-success text-success-foreground',
    warning: 'bg-warning/10 border-warning text-warning-foreground',
    error: 'bg-destructive/10 border-destructive text-destructive-foreground',
  };

  const icons = {
    info: <Info className="h-5 w-5 text-primary" />,
    success: <CheckCircle2 className="h-5 w-5 text-success" />,
    warning: <AlertCircle className="h-5 w-5 text-warning" />,
    error: <XCircle className="h-5 w-5 text-destructive" />
  };

  return (
    <div className={`pointer-events-auto flex w-full max-w-md rounded-lg border p-4 shadow-md transition-all animate-in slide-in-from-bottom-5 fade-in duration-200 ${variants[variant]} ${className}`}>
      <div className="mr-3 mt-0.5">{icons[variant]}</div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-semibold">{title}</h4>}
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
