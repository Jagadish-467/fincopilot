import { Transaction, BudgetCategory, FinancialOverview } from '@/types/finance';

export const mockOverview: FinancialOverview = {
  totalBalance: 24750,
  monthlyIncome: 15000,
  monthlyExpenses: 8430,
  savingsGoal: 5000,
};

export const mockTransactions: Transaction[] = [
  { id: '1', amount: 250, category: 'Food', date: '2026-02-27', note: 'Lunch at campus canteen', type: 'expense' },
  { id: '2', amount: 1200, category: 'Transport', date: '2026-02-26', note: 'Monthly bus pass', type: 'expense' },
  { id: '3', amount: 15000, category: 'Scholarship', date: '2026-02-25', note: 'Merit scholarship disbursement', type: 'income' },
  { id: '4', amount: 450, category: 'Books', date: '2026-02-24', note: 'Data Structures textbook', type: 'expense' },
  { id: '5', amount: 3500, category: 'Rent', date: '2026-02-23', note: 'Hostel room rent', type: 'expense' },
];

export const mockBudgetCategories: BudgetCategory[] = [
  { id: '1', name: 'Rent', allocated: 4000, spent: 3500, colorHex: '#6366f1' },
  { id: '2', name: 'Food', allocated: 3000, spent: 1850, colorHex: '#f59e0b' },
  { id: '3', name: 'Transport', allocated: 1500, spent: 1200, colorHex: '#3b82f6' },
  { id: '4', name: 'Books & Supplies', allocated: 1000, spent: 450, colorHex: '#ec4899' },
  { id: '5', name: 'Entertainment', allocated: 500, spent: 320, colorHex: '#8b5cf6' },
];
