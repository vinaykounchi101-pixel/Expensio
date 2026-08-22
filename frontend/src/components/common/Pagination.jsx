import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Button from './Button';

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 2) return [0, 1, 2, 3, '...', totalPages - 1];
    if (currentPage >= totalPages - 3) return [0, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    return [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
  };

  return (
    <nav role="navigation" aria-label="Pagination" className={`flex w-full justify-center ${className}`}>
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        {getVisiblePages().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <div className="flex h-10 w-10 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? 'outline' : 'ghost'}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page + 1}
              </Button>
            )}
          </li>
        ))}
        <li>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
