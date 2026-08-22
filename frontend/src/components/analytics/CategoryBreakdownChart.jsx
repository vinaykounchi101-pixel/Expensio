import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { name, value, payload: d } = payload[0];
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-sm">
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-muted-foreground">{formatCurrency(value)}</p>
        <p className="text-muted-foreground">{d.percentOfTotal?.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export function CategoryBreakdownChart({ data = [] }) {
  if (!data.length) return (
    <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
      No data available.
    </div>
  );

  const chartData = data.map(d => ({ name: d.category, value: d.totalAmount, percentOfTotal: d.percentOfTotal }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
