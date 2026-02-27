export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  type: 'income' | 'expense';
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  colorHex: string;
}

export interface Scholarship {
  id: string;
  name: string;
  deadline: string;
  amount: number;
  status: 'draft' | 'submitted' | 'awarded' | 'rejected';
}

export interface FinancialOverview {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
