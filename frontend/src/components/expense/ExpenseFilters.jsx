import React from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { EXPENSE_CATEGORIES, SORT_FIELDS, SORT_DIRECTIONS } from '../../constants/expenseConstants';
import { X } from 'lucide-react';

export function ExpenseFilters({ filters, onChange, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value, page: 0 });
  };

  const hasActiveFilters = filters.category || filters.dateFrom || filters.dateTo ||
    filters.amountMin || filters.amountMax || filters.q;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Select
          label="Category"
          name="category"
          id="filter-category"
          value={filters.category}
          onChange={handleChange}
          options={EXPENSE_CATEGORIES}
          placeholder="All categories"
        />
        <Input
          label="Date From"
          name="dateFrom"
          id="filter-date-from"
          type="date"
          value={filters.dateFrom}
          onChange={handleChange}
        />
        <Input
          label="Date To"
          name="dateTo"
          id="filter-date-to"
          type="date"
          value={filters.dateTo}
          onChange={handleChange}
          min={filters.dateFrom}
        />
        <Input
          label="Min Amount (₹)"
          name="amountMin"
          id="filter-amount-min"
          type="number"
          min="0"
          step="0.01"
          value={filters.amountMin}
          onChange={handleChange}
          prefix="₹"
        />
        <Input
          label="Max Amount (₹)"
          name="amountMax"
          id="filter-amount-max"
          type="number"
          min="0"
          step="0.01"
          value={filters.amountMax}
          onChange={handleChange}
          prefix="₹"
        />
        <Select
          label="Sort By"
          name="sortBy"
          id="filter-sort-by"
          value={filters.sortBy}
          onChange={handleChange}
          options={SORT_FIELDS}
        />
        <Select
          label="Sort Direction"
          name="sortDir"
          id="filter-sort-dir"
          value={filters.sortDir}
          onChange={handleChange}
          options={SORT_DIRECTIONS}
        />
      </div>
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <X className="mr-1.5 h-4 w-4" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
