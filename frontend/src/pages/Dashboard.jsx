import React, { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/common/Table';
import { LoadingState } from '../components/common/LoadingState';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

import { ErrorState } from '../components/common/ErrorState';

export default function Dashboard() {
  const { summary, isLoading: isLoadingAnalytics, error: errorAnalytics, fetchAnalytics } = useAnalytics();
  const { data, isLoading: isLoadingExpenses, error: errorExpenses, fetchExpenses } = useExpenses();

  const loadAll = () => {
    fetchAnalytics({ granularity: 'monthly' });
    fetchExpenses({ page: 0, size: 5, sortBy: 'DATE', sortDir: 'DESC' });
  };

  useEffect(() => {
    loadAll();
  }, [fetchAnalytics, fetchExpenses]);

  const hasError = errorAnalytics || errorExpenses;

  if (hasError) {
    return (
      <div className="py-12">
        <ErrorState 
          variant="section" 
          message={errorAnalytics || errorExpenses} 
          onRetry={loadAll} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card variant="stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spending</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <LoadingState variant="skeleton" className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold font-display text-num">
                {formatCurrency(summary?.totalAmount)}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card variant="stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Spend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <LoadingState variant="skeleton" className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold font-display text-num">
                {formatCurrency(summary?.averageAmount)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <LoadingState variant="skeleton" className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold font-display text-num">
                {formatCurrency(summary?.highestExpense?.amount)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {summary?.highestExpense?.title || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card variant="stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lowest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <LoadingState variant="skeleton" className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold font-display text-num">
                {formatCurrency(summary?.lowestExpense?.amount)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {summary?.lowestExpense?.title || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingExpenses ? (
            <LoadingState variant="spinner" className="min-h-[150px]" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.content?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No recent expenses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.content?.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium font-display text-num">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
