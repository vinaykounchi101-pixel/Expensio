import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExpenses } from '../hooks/useExpenses';
import { expenseService } from '../services/expenseService';

vi.mock('../services/expenseService', () => ({
  expenseService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('useExpenses Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initially returns empty and idle state', () => {
    const { result } = renderHook(() => useExpenses());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data.content).toEqual([]);
  });

  it('updates data on successful fetchExpenses', async () => {
    const mockResponse = {
      content: [{ id: 1, title: 'Coffee', amount: 50.0 }],
      totalElements: 1,
      totalPages: 1,
      page: 0,
      size: 20
    };
    
    expenseService.getAll.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.fetchExpenses();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('captures error state on failed fetchExpenses', async () => {
    const errorMessage = 'Network error';
    expenseService.getAll.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useExpenses());

    await act(async () => {
      await result.current.fetchExpenses();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});
