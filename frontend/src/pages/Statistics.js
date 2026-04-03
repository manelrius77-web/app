import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, TrendUp, PiggyBank, ChartBar, ClockCounterClockwise } from '@phosphor-icons/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const colorMap = {
  mint: '#A8E6CF',
  lavender: '#DCD3FF',
  peach: '#FFD3B6',
  coral: '#FF9B9B',
  yellow: '#FFE8A1',
};

const Statistics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await axios.get(`${API}/statistics`, { withCredentials: true });
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast.error('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBF7]">
        <div className="spinner"></div>
      </div>
    );
  }

  const pieData = stats.piggy_banks_summary.map((pb) => ({
    name: pb.name,
    value: pb.balance,
    color: colorMap[pb.color],
  }));

  const barData = stats.piggy_banks_summary.map((pb) => ({
    name: pb.name,
    saldo: pb.balance,
    meta: pb.goal || 0,
    color: colorMap[pb.color],
  }));

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-[#FDFBF7] border-b-4 border-[#1A1A1A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="neo-button flex items-center space-x-2"
            data-testid="back-to-dashboard-button"
          >
            <ArrowLeft size={20} weight="bold" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <ChartBar size={48} weight="duotone" className="text-[#1A1A1A]" />
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            Estadísticas
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="neo-card bg-[#A8E6CF] p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendUp size={32} weight="duotone" className="text-[#1A1A1A]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Total Ahorrado</p>
            </div>
            <p className="text-4xl font-black text-[#1A1A1A]" data-testid="stats-total-savings">
              €{stats.total_savings.toFixed(2)}
            </p>
          </div>

          <div className="neo-card bg-[#DCD3FF] p-6">
            <div className="flex items-center space-x-3 mb-2">
              <PiggyBank size={32} weight="duotone" className="text-[#1A1A1A]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Huchas Activas</p>
            </div>
            <p className="text-4xl font-black text-[#1A1A1A]" data-testid="stats-total-piggy-banks">
              {stats.total_piggy_banks}
            </p>
          </div>

          <div className="neo-card bg-[#FFD3B6] p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ClockCounterClockwise size={32} weight="duotone" className="text-[#1A1A1A]" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Transacciones</p>
            </div>
            <p className="text-4xl font-black text-[#1A1A1A]" data-testid="stats-total-transactions">
              {stats.total_transactions}
            </p>
          </div>
        </div>

        {stats.piggy_banks_summary.length > 0 && (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Bar Chart */}
              <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] rounded-xl p-6">
                <h3 className="text-xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-6">
                  Saldo vs Meta
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#1A1A1A" strokeWidth={2} />
                    <YAxis stroke="#1A1A1A" strokeWidth={2} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #1A1A1A',
                        borderRadius: '8px',
                        fontFamily: 'Work Sans',
                      }}
                    />
                    <Bar dataKey="saldo" fill="#A8E6CF" stroke="#1A1A1A" strokeWidth={2} />
                    <Bar dataKey="meta" fill="#FFD3B6" stroke="#1A1A1A" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] rounded-xl p-6">
                <h3 className="text-xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-6">
                  Distribución de Ahorros
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `€${entry.value.toFixed(2)}`}
                      outerRadius={100}
                      dataKey="value"
                      stroke="#1A1A1A"
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #1A1A1A',
                        borderRadius: '8px',
                        fontFamily: 'Work Sans',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontFamily: 'Work Sans', fontWeight: 500 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Separador visual */}
        <div className="border-t-4 border-[#1A1A1A] my-8"></div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-4">
            Actividad Reciente
          </h2>
          <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] rounded-xl p-6">
            <h3 className="text-xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-6">
              Últimas Transacciones
            </h3>

            {stats.recent_transactions.length === 0 ? (
              <p className="text-center text-[#1A1A1A] font-medium py-8">No hay transacciones aún</p>
            ) : (
              <div className="space-y-3">
                {stats.recent_transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-[#FDFBF7] border-2 border-[#1A1A1A] rounded-xl"
                    data-testid={`recent-transaction-${tx.id}`}
                  >
                    <div>
                      <p className="font-bold text-[#1A1A1A]">
                        {tx.piggy_bank_name} - {tx.type === 'deposit' ? 'Depósito' : 'Retirada'}
                      </p>
                      <p className="text-sm text-[#1A1A1A]">
                        {new Date(tx.timestamp).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {tx.description && <p className="text-sm text-[#1A1A1A] mt-1">{tx.description}</p>}
                    </div>
                    <p
                      className={`text-xl font-black text-[#1A1A1A]`}
                    >
                      {tx.type === 'deposit' ? '+' : '-'}€{tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
