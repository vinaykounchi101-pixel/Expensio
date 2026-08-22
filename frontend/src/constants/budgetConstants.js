export const BUDGET_PERIODS = [
  { value: 'MONTHLY', label: 'Monthly' },
];

export const UTILIZATION_THRESHOLDS = {
  WARNING: 80,
  DANGER: 100,
};

export const getBudgetStatus = (utilizationPercent) => {
  if (utilizationPercent >= UTILIZATION_THRESHOLDS.DANGER) return 'destructive';
  if (utilizationPercent >= UTILIZATION_THRESHOLDS.WARNING) return 'warning';
  return 'success';
};
