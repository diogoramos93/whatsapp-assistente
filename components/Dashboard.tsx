
import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Activity,
  ReceiptText
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { dbService } from '../services/dbService';
import { Expense } from '../types';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    dbService.getExpenses().then(setExpenses);
  }, []);

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
    { label: 'Gasto Hoje', value: stats.totalToday, icon: Clock, color: 'bg-blue-500' },
    { label: 'Gasto no Mês', value: stats.totalMonth, icon: Calendar, color: 'bg-indigo-500' },
    { label: 'Total Geral', value: stats.totalGeneral, icon: Wallet, color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
          <p className="text-slate-500">Métricas financeiras processadas localmente.</p>
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
            </div>
            <div className={`${card.color} p-3 rounded-xl text-white`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm h-96">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#3b82f620" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm overflow-hidden">
          <h3 className="font-bold text-lg mb-4">Últimas Atividades</h3>
          <div className="space-y-4">
            {expenses.slice(0, 5).map(exp => (
              <div key={exp.id} className="flex items-center justify-between border-b pb-2">
                <div className="text-sm font-medium">{exp.description}</div>
                <div className="font-bold">{exp.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
