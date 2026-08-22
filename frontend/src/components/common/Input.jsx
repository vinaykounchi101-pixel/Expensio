import React from 'react';

const Input = React.forwardRef(({ className = '', error, prefix, label, id, ...props }, ref) => {
  const inputId = id || React.useId();
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
          } ${prefix ? 'pl-8' : ''} ${className}`}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
