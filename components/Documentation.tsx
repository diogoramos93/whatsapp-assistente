
import React from 'react';
import { Book, Code, Globe, Zap, Database, Mic, ShieldCheck, Terminal } from 'lucide-react';

const Documentation: React.FC = () => {
  const sections = [
    {
      title: 'Acesso Rápido',
      icon: ShieldCheck,
      content: `O acesso ao painel é protegido por um middleware simples. As credenciais padrão são:
      \n• **Usuário:** admin
      \n• **Senha:** password123
      \n(Alteráveis em src/constants.ts)`
    },
    {
      title: 'Arquitetura do Backend',
      icon: Terminal,
      content: `O sistema foi projetado para rodar com FastAPI (Python). 
      \n• **Processamento:** O endpoint /webhook/message recebe o JSON da Evolution API.
      \n• **NLP:** Utiliza Google Gemini para extração de entidades (Valor, Descrição).
      \n• **Persistência:** Atualmente simula LocalStorage, mas a estrutura de dados está pronta para SQLAlchemy/PostgreSQL.`
    },
    {
      title: 'Integração Evolution API',
      icon: Globe,
      content: `1. No painel da Evolution, vá em Webhooks.
      \n2. Configure a URL para: https://seu-backend.com/webhook/message.
      \n3. Habilite os eventos "MESSAGES_UPSERT".
      \n4. O sistema processará automaticamente mensagens de texto e áudio.`
    },
    {
      title: 'Transcrição (Whisper)',
      icon: Mic,
      content: `Para ativar transcrição real:
      \n1. No backend Python, instale 'openai-whisper'.
      \n2. No arquivo de serviço de NLP, substitua a função mock 'transcribeAudio' pela chamada ao modelo Whisper.
      \n3. Recomendado usar o modelo 'base' ou 'small' para balancear velocidade e precisão.`
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <div className="bg-slate-900 text-white p-3 rounded-2xl">
          <Book className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Documentação Completa</h2>
          <p className="text-slate-500 font-medium">Guia técnico para desenvolvedores e administradores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <section.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Configuração de Produção
          </h3>
          <div className="space-y-4 text-slate-300 text-sm">
            <p>Para escalar este sistema:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Mude o storage de <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">localStorage</code> para uma API REST real.</li>
              <li>Utilize **Docker** para containerizar o FastAPI e o Frontend.</li>
              <li>Configure um banco **PostgreSQL** e use Migrations (Alembic).</li>
              <li>Adicione **Redis** para fila de processamento de áudios pesados.</li>
            </ol>
          </div>
        </div>
        <Zap className="absolute -right-8 -bottom-8 w-64 h-64 text-slate-800 opacity-50" />
      </div>
    </div>
  );
};

export default Documentation;
