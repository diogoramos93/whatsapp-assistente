
export interface Expense {
  id: string;
  phone_number: string;
  amount: number;
  description: string;
  source: 'text' | 'audio';
  message_timestamp: string;
  created_at: string;
}

export interface WebhookPayload {
  from: string;
  message_type: 'text' | 'audio';
  text?: string;
  audio_url?: string;
  message_timestamp: string;
}

export interface EvolutionConfig {
  baseUrl: string;
  token: string;
  instanceName: string;
}

export interface DashboardStats {
  totalToday: number;
  totalMonth: number;
  totalGeneral: number;
  dailyData: { date: string; amount: number }[];
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  EXPENSES = 'expenses',
  INTEGRATIONS = 'integrations',
  WEBHOOK_SIM = 'webhook-sim',
  DOCUMENTATION = 'documentation',
  LOGIN = 'login'
}
