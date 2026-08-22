import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';

const firstOfCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

const emptyForm = { amount: '', category: '', periodMonth: firstOfCurrentMonth() };

export function BudgetForm({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (isOpen) {
      setForm(initialData
        ? { amount: String(initialData.amount), category: initialData.category ?? '', periodMonth: initialData.periodMonth?.slice(0, 7) + '-01' }
        : { ...emptyForm, periodMonth: firstOfCurrentMonth() }
      );
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.periodMonth) errs.periodMonth = 'Period month is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      await onSubmit({
        amount: Number(form.amount),
        category: form.category || null,
        periodMonth: form.periodMonth,
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = [{ value: '', label: 'Overall (all categories)' }, ...EXPENSE_CATEGORIES];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Budget' : 'Add Budget'}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Budget Amount (₹)"
          name="amount"
          id="budget-amount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={handleChange}
          prefix="₹"
          error={errors.amount}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="budget-period" className="text-sm font-medium text-foreground">Period Month</label>
          <input
            id="budget-period"
            name="periodMonth"
            type="month"
            value={form.periodMonth?.slice(0, 7)}
            onChange={(e) => {
              const val = e.target.value;
              setForm(prev => ({ ...prev, periodMonth: val ? `${val}-01` : '' }));
            }}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          />
          {errors.periodMonth && <p className="text-xs text-destructive">{errors.periodMonth}</p>}
        </div>
        <Select
          label="Category"
          name="category"
          id="budget-category"
          value={form.category}
          onChange={handleChange}
          options={categoryOptions}
          disabled={isEditing}
        />
        {isEditing && <p className="text-xs text-muted-foreground">Category and period cannot be changed after creation.</p>}
        {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Add Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
