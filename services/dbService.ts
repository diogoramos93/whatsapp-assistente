
import { Expense, EvolutionConfig } from '../types';
import { DB_STORAGE_KEY, CONFIG_STORAGE_KEY } from '../constants';

export const dbService = {
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(DB_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveExpense: (expense: Omit<Expense, 'id' | 'created_at'>): Expense => {
    const expenses = dbService.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    expenses.push(newExpense);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(expenses));
    return newExpense;
  },

  deleteExpense: (id: string): void => {
    const expenses = dbService.getExpenses().filter(e => e.id !== id);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(expenses));
  },

  getConfig: (): EvolutionConfig => {
    const data = localStorage.getItem(CONFIG_STORAGE_KEY);
    return data ? JSON.parse(data) : { baseUrl: '', token: '', instanceName: '' };
  },

  saveConfig: (config: EvolutionConfig): void => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  }
};
