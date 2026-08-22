import React from 'react';
import { getBudgetStatus } from '../../constants/budgetConstants';
import { formatCurrency } from '../../utils/formatCurrency';

export function BudgetProgress({ spent, amount, utilizationPercent }) {
  const status = getBudgetStatus(utilizationPercent ?? 0);

  const barColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
  };

  const textColors = {
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };

  const clampedPercent = Math.min(utilizationPercent ?? 0, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Spent: <span className="font-semibold text-foreground tabular-nums">{formatCurrency(spent)}</span>
        </span>
        <span className={`font-semibold tabular-nums ${textColors[status]}`}>
          {(utilizationPercent ?? 0).toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden" role="progressbar"
        aria-valuenow={clampedPercent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColors[status]}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Budget: <span className="tabular-nums">{formatCurrency(amount)}</span></span>
        <span>
          {(utilizationPercent ?? 0) > 100
            ? <span className="text-destructive font-medium">Over by {formatCurrency((spent ?? 0) - (amount ?? 0))}</span>
            : <span>Remaining: <span className="tabular-nums">{formatCurrency((amount ?? 0) - (spent ?? 0))}</span></span>
          }
        </span>
      </div>
    </div>
  );
}
