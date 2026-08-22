import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../constants/expenseConstants';

const today = () => new Date().toISOString().split('T')[0];

const emptyForm = {
  title: '',
  amount: '',
  category: '',
  expenseDate: today(),
  description: '',
};

export function ExpenseForm({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (isOpen) {
      setForm(initialData
        ? { ...initialData, amount: String(initialData.amount), expenseDate: initialData.expenseDate }
        : { ...emptyForm, expenseDate: today() }
      );
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 150) errs.title = 'Max 150 characters';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.category) errs.category = 'Category is required';
    if (!form.expenseDate) errs.expenseDate = 'Date is required';
    if (form.expenseDate > today()) errs.expenseDate = 'Date cannot be in the future';
    if (form.description && form.description.length > 500) errs.description = 'Max 500 characters';
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
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        expenseDate: form.expenseDate,
        description: form.description.trim() || null,
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Title"
          name="title"
          id="expense-title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Grocery shopping"
          error={errors.title}
          maxLength={150}
          required
        />
        <Input
          label="Amount (₹)"
          name="amount"
          id="expense-amount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={handleChange}
          prefix="₹"
          error={errors.amount}
          required
        />
        <Select
          label="Category"
          name="category"
          id="expense-category"
          value={form.category}
          onChange={handleChange}
          options={EXPENSE_CATEGORIES}
          placeholder="Select category"
          error={errors.category}
          required
        />
        <Input
          label="Date"
          name="expenseDate"
          id="expense-date"
          type="date"
          value={form.expenseDate}
          onChange={handleChange}
          max={today()}
          error={errors.expenseDate}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expense-description" className="text-sm font-medium text-foreground">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="expense-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            rows={3}
            placeholder="Add a note..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>
        {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
