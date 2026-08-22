import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import { BudgetCard } from '../components/budget/BudgetCard';
import { BudgetForm } from '../components/budget/BudgetForm';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Modal } from '../components/common/Modal';
import { useBudgets } from '../hooks/useBudgets';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function Budgets() {
  const { budgets, isLoading, error, fetchBudgets, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { addToast } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(() => fetchBudgets(), [fetchBudgets]);

  useEffect(() => { load(); }, [load]);

  const handleOpenAdd = () => { setEditingBudget(null); setFormOpen(true); };
  const handleOpenEdit = (b) => { setEditingBudget(b); setFormOpen(true); };

  const handleSubmit = async (data) => {
    if (editingBudget) {
      await updateBudget(editingBudget.id, { amount: data.amount });
      addToast({ variant: 'success', title: 'Budget updated' });
    } else {
      await createBudget(data);
      addToast({ variant: 'success', title: 'Budget created' });
    }
    load();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBudget(deleteTarget.id);
      addToast({ variant: 'success', title: 'Budget deleted' });
      setDeleteTarget(null);
      load();
    } catch (err) {
      addToast({ variant: 'error', title: 'Delete failed', message: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {!isLoading && !error && `${budgets?.length ?? 0} budget${budgets?.length !== 1 ? 's' : ''} active`}
        </p>
        <Button variant="primary" onClick={handleOpenAdd} id="add-budget-btn">
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {isLoading ? (
        <LoadingState variant="spinner" />
      ) : error ? (
        <ErrorState variant="section" message={error} onRetry={load} />
      ) : !budgets?.length ? (
        <EmptyState
          variant="first-run"
          title="No budgets yet"
          description="Create a budget to track your spending against a monthly limit."
          action={<Button variant="primary" onClick={handleOpenAdd}><Plus className="mr-2 h-4 w-4" />Add Budget</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map(b => (
            <BudgetCard key={b.id} budget={b} onEdit={handleOpenEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <BudgetForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingBudget}
      />

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Budget">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete the{' '}
          <span className="font-semibold text-foreground">
            {deleteTarget?.category ?? 'Overall'} budget ({formatCurrency(deleteTarget?.amount)})
          </span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteConfirm} isLoading={isDeleting} id="confirm-delete-budget-btn">Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
