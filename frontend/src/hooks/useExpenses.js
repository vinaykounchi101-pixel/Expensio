import { useState, useCallback } from 'react';
import { expenseService } from '../services/expenseService';

export function useExpenses() {
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0, page: 0, size: 20 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await expenseService.getAll(params);
      setData(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExpense = async (expenseData) => {
    const res = await expenseService.create(expenseData);
    return res;
  };

  const updateExpense = async (id, expenseData) => {
    const res = await expenseService.update(id, expenseData);
    return res;
  };

  const deleteExpense = async (id) => {
    await expenseService.delete(id);
  };

  return {
    data,
    isLoading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  };
}
