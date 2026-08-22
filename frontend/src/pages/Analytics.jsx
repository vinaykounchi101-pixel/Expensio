import React, { useState, useEffect, useCallback } from 'react';
import { SummaryHighlights } from '../components/analytics/SummaryHighlights';
import { CategoryBreakdownChart } from '../components/analytics/CategoryBreakdownChart';
import { SpendingTrendChart } from '../components/analytics/SpendingTrendChart';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { useAnalytics } from '../hooks/useAnalytics';

const GRANULARITIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function Analytics() {
  const { summary, breakdown, trend, isLoading, error, fetchAnalytics } = useAnalytics();
  const [granularity, setGranularity] = useState('monthly');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = useCallback(() => {
    fetchAnalytics({ granularity, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
  }, [fetchAnalytics, granularity, dateFrom, dateTo]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <Select
          label="Granularity"
          id="analytics-granularity"
          value={granularity}
          onChange={(e) => setGranularity(e.target.value)}
          options={GRANULARITIES}
          className="w-36"
        />
        <Input
          label="From"
          id="analytics-date-from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-40"
        />
        <Input
          label="To"
          id="analytics-date-to"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          min={dateFrom}
          className="w-40"
        />
      </div>

      {isLoading ? (
        <LoadingState variant="spinner" />
      ) : error ? (
        <ErrorState variant="section" message={error} onRetry={load} />
      ) : (
        <div className="space-y-6">
          {/* Summary stat cards */}
          <SummaryHighlights summary={summary} />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryBreakdownChart data={breakdown} />
              </CardContent>
            </Card>

            {/* Spending Trend */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Spending Trend
                  <span className="ml-2 text-sm font-normal text-muted-foreground capitalize">({granularity})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpendingTrendChart data={trend} />
              </CardContent>
            </Card>
          </div>

          {/* Category breakdown table */}
          {breakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {breakdown.map((item) => (
                    <div key={item.category} className="flex items-center justify-between px-6 py-3">
                      <span className="text-sm font-medium text-foreground">{item.category}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${item.percentOfTotal}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">{item.percentOfTotal?.toFixed(1)}%</span>
                        <span className="text-sm font-semibold text-foreground tabular-nums w-28 text-right">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
