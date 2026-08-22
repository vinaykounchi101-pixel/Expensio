import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

export function ErrorState({ variant = 'section', message = 'Something went wrong', onRetry, className = '' }) {
  if (variant === 'inline') {
    return (
      <div className={`flex items-center text-sm text-destructive ${className}`}>
        <AlertCircle className="mr-2 h-4 w-4" />
        {message}
      </div>
    );
  }

  const containerClasses = variant === 'page' 
    ? 'flex min-h-screen flex-col items-center justify-center p-8' 
    : 'flex min-h-[200px] flex-col items-center justify-center p-8 rounded-lg border border-border bg-card';

  return (
    <div className={`${containerClasses} ${className}`}>
      <AlertCircle className="mb-4 h-10 w-10 text-destructive" />
      <h3 className="mb-2 text-lg font-semibold text-foreground">Error</h3>
      <p className="mb-6 text-center text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>Retry</Button>
      )}
    </div>
  );
}
