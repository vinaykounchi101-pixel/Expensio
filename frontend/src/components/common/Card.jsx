import React from 'react';

export function Card({ className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'bg-card text-card-foreground shadow-sm',
    stat: 'bg-card text-card-foreground shadow-sm',
    interactive: 'bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer'
  };
  
  return (
    <div 
      className={`rounded-lg border border-border ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={`font-semibold leading-none tracking-tight text-[var(--text-h3)] ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}
