
import React, { useState } from 'react';
import { CreditCard, Lock, User, AlertCircle } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      onLogin();
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-6 text-white">
            <CreditCard className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ExpenseFlow</h1>
          <p className="text-slate-500 mt-2 font-medium">Painel Administrativo do Assistente</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-white">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-600 text-sm font-bold bg-rose-50 p-4 rounded-xl border border-rose-100">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition-all active:scale-[0.98]"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-xs text-slate-400 font-medium">
               Acesso restrito para administradores do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
