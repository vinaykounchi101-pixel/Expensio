import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function SpendingTrendChart({ data = [] }) {
  if (!data.length) return (
    <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
      No data available.
    </div>
  );

  const chartData = data.map(d => ({ label: d.periodLabel, amount: d.totalAmount }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#colorAmount)"
          dot={{ r: 4, fill: 'var(--chart-1)', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: 'var(--chart-1)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
