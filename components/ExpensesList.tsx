
import React, { useState } from 'react';
// Add missing ReceiptText icon import
import { Search, Filter, Download, Trash2, Smartphone, Mic, FileText, ReceiptText } from 'lucide-react';
import { dbService } from '../services/dbService';
import { Expense } from '../types';

const ExpensesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>(dbService.getExpenses());

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.phone_number.includes(searchTerm)
  ).reverse();

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este registro?')) {
      dbService.deleteExpense(id);
      setExpenses(dbService.getExpenses());
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Histórico de Gastos</h2>
          <p className="text-slate-500">Lista completa de todas as entradas enviadas pelo WhatsApp.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou número..." 
              className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Origem</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {new Date(exp.message_timestamp).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(exp.message_timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <Smartphone className="w-3 h-3 text-slate-400" />
                       <span className="text-sm text-slate-600 font-mono">{exp.phone_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 font-medium capitalize">{exp.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      exp.source === 'audio' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {exp.source === 'audio' ? <Mic className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                      {exp.source === 'audio' ? 'Áudio' : 'Texto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">
                      {exp.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredExpenses.length === 0 && (
            <div className="py-20 text-center">
              <ReceiptText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Nenhum gasto encontrado.</p>
              <p className="text-slate-400 text-sm">Tente mudar o termo de busca ou envie uma mensagem no simulador.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesList;