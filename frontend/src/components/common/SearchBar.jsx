import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Input from './Input';

export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, onChange]);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        prefix={<Search className="h-4 w-4" />}
        className={searchTerm ? 'pr-8' : ''}
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
