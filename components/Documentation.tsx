
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
      content: `Para um ambiente estável e performático, recomendamos:
      \n• **S.O.:** Ubuntu 22.04 LTS (Jammy Jellyfish) - Versão x64.
      \n• **Hardware Mínimo:** 2 vCPU, 4GB RAM, 40GB SSD (para aguentar o processamento de áudio local).
      \n• **Hardware Recomendado:** 4 vCPU, 8GB RAM (se for rodar o modelo Whisper localmente).`
    },
    {
      title: '2. Preparação do Sistema',
      icon: Terminal,
      isCode: true,
      code: `sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib curl
# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs`,
      content: 'Comandos iniciais para preparar o servidor Ubuntu.'
    },
    {
      title: '3. Backend (FastAPI + Production)',
      icon: Code,
      content: `No ambiente de produção, não usamos o servidor de desenvolvimento.
      \n• **Servidor WSGI:** Gunicorn com workers Uvicorn.
      \n• **Comando de Início:** \`gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app\`
      \n• **Database:** Migrar de SQLite para PostgreSQL no arquivo de conexão SQLAlchemy.`
    },
    {
      title: '4. Frontend (Build & Nginx)',
      icon: Globe,
      content: `O React deve ser compilado e servido como arquivos estáticos.
      \n1. Rode \`npm run build\` na sua máquina local ou CI/CD.
      \n2. Mova a pasta \`dist/\` para \`/var/www/expenseflow\`.
      \n3. Configure o Nginx para apontar o \`index.html\` para todas as rotas (SPA).`
    }
  ];

  const nginxConfig = `server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        root /var/www/expenseflow/dist;
        try_files $uri $uri/ /index.html;
    }

    location /webhook {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg shadow-slate-200">
            <Book className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manual de Produção</h2>
            <p className="text-slate-500 font-medium">Guia definitivo de instalação e deploy v1.0</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-sm font-bold text-slate-700">Versão Estável: Ubuntu 22.04 LTS</span>
        </div>
      </div>

      {/* Grid de Seções */}
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
                <button 
                  onClick={() => copyToClipboard(section.code || '', `code-${i}`)}
                  className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded-lg text-slate-400"
                >
                  {copied === `code-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                {section.content}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bloco Nginx Extra-Detalhado */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Layers className="w-6 h-6 text-indigo-500" />
             <h3 className="text-xl font-bold text-slate-900">Configuração do Servidor Web (Nginx)</h3>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-500">/etc/nginx/sites-available/default</span>
        </div>
        <div className="p-8 bg-slate-50">
          <div className="relative">
            <pre className="bg-white p-6 rounded-2xl border font-mono text-sm text-slate-700 shadow-inner overflow-x-auto">
              {nginxConfig}
            </pre>
            <button 
              onClick={() => copyToClipboard(nginxConfig, 'nginx')}
              className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 border rounded-xl shadow-sm text-slate-400"
            >
              {copied === 'nginx' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="mt-6 flex items-start gap-3 text-sm text-slate-500 italic">
            <Zap className="w-5 h-5 text-amber-500 shrink-0" />
            <p>Dica: Após configurar o Nginx, use o comando <code className="bg-slate-200 px-1 rounded">sudo certbot --nginx</code> para instalar o certificado SSL gratuito da Let's Encrypt.</p>
          </div>
        </div>
      </div>

      {/* Security CheckList */}
      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                 <Lock className="w-6 h-6 text-emerald-400" />
                 Checklist de Segurança
               </h3>
               <ul className="space-y-4">
                  {[
                    'Desabilitar login de ROOT via SSH.',
                    'Configurar Firewall (UFW) permitindo apenas 80, 443 e 22.',
                    'Usar Secrets para API_KEY do Gemini.',
                    'Configurar Backup automático do banco PostgreSQL.',
                    'Implementar Rate Limiting no Nginx para evitar ataques DOS.'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                       <ChevronRight className="w-4 h-4 text-blue-400" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
               <h4 className="font-bold text-blue-400 mb-4 uppercase tracking-widest text-xs">Variavéis de Ambiente (.env)</h4>
               <div className="space-y-3 font-mono text-xs">
                  <p className="text-emerald-400">DATABASE_URL=<span className="text-slate-400">"postgresql://user:pass@localhost/dbname"</span></p>
                  <p className="text-emerald-400">API_KEY=<span className="text-slate-400">"sua-chave-gemini"</span></p>
                  <p className="text-emerald-400">EVOLUTION_TOKEN=<span className="text-slate-400">"token-da-sua-api"</span></p>
                  <p className="text-emerald-400">ADMIN_PASSWORD=<span className="text-slate-400">"troque-esta-senha"</span></p>
               </div>
            </div>
         </div>
         <ShieldCheck className="absolute -right-10 -bottom-10 w-80 h-80 text-white/[0.03]" />
      </div>
    </div>
  );
};

export default Documentation;
