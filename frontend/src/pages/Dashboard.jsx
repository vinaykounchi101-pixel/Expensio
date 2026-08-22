import React, { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/common/Table';
import { LoadingState } from '../components/common/LoadingState';
import { CategoryBreakdownChart } from '../components/analytics/CategoryBreakdownChart';
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart';
import { ErrorState } from '../components/common/ErrorState';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { summary, breakdown, trend, isLoading: isLoadingAnalytics, error: errorAnalytics, fetchAnalytics } = useAnalytics();
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

  const statCards = [
    {
      title: 'Total Spending',
      value: summary?.totalAmount,
      icon: DollarSign,
      color: 'text-primary bg-primary/10',
      description: 'Total expenses tracked'
    },
    {
      title: 'Average Spend',
      value: summary?.averageAmount,
      icon: Activity,
      color: 'text-chart-3 bg-chart-3/10',
      description: 'Average per expense transaction'
    },
    {
      title: 'Highest Expense',
      value: summary?.highestExpense?.amount,
      icon: TrendingUp,
      color: 'text-destructive bg-destructive/10',
      description: summary?.highestExpense?.title || 'No data yet'
    },
    {
      title: 'Lowest Expense',
      value: summary?.lowestExpense?.amount,
      icon: TrendingDown,
      color: 'text-success bg-success/10',
      description: summary?.lowestExpense?.title || 'No data yet'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor your financial stats, recent transactions, and category metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} variant="stat" className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <LoadingState variant="skeleton" className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold font-display text-num text-foreground">
                  {formatCurrency(stat.value)}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1.5 truncate">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Analytics Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5 text-primary" />
              Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <LoadingState variant="spinner" className="h-64" />
            ) : (
              <SpendingTrendChart data={trend} />
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <PieChartIcon className="h-5 w-5 text-chart-2" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <LoadingState variant="spinner" className="h-64" />
            ) : (
              <CategoryBreakdownChart data={breakdown} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingExpenses ? (
            <LoadingState variant="spinner" className="min-h-[150px]" />
          ) : (
            <div className="overflow-x-auto">
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
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No recent expenses found. Add some to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.content?.map(expense => (
                      <TableRow key={expense.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="text-muted-foreground text-sm">{formatDate(expense.expenseDate)}</TableCell>
                        <TableCell className="font-semibold text-foreground">{expense.title}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-sm bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                            {expense.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold font-display text-num text-foreground">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simple fallback icon wrapper for pie chart
function PieChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
