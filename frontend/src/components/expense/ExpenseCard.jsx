import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { Card, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export function ExpenseCard({ expense, onEdit, onDelete }) {
  return (
    <Card variant="interactive" className="flex items-start justify-between p-4 bg-card hover:bg-muted/30 transition-all duration-200">
      <div className="flex-1 min-w-0 mr-4">
        <p className="font-semibold text-foreground text-base truncate">{expense.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(expense.expenseDate)}</p>
        {expense.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[280px]">
            {expense.description}
          </p>
        )}
        <div className="mt-2">
          <span className="inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            {expense.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3 shrink-0">
        <span className="font-semibold text-foreground text-lg font-display text-num">
          {formatCurrency(expense.amount)}
        </span>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit?.(expense)} 
            className="h-8 w-8 rounded-full" 
            aria-label="Edit expense"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete?.(expense)} 
            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive" 
            aria-label="Delete expense"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ExpenseCard;
