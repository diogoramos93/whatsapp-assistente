
import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Activity,
  // Add missing ReceiptText icon import
  ReceiptText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { dbService } from '../services/dbService';

const Dashboard: React.FC = () => {
  const expenses = dbService.getExpenses();

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let totalToday = 0;
    let totalMonth = 0;
    let totalGeneral = 0;
    
    const dailyMap: Record<string, number> = {};

    expenses.forEach(exp => {
      const expDate = new Date(exp.message_timestamp);
      const dateStr = expDate.toISOString().split('T')[0];
      
      totalGeneral += exp.amount;
      
      if (dateStr === today) {
        totalToday += exp.amount;
      }
      
      if (expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear) {
        totalMonth += exp.amount;
      }

      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + exp.amount;
    });

    // Generate last 7 days for the chart
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      dailyData.push({
        date: ds.split('-').reverse().slice(0, 2).reverse().join('/'),
        amount: dailyMap[ds] || 0
      });
    }

    return { totalToday, totalMonth, totalGeneral, dailyData };
  }, [expenses]);

  const cards = [
    { 
      label: 'Gasto Hoje', 
      value: stats.totalToday, 
      icon: Clock, 
      color: 'bg-blue-500', 
      trend: '+12%', 
      isUp: true 
    },
    { 
      label: 'Gasto no Mês', 
      value: stats.totalMonth, 
      icon: Calendar, 
      color: 'bg-indigo-500', 
      trend: '-5%', 
      isUp: false 
    },
    { 
      label: 'Total Acumulado', 
      value: stats.totalGeneral, 
      icon: Wallet, 
      color: 'bg-emerald-500', 
      trend: '+8%', 
      isUp: true 
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
          <p className="text-slate-500">Métricas financeiras do seu assistente WhatsApp.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border px-4 py-2 rounded-lg shadow-sm">
           <Calendar className="w-4 h-4" />
           {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm flex items-start justify-between">
            <div>
              <p className="text-slate-500 font-medium mb-1">{card.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {card.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                {card.isUp ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-rose-500" />
                )}
                <span className={`text-xs font-bold ${card.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {card.trend} desde ontem
                </span>
              </div>
            </div>
            <div className={`${card.color} p-3 rounded-xl text-white`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Evolução dos Gastos</h3>
              <p className="text-sm text-slate-500">Fluxo financeiro dos últimos 7 dias</p>
            </div>
            <Activity className="w-5 h-5 text-slate-300" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Gasto']}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Últimas Atividades</h3>
          <div className="space-y-6">
            {expenses.slice(-5).reverse().map((exp) => (
              <div key={exp.id} className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${exp.source === 'audio' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {exp.source === 'audio' ? <Activity className="w-4 h-4" /> : <ReceiptText className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate capitalize">{exp.description}</p>
                  <p className="text-xs text-slate-500">{new Date(exp.message_timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {exp.phone_number}</p>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {exp.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm">Nenhum gasto registrado.</p>
              </div>
            )}
          </div>
          {expenses.length > 0 && (
            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
              Ver Histórico Completo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;