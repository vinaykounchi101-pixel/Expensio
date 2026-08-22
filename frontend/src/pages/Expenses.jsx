import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter } from 'lucide-react';
import Button from '../components/common/Button';
import { SearchBar } from '../components/common/SearchBar';
import { ExpenseFilters } from '../components/expense/ExpenseFilters';
import { ExpenseTable } from '../components/expense/ExpenseTable';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { ExpenseForm } from '../components/expense/ExpenseForm';
import { Modal } from '../components/common/Modal';
import { useExpenses } from '../hooks/useExpenses';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';
import { DEFAULT_FILTERS } from '../constants/expenseConstants';

export default function Expenses() {
  const { data, isLoading, error, fetchExpenses, createExpense, updateExpense, deleteExpense } = useExpenses();
  const { addToast } = useApp();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback((f) => {
    fetchExpenses(f);
  }, [fetchExpenses]);

  useEffect(() => {
    load(filters);
  }, [filters]);

  const handleFilterChange = (updated) => setFilters(updated);
  const handleReset = () => setFilters(DEFAULT_FILTERS);
  const handleSearch = (q) => setFilters(prev => ({ ...prev, q, page: 0 }));
  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page }));
  const handleSort = (sortBy, sortDir) => setFilters(prev => ({ ...prev, sortBy, sortDir, page: 0 }));

  const handleOpenAdd = () => { setEditingExpense(null); setFormOpen(true); };
  const handleOpenEdit = (expense) => { setEditingExpense(expense); setFormOpen(true); };

  const handleSubmit = async (expenseData) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expenseData);
      addToast({ variant: 'success', title: 'Expense updated', message: `"${expenseData.title}" has been updated.` });
    } else {
      await createExpense(expenseData);
      addToast({ variant: 'success', title: 'Expense added', message: `"${expenseData.title}" has been added.` });
    }
    load(filters);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteExpense(deleteTarget.id);
      addToast({ variant: 'success', title: 'Expense deleted', message: `"${deleteTarget.title}" has been removed.` });
      setDeleteTarget(null);
      load(filters);
    } catch (err) {
      addToast({ variant: 'error', title: 'Delete failed', message: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = filters.category || filters.dateFrom || filters.dateTo ||
    filters.amountMin || filters.amountMax;
  const isEmpty = !isLoading && !error && data.content?.length === 0;
  const emptyVariant = hasActiveFilters || filters.q ? 'filtered' : 'first-run';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <SearchBar
            value={filters.q}
            onChange={handleSearch}
            placeholder="Search expenses..."
            className="w-full max-w-xs"
          />
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(v => !v)}
            id="toggle-filters-btn"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} id="add-expense-btn">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <ExpenseFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      )}

      {/* Summary bar */}
      {!isLoading && !error && data.totalElements > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{data.content?.length}</span> of{' '}
          <span className="font-medium text-foreground">{data.totalElements}</span> expenses
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingState variant="spinner" />
      ) : error ? (
        <ErrorState variant="section" message={error} onRetry={() => load(filters)} />
      ) : isEmpty ? (
        <EmptyState
          variant={emptyVariant}
          title={emptyVariant === 'first-run' ? 'No expenses yet' : 'No matching expenses'}
          description={emptyVariant === 'first-run'
            ? 'Add your first expense to start tracking your spending.'
            : 'Try adjusting your filters or search term.'}
          action={emptyVariant === 'first-run'
            ? <Button variant="primary" onClick={handleOpenAdd}><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
            : <Button variant="outline" onClick={handleReset}>Clear Filters</Button>
          }
        />
      ) : (
        <>
          <ExpenseTable
            expenses={data.content}
            sortBy={filters.sortBy}
            sortDir={filters.sortDir}
            onSort={handleSort}
            onEdit={handleOpenEdit}
            onDelete={setDeleteTarget}
          />
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add / Edit Modal */}
      <ExpenseForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingExpense}
      />

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Expense">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteTarget?.title}"</span>
          {' '}({formatCurrency(deleteTarget?.amount)})? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteConfirm} isLoading={isDeleting} id="confirm-delete-btn">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
