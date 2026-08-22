import React from 'react';
import { FileQuestion, FolderSearch, PlusCircle } from 'lucide-react';

export function EmptyState({ variant = 'default', title, description, action, className = '' }) {
  const icons = {
    default: <FileQuestion className="h-12 w-12 text-muted-foreground" />,
    filtered: <FolderSearch className="h-12 w-12 text-muted-foreground" />,
    'first-run': <PlusCircle className="h-12 w-12 text-primary/50" />
  };

  return (
    <div className={`flex min-h-[300px] flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border bg-card/50 ${className}`}>
      <div className="mb-4 rounded-full bg-muted p-4">
        {icons[variant]}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title || 'No results found'}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description || "We couldn't find anything matching your request."}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
