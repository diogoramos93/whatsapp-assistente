
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Módulo de Processamento de Linguagem Natural (NLP)
 * 
 * Este módulo utiliza o modelo Gemini para extração de entidades.
 * Em uma implementação Python/FastAPI de produção, este serviço poderia ser 
 * complementado ou substituído por:
 * 1. Spacy (com modelo pt_core_news_lg) para NER (Named Entity Recognition).
 * 2. Facebook Duckling para extração robusta de valores monetários e dimensões.
 * 3. Expressões Regulares (Regex) para limpeza prévia de tokens.
 */
export const geminiService = {
  
  /**
   * Processa o texto da mensagem para extrair dados financeiros.
   */
  async parseExpenseText(text: string): Promise<{ amount: number; description: string; isExpense: boolean }> {
    // PRÉ-PROCESSAMENTO:
    // Aqui poderíamos normalizar o texto, remover emojis ou tratar gírias específicas 
    // antes de enviar para o LLM para economizar tokens ou melhorar a precisão.
    const sanitizedText = text.trim();

    if (!sanitizedText) {
      return { amount: 0, description: "", isExpense: false };
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: sanitizedText,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { 
                type: Type.NUMBER, 
                description: "Valor numérico da despesa" 
              },
              description: { 
                type: Type.STRING, 
                description: "O que foi comprado ou pago" 
              },
              isExpense: { 
                type: Type.BOOLEAN, 
                description: "Se o texto representa um gasto válido" 
              }
            },
            required: ["amount", "description", "isExpense"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');

      // PÓS-PROCESSAMENTO / VALIDAÇÃO:
      // Garante que o valor extraído é positivo e a descrição não está vazia
      if (result.isExpense && (result.amount <= 0 || !result.description)) {
        console.warn("AI retornou gasto inválido:", result);
        result.isExpense = false;
      }

      return result;
    } catch (error) {
      console.error("Erro no processamento NLP (Gemini):", error);
      
      /**
       * FALLBACK ROBUSTO:
       * Caso a API de IA falhe, utilizamos uma lógica baseada em Regex
       * para tentar salvar o dado básico do usuário.
       */
      return this.fallbackRegexParser(sanitizedText);
    }
  },

  /**
   * Parser de contingência baseado em padrões conhecidos de moeda brasileira.
   */
  fallbackRegexParser(text: string): { amount: number; description: string; isExpense: boolean } {
    // Procura por formatos como 50,00 | 50.00 | R$ 50
    const currencyRegex = /(?:R\$?\s?)?(\d+(?:[.,]\d+)?)/i;
    const match = text.match(currencyRegex);

    if (match) {
      const amount = parseFloat(match[1].replace(',', '.'));
      // Remove o valor da string para tentar obter a descrição
      const description = text.replace(match[0], '').replace(/gastei|paguei|com|em|no|na/gi, '').trim();
      
      return {
        amount,
        description: description || "Gasto não identificado",
        isExpense: amount > 0
      };
    }

    return { amount: 0, description: text, isExpense: false };
  },

  /**
   * Transcrição de áudio via Speech-to-Text.
   * Futuramente, integrar aqui o OpenAI Whisper ou Google Speech-to-Text v2.
   * No backend Python, o uso do pacote 'openai-whisper' localmente seria ideal.
   */
  async transcribeAudio(audioUrl: string): Promise<string> {
    console.log(`[NLP] Iniciando transcrição de áudio: ${audioUrl}`);
    
    // Simulação de latência de rede/processamento
    await new Promise(r => setTimeout(r, 1200));

    // Mocks realistas para teste de robustez
    const mocks = [
      "Acabei de gastar cinquenta e dois reais no mercado",
      "Paguei 15 com estacionamento agora",
      "R$ 120,50 na conta de luz",
      "Comprei 3 cervejas por 25 reais",
      "Despesa de 80 reais com gasolina aditivada"
    ];
    
    return mocks[Math.floor(Math.random() * mocks.length)];
  }
};
