
import React, { useState } from 'react';
import { Send, Smartphone, Mic, Code, AlertCircle, CheckCircle2, Loader2, Cpu } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { WebhookPayload } from '../types';

const WebhookSimulator: React.FC = () => {
  const [type, setType] = useState<'text' | 'audio'>('text');
  const [text, setText] = useState('Gastei 120 reais no posto com 20 litros de gasolina');
  const [audioUrl, setAudioUrl] = useState('https://storage.evo.com/audio_whatsapp_123.ogg');
  const [phone, setPhone] = useState('554899999999');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const simulateWebhook = async () => {
    setLoading(true);
    setLastResponse(null);
    try {
      const payload: WebhookPayload = {
        from: phone,
        message_type: type,
        message_timestamp: new Date().toISOString(),
        ...(type === 'text' ? { text } : { audio_url: audioUrl })
      };

      let processedText = text;
      
      if (type === 'audio') {
        // Simula transcrição NLP
        processedText = await geminiService.transcribeAudio(audioUrl);
      }

      // Processamento NLP Robusto
      const extraction = await geminiService.parseExpenseText(processedText);

      if (extraction.isExpense) {
        const newExpense = dbService.saveExpense({
          phone_number: payload.from,
          amount: extraction.amount,
          description: extraction.description,
          source: payload.message_type,
          message_timestamp: payload.message_timestamp
        });
        setLastResponse({ 
          success: true, 
          transcribed: type === 'audio' ? processedText : null,
          extraction, 
          expense: newExpense 
        });
      } else {
        setLastResponse({ 
          success: false, 
          error: 'Mensagem não contém um gasto válido.', 
          transcribed: type === 'audio' ? processedText : null,
          extraction 
        });
      }
    } catch (err) {
      setLastResponse({ success: false, error: 'Erro crítico no processamento de linguagem natural.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Simulador de NLP & Webhook</h2>
          <p className="text-slate-500">Teste a robustez da extração de dados do assistente.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
           <Cpu className="w-3 h-3" />
           Powered by Gemini NLP
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-4 p-1 bg-slate-100 rounded-xl">
             <button 
              onClick={() => setType('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${type === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
             >
                <Code className="w-4 h-4" /> Texto
             </button>
             <button 
              onClick={() => setType('audio')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${type === 'audio' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
             >
                <Mic className="w-4 h-4" /> Áudio
             </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Número (Origem)</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {type === 'text' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Mensagem complexa</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  placeholder="Ex: Paguei 120 reais em 2 ingressos de cinema"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">URL do Áudio (.ogg)</label>
                <input 
                  type="text" 
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
          </div>

          <button 
            disabled={loading}
            onClick={simulateWebhook}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Processar com NLP Inteligente
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-xs overflow-hidden border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h4 className="text-slate-500 uppercase font-bold flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Logs do Processador
              </h4>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">JSON Output</span>
            </div>
            <pre className="whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
              {lastResponse ? JSON.stringify(lastResponse, null, 2) : '// Simule uma mensagem para ver os resultados do NLP...'}
            </pre>
          </div>

          {lastResponse && (
            <div className={`p-5 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-bottom-2 ${lastResponse.success ? 'bg-white border-emerald-100' : 'bg-white border-rose-100'}`}>
              <div className="flex items-start gap-4">
                 <div className={`p-3 rounded-xl ${lastResponse.success ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {lastResponse.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className={`font-bold text-lg ${lastResponse.success ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {lastResponse.success ? 'Entidade Extraída' : 'Falha na Extração'}
                    </p>
                    {lastResponse.transcribed && (
                      <p className="text-sm text-slate-600 italic mt-1">"Transcrição: {lastResponse.transcribed}"</p>
                    )}
                    {lastResponse.success ? (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-2 rounded-lg">
                           <p className="text-[10px] text-slate-400 uppercase font-bold">Valor</p>
                           <p className="font-bold text-slate-900">{lastResponse.extraction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg">
                           <p className="text-[10px] text-slate-400 uppercase font-bold">Descrição</p>
                           <p className="font-bold text-slate-900 truncate">{lastResponse.extraction.description}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 mt-2">{lastResponse.error}</p>
                    )}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebhookSimulator;
