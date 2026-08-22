import { useState, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export function useAnalytics() {
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [trend, setTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (params = { granularity: 'monthly' }) => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, breakRes, trendRes] = await Promise.all([
        analyticsService.getSummary(params),
        analyticsService.getBreakdown(params),
        analyticsService.getTrend(params)
      ]);
      setSummary(sumRes);
      setBreakdown(breakRes);
      setTrend(trendRes);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    summary,
    breakdown,
    trend,
    isLoading,
    error,
    fetchAnalytics
  };
}
