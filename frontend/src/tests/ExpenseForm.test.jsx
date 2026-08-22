import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseForm } from '../components/expense/ExpenseForm';

describe('ExpenseForm', () => {
  it('renders form fields when modal is open', () => {
    render(<ExpenseForm isOpen={true} onClose={() => {}} onSubmit={() => {}} />);
    
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('validates fields and shows error messages on empty submit', async () => {
    render(<ExpenseForm isOpen={true} onClose={() => {}} onSubmit={() => {}} />);
    
    const submitBtn = screen.getByRole('button', { name: /Add Expense/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Enter a valid positive amount/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with mapped inputs when valid', async () => {
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();
    
    render(<ExpenseForm isOpen={true} onClose={handleClose} onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Dinner Out' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '150.50' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'FOOD' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2026-08-20' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Weekend outing' } });

    const submitBtn = screen.getByRole('button', { name: /Add Expense/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        title: 'Dinner Out',
        amount: 150.50,
        category: 'FOOD',
        expenseDate: '2026-08-20',
        description: 'Weekend outing',
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
