export const EXPENSE_CATEGORIES = [
  { value: 'FOOD', label: 'Food' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'BILLS', label: 'Bills' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'OTHER', label: 'Other' },
];

export const SORT_FIELDS = [
  { value: 'DATE', label: 'Date' },
  { value: 'AMOUNT', label: 'Amount' },
  { value: 'TITLE', label: 'Title' },
];

export const SORT_DIRECTIONS = [
  { value: 'DESC', label: 'Newest first' },
  { value: 'ASC', label: 'Oldest first' },
];

export const PAGE_SIZES = [10, 20, 50];

export const DEFAULT_FILTERS = {
  q: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sortBy: 'DATE',
  sortDir: 'DESC',
  page: 0,
  size: 20,
};
