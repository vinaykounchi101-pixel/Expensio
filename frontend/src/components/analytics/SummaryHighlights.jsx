import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { formatCurrency } from '../../utils/formatCurrency';

export function SummaryHighlights({ summary }) {
  if (!summary) return null;

  const stats = [
    {
      label: 'Total Spending',
      value: formatCurrency(summary.totalAmount),
      icon: DollarSign,
      iconClass: 'text-primary',
    },
    {
      label: 'Average Expense',
      value: formatCurrency(summary.averageAmount),
      icon: Activity,
      iconClass: 'text-chart-3',
    },
    {
      label: 'Highest Expense',
      value: formatCurrency(summary.highestExpense?.amount),
      sub: summary.highestExpense?.title,
      icon: TrendingUp,
      iconClass: 'text-destructive',
    },
    {
      label: 'Lowest Expense',
      value: formatCurrency(summary.lowestExpense?.amount),
      sub: summary.lowestExpense?.title,
      icon: TrendingDown,
      iconClass: 'text-success',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, sub, icon: Icon, iconClass }) => (
        <Card key={label} variant="stat">
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums text-foreground">{value}</div>
            {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
