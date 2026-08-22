import React from 'react';

const Select = React.forwardRef(({ className = '', error, label, id, options = [], placeholder, ...props }, ref) => {
  const selectId = id || React.useId();
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label htmlFor={selectId} className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option 
              value="" 
              disabled 
              className="bg-card text-muted-foreground" 
              style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)' }}
            >
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option 
              key={opt.value} 
              value={opt.value} 
              className="bg-card text-foreground"
              style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
