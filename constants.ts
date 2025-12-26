
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

export const AUTH_STORAGE_KEY = 'expense_flow_auth';
export const API_BASE_URL = 'http://localhost:8000'; // URL do backend FastAPI

// Prompt do sistema para o modelo Gemini extrair dados estruturados de despesas
export const SYSTEM_PROMPT = `Você é um assistente financeiro especializado em extrair informações de gastos a partir de mensagens de texto ou transcrições de áudio.
Sua tarefa é identificar se a mensagem descreve uma despesa e extrair o valor numérico (amount) e uma breve descrição do que foi comprado ou pago (description).

Regras:
1. "isExpense" deve ser verdadeiro se a mensagem claramente descreve um gasto de dinheiro.
2. "amount" deve ser o valor numérico total encontrado. Use 0 se não encontrar.
3. "description" deve ser o item ou serviço adquirido de forma resumida.
4. Responda estritamente com o JSON conforme o esquema solicitado.`;
