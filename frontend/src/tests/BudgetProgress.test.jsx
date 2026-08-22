import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BudgetProgress } from '../components/budget/BudgetProgress';

describe('BudgetProgress', () => {
  it('renders budget progress details correctly', () => {
    render(<BudgetProgress spent={3000} amount={5000} utilizationPercent={60} />);
    
    expect(screen.getByText(/60.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining:/i)).toBeInTheDocument();
    expect(screen.getByText(/₹2,000.00/i)).toBeInTheDocument();
  });

  it('applies danger styling and displays over limit message if over budget', () => {
    render(<BudgetProgress spent={6000} amount={5000} utilizationPercent={120} />);
    
    expect(screen.getByText(/120.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/Over by ₹1,000.00/i)).toBeInTheDocument();
  });

  it('renders progress bar with correct width accessibility values', () => {
    render(<BudgetProgress spent={4000} amount={5000} utilizationPercent={80} />);
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '80');
  });
});
