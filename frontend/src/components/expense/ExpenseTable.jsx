import React from 'react';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../common/Table';
import Button from '../common/Button';
import ExpenseCard from './ExpenseCard';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const SortIcon = ({ field, sortBy, sortDir }) => {
  if (sortBy !== field) return null;
  return sortDir === 'ASC' ? <ChevronUp className="inline h-3 w-3 ml-1" /> : <ChevronDown className="inline h-3 w-3 ml-1" />;
};

export function ExpenseTable({ expenses, sortBy, sortDir, onSort, onEdit, onDelete }) {
  const handleSort = (field) => {
    if (sortBy === field) {
      onSort(field, sortDir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      onSort(field, 'ASC');
    }
  };

  const thClass = "cursor-pointer select-none hover:text-foreground transition-colors";

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={thClass} onClick={() => handleSort('DATE')}>
                Date <SortIcon field="DATE" sortBy={sortBy} sortDir={sortDir} />
              </TableHead>
              <TableHead className={thClass} onClick={() => handleSort('TITLE')}>
                Title <SortIcon field="TITLE" sortBy={sortBy} sortDir={sortDir} />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className={`${thClass} text-right`} onClick={() => handleSort('AMOUNT')}>
                Amount <SortIcon field="AMOUNT" sortBy={sortBy} sortDir={sortDir} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell className="text-muted-foreground text-sm">{formatDate(expense.expenseDate)}</TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{expense.title}</div>
                  {expense.description && (
                    <div className="text-xs text-muted-foreground truncate max-w-[240px]">{expense.description}</div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground tabular-nums">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} className="h-8 w-8" aria-label="Edit expense">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(expense)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" aria-label="Delete expense">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden flex flex-col gap-3 p-4 bg-muted/20">
        {expenses.map(expense => (
          <ExpenseCard 
            key={expense.id} 
            expense={expense} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
}
