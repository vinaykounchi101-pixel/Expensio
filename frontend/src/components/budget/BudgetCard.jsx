import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import Button from '../common/Button';
import { BudgetProgress } from './BudgetProgress';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';
import { formatDate } from '../../utils/formatDate';

export function BudgetCard({ budget, onEdit, onDelete }) {
  const categoryLabel = budget.category
    ? EXPENSE_CATEGORIES.find(c => c.value === budget.category)?.label ?? budget.category
    : 'Overall';

  const periodLabel = new Date(budget.periodMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <Card variant="default" className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{categoryLabel} Budget</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{periodLabel}</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onEdit(budget)} className="h-8 w-8" aria-label="Edit budget">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(budget)} className="h-8 w-8 text-destructive hover:bg-destructive/10" aria-label="Delete budget">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1">
        <BudgetProgress
          spent={budget.spent}
          amount={budget.amount}
          utilizationPercent={budget.utilizationPercent}
        />
      </CardContent>
    </Card>
  );
}
