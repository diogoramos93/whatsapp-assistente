
import { Expense, EvolutionConfig } from '../types';
import { API_BASE_URL } from '../constants';

export const dbService = {
  getExpenses: async (): Promise<Expense[]> => {
    const response = await fetch(`${API_BASE_URL}/expenses`);
    return response.json();
  },

  deleteExpense: async (id: string | number): Promise<void> => {
    await fetch(`${API_BASE_URL}/expenses/${id}`, { method: 'DELETE' });
  },

  // Configurações continuam no localStorage pois são locais do Admin
  getConfig: (): EvolutionConfig => {
    const data = localStorage.getItem('expense_flow_config');
    return data ? JSON.parse(data) : { baseUrl: '', token: '', instanceName: '' };
  },

  saveConfig: (config: EvolutionConfig): void => {
    localStorage.setItem('expense_flow_config', JSON.stringify(config));
  }
};
