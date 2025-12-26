
import React, { useState } from 'react';
import { 
  Book, Code, Globe, Zap, Database, Mic, ShieldCheck, 
  Terminal, Server, Lock, Layers, ChevronRight, Copy, Check 
} from 'lucide-react';

const Documentation: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    {
      title: '1. Requisitos de Infraestrutura',
      icon: Server,
      content: `Sistema 100% Open-Source e Auto-Hospedado:
      \n• **S.O.:** Ubuntu 22.04 LTS.
      \n• **Processamento:** Extração NLP local via Regex (Custo Zero).
      \n• **Hardware:** 2 vCPU, 4GB RAM (Mínimo).
      \n• **Transcrição:** Utiliza whisper.cpp localmente em CPU.`
    },
    {
      title: '2. Configuração do Backend Python',
      icon: Terminal,
      isCode: true,
      code: `pip install fastapi uvicorn sqlalchemy psycopg2-binary
# Rodar servidor
uvicorn main:app --reload --port 8000`,
      content: 'Configuração do backend com suporte a SQLite e PostgreSQL.'
    },
    {
      title: '3. Transcrição Local (whisper.cpp)',
      icon: Mic,
      content: `Para transcrição offline com custo zero:
      \n1. Compile o whisper.cpp no servidor.
      \n2. Baixe o modelo 'small' ou 'base'.
      \n3. O backend invoca o binário via subprocess para processar os áudios do WhatsApp.
      \n• Vantagem: Privacidade total e sem cobrança por minuto.`
    },
    {
      title: '4. Módulo NLP (Heurísticas Locais)',
      icon: Code,
      content: `O sistema não utiliza APIs pagas (OpenAI/Gemini).
      \n• A extração é feita via 'nlp.py' no backend.
      \n• Suporta formatos de moeda brasileira e limpeza de texto natural.
      \n• Facilmente expansível com novas regras no arquivo nlp.py.`
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
            <Book className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">OpenSource Flow v2.0</h2>
            <p className="text-slate-500 font-medium">Auto-Hospedado | NLP Local | Whisper.cpp</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
            </div>
            
            {section.isCode ? (
              <div className="relative mt-4">
                <pre className="bg-slate-900 text-blue-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  {section.code}
                </pre>
              </div>
            ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                {section.content}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
                 <Lock className="w-6 h-6" />
                 Segurança & Produção
               </h3>
               <ul className="space-y-4 text-slate-300 text-sm">
                  <li>• Use **Nginx** como Proxy Reverso.</li>
                  <li>• Configure o **PostgreSQL** para alta disponibilidade.</li>
                  <li>• Não são necessárias chaves de API externas.</li>
                  <li>• Instale o **Certbot** para SSL.</li>
               </ul>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
               <h4 className="font-bold text-blue-400 mb-4 uppercase text-xs">Variáveis .env (Produção)</h4>
               <div className="space-y-3 font-mono text-xs">
                  <p>DATABASE_URL=<span className="text-slate-400">"postgresql://user:pass@localhost/dbname"</span></p>
                  <p>DEBUG=<span className="text-slate-400">"False"</span></p>
                  <p>PORT=<span className="text-slate-400">"8000"</span></p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Documentation;
