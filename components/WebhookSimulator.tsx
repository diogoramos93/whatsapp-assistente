
import React, { useState } from 'react';
import { Send, Smartphone, Mic, Code, AlertCircle, CheckCircle2, Loader2, Cpu } from 'lucide-react';
import { API_BASE_URL } from '../constants';

const WebhookSimulator: React.FC = () => {
  const [type, setType] = useState<'text' | 'audio'>('text');
  const [text, setText] = useState('Gastei 120 reais no posto');
  const [phone, setPhone] = useState('554899999999');
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const simulateWebhook = async () => {
    setLoading(true);
    setLastResponse(null);
    try {
      const response = await fetch(`${API_BASE_URL}/webhook/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: phone,
          message_type: type,
          message_timestamp: new Date().toISOString(),
          text: type === 'text' ? text : undefined,
          audio_url: type === 'audio' ? 'http://example.com/audio.ogg' : undefined
        })
      });

      const data = await response.json();
      if (response.ok) {
        setLastResponse({ success: true, expense: data });
      } else {
        setLastResponse({ success: false, error: data.detail });
      }
    } catch (err) {
      setLastResponse({ success: false, error: 'Erro ao conectar com o backend local.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h2 className="text-2xl font-bold">Simulador de Webhook Local</h2>
        <p className="text-slate-500">Envia dados para o seu servidor FastAPI para testar o NLP local.</p>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-6">
        <div className="flex gap-4">
           <button onClick={() => setType('text')} className={`px-4 py-2 rounded-lg font-bold ${type === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Texto</button>
           <button onClick={() => setType('audio')} className={`px-4 py-2 rounded-lg font-bold ${type === 'audio' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>Áudio (Simulado)</button>
        </div>

        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 border rounded-xl"
          rows={3}
        />

        <button 
          disabled={loading}
          onClick={simulateWebhook}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
          Simular Mensagem WhatsApp
        </button>

        {lastResponse && (
          <div className={`p-4 rounded-xl border ${lastResponse.success ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <pre className="text-xs font-mono">{JSON.stringify(lastResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookSimulator;
