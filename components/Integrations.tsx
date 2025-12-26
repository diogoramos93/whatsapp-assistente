
import React, { useState } from 'react';
import { Smartphone, Shield, Globe, ExternalLink, Save, CheckCircle2 } from 'lucide-react';
import { dbService } from '../services/dbService';

const Integrations: React.FC = () => {
  const [config, setConfig] = useState(dbService.getConfig());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dbService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Integrações</h2>
        <p className="text-slate-500">Configure a conexão com o WhatsApp através da Evolution API.</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm divide-y">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-blue-600" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Evolution API</h3>
                  <p className="text-sm text-slate-500">Integração oficial via Webhook</p>
               </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Desconectado</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4" /> API Base URL
              </label>
              <input 
                type="text" 
                placeholder="https://api.evolution.com"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                value={config.baseUrl}
                onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Global Token
              </label>
              <input 
                type="password" 
                placeholder="Seu Token Secreto"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                value={config.token}
                onChange={(e) => setConfig({...config, token: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nome da Instância</label>
              <input 
                type="text" 
                placeholder="Ex: MainInstance"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                value={config.instanceName}
                onChange={(e) => setConfig({...config, instanceName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Webhook URL (Onde receber dados)</label>
              <div className="relative">
                 <input 
                  type="text" 
                  readOnly
                  value="https://api.seusistema.com/webhook/message"
                  className="w-full pl-4 pr-10 py-2.5 border rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                />
                <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="text-xs text-slate-400">
               Certifique-se de configurar o Webhook na Evolution para apontar para seu backend.
            </div>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Configurações Salvas
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-8 bg-slate-50">
           <h4 className="font-bold text-slate-900 mb-4">Como conectar?</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border text-sm">
                 <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-2">1</span>
                 <p className="text-slate-600">Hospede a Evolution API em seu servidor ou use a versão Cloud.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border text-sm">
                 <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-2">2</span>
                 <p className="text-slate-600">Crie uma instância e configure o Webhook para o endpoint do sistema.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border text-sm">
                 <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-2">3</span>
                 <p className="text-slate-600">Envie mensagens de gasto para o número conectado para testar.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
