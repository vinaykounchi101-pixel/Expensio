import { useState, useCallback } from 'react';
import { budgetService } from '../services/budgetService';

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await budgetService.getAll(params);
      setBudgets(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch budgets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBudget = async (budgetData) => {
    const res = await budgetService.create(budgetData);
    return res;
  };

  const updateBudget = async (id, budgetData) => {
    const res = await budgetService.update(id, budgetData);
    return res;
  };

  const deleteBudget = async (id) => {
    await budgetService.delete(id);
  };

  return {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget
  };
}
