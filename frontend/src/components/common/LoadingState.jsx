import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ variant = 'spinner', className = '', ...props }) {
  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse rounded-md bg-muted ${className}`} {...props} />
    );
  }
  
  if (variant === 'inline') {
    return (
      <div className={`flex items-center text-sm text-muted-foreground ${className}`} {...props}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  // default spinner
  return (
    <div className={`flex min-h-[200px] flex-col items-center justify-center p-8 ${className}`} {...props}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
