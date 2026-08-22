import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseFilters } from '../components/expense/ExpenseFilters';

const mockFilters = {
  q: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sortBy: 'DATE',
  sortDir: 'DESC',
  page: 0,
  size: 20,
};

describe('ExpenseFilters', () => {
  it('renders all filter controls', () => {
    render(<ExpenseFilters filters={mockFilters} onChange={() => {}} onReset={() => {}} />);
    
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date From/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date To/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sort By/i)).toBeInTheDocument();
  });

  it('triggers onChange when a filter option is selected', () => {
    const handleChange = vi.fn();
    render(<ExpenseFilters filters={mockFilters} onChange={handleChange} onReset={() => {}} />);
    
    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.change(categorySelect, { target: { value: 'FOOD' } });

    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      category: 'FOOD',
      page: 0
    }));
  });

  it('renders clear filters button only when active filters exist', () => {
    const { rerender } = render(
      <ExpenseFilters filters={mockFilters} onChange={() => {}} onReset={() => {}} />
    );
    expect(screen.queryByRole('button', { name: /Clear filters/i })).not.toBeInTheDocument();

    const activeFilters = { ...mockFilters, category: 'FOOD' };
    rerender(<ExpenseFilters filters={activeFilters} onChange={() => {}} onReset={() => {}} />);
    expect(screen.getByRole('button', { name: /Clear filters/i })).toBeInTheDocument();
  });
});
