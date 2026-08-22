import React from 'react';

export function Table({ className = '', ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full text-left text-sm ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = '', ...props }) {
  return <thead className={`border-b border-border bg-muted/50 ${className}`} {...props} />;
}

export function TableRow({ className = '', ...props }) {
  return <tr className={`border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`} {...props} />;
}

export function TableHead({ className = '', ...props }) {
  return <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className}`} {...props} />;
}

export function TableCell({ className = '', ...props }) {
  return <td className={`p-4 align-middle ${className}`} {...props} />;
}

export function TableBody({ className = '', ...props }) {
  return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />;
}
