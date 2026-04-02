import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash,
  PiggyBank as PiggyBankIcon,
  Coins,
  ClockCounterClockwise,
} from '@phosphor-icons/react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const colorClasses = {
  mint: 'bg-[#A8E6CF]',
  lavender: 'bg-[#DCD3FF]',
  peach: 'bg-[#FFD3B6]',
  coral: 'bg-[#FF9B9B]',
  yellow: 'bg-[#FFE8A1]',
};

const PiggyBankDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [piggyBank, setPiggyBank] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const fetchData = async () => {
    try {
      const [pbResponse, txResponse] = await Promise.all([
        axios.get(`${API}/piggy-banks`, { withCredentials: true }),
        axios.get(`${API}/transactions/${id}`, { withCredentials: true }),
      ]);
      const pb = pbResponse.data.find((p) => p.id === id);
      if (!pb) {
        toast.error('Hucha no encontrada');
        navigate('/dashboard');
        return;
      }
      setPiggyBank(pb);
      setTransactions(txResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta hucha? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await axios.delete(`${API}/piggy-banks/${id}`, { withCredentials: true });
      toast.success('Hucha eliminada');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting piggy bank:', error);
      toast.error('Error al eliminar la hucha');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBF7]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-[#FDFBF7] border-b-4 border-[#1A1A1A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="neo-button flex items-center space-x-2"
              data-testid="back-button"
            >
              <ArrowLeft size={20} weight="bold" />
              <span>Volver</span>
            </button>
            <button
              onClick={handleDelete}
              className="neo-button neo-button-danger flex items-center space-x-2"
              data-testid="delete-piggy-bank-button"
            >
              <Trash size={20} weight="bold" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Piggy Bank Card */}
        <div className={`neo-card ${colorClasses[piggyBank.color]} p-8 mb-8`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1A1A1A] mb-4">
                {piggyBank.name}
              </h2>
              <div className="flex items-center space-x-3">
                <Coins size={40} weight="duotone" className="text-[#1A1A1A]" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Saldo Actual</p>
                  <p className="text-5xl font-black text-[#1A1A1A]" data-testid="piggy-bank-balance">
                    €{piggyBank.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <PiggyBankIcon size={80} weight="duotone" className="text-[#1A1A1A]" />
          </div>

          {piggyBank.goal && (
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                <span>Meta</span>
                <span>€{piggyBank.goal.toFixed(2)}</span>
              </div>
              <div className="w-full bg-white border-2 border-[#1A1A1A] rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-[#1A1A1A] transition-all"
                  style={{ width: `${Math.min((piggyBank.balance / piggyBank.goal) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-[#1A1A1A] mt-2">
                {((piggyBank.balance / piggyBank.goal) * 100).toFixed(0)}% completado - Faltan €
                {Math.max(piggyBank.goal - piggyBank.balance, 0).toFixed(2)}
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddDialog(true)}
              className="neo-button flex items-center space-x-2 flex-1"
              data-testid="add-money-button"
            >
              <Plus size={20} weight="bold" />
              <span>Añadir Dinero</span>
            </button>
            <button
              onClick={() => setShowWithdrawDialog(true)}
              className="neo-button neo-button-secondary flex items-center space-x-2 flex-1"
              data-testid="withdraw-money-button"
              disabled={piggyBank.balance === 0}
            >
              <Minus size={20} weight="bold" />
              <span>Retirar Dinero</span>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border-4 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ClockCounterClockwise size={32} weight="duotone" className="text-[#1A1A1A]" />
            <h3 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              Historial de Movimientos
            </h3>
          </div>

          {transactions.length === 0 ? (
            <p className="text-center text-[#1A1A1A] font-medium py-8">No hay movimientos aún</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-[#FDFBF7] border-2 border-[#1A1A1A] rounded-xl"
                  data-testid={`transaction-${tx.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 flex items-center justify-center border-2 border-[#1A1A1A] rounded-lg ${
                        tx.type === 'deposit' ? 'bg-[#A8E6CF]' : 'bg-[#FFD3B6]'
                      }`}
                    >
                      {tx.type === 'deposit' ? (
                        <Plus size={24} weight="bold" className="text-[#1A1A1A]" />
                      ) : (
                        <Minus size={24} weight="bold" className="text-[#1A1A1A]" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A1A]">
                        {tx.type === 'deposit' ? 'Depósito' : 'Retirada'}
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
                      {tx.description && (
                        <p className="text-sm text-[#1A1A1A] mt-1">{tx.description}</p>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-xl font-black ${tx.type === 'deposit' ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'}€{tx.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Money Dialog */}
      {showAddDialog && (
        <TransactionDialog
          type="deposit"
          piggyBankId={id}
          onClose={() => setShowAddDialog(false)}
          onSuccess={() => {
            setShowAddDialog(false);
            fetchData();
          }}
        />
      )}

      {/* Withdraw Money Dialog */}
      {showWithdrawDialog && (
        <TransactionDialog
          type="withdrawal"
          piggyBankId={id}
          maxAmount={piggyBank.balance}
          onClose={() => setShowWithdrawDialog(false)}
          onSuccess={() => {
            setShowWithdrawDialog(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

const TransactionDialog = ({ type, piggyBankId, maxAmount, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('total'); // 'total' o 'coins'
  
  // Monedas y billetes
  const [coins, setCoins] = useState({
    c1: 0,    // 1 céntimo
    c2: 0,    // 2 céntimos
    c5: 0,    // 5 céntimos
    c10: 0,   // 10 céntimos
    c20: 0,   // 20 céntimos
    c50: 0,   // 50 céntimos
    e1: 0,    // 1 euro
    e2: 0,    // 2 euros
    e5: 0,    // 5 euros
    e10: 0,   // 10 euros
    e20: 0,   // 20 euros
    e50: 0,   // 50 euros
    e100: 0,  // 100 euros
    e200: 0,  // 200 euros
    e500: 0,  // 500 euros
  });

  const coinValues = {
    c1: 0.01,
    c2: 0.02,
    c5: 0.05,
    c10: 0.10,
    c20: 0.20,
    c50: 0.50,
    e1: 1.00,
    e2: 2.00,
    e5: 5.00,
    e10: 10.00,
    e20: 20.00,
    e50: 50.00,
    e100: 100.00,
    e200: 200.00,
    e500: 500.00,
  };

  const coinLabels = {
    c1: '1c',
    c2: '2c',
    c5: '5c',
    c10: '10c',
    c20: '20c',
    c50: '50c',
    e1: '1€',
    e2: '2€',
    e5: '5€',
    e10: '10€',
    e20: '20€',
    e50: '50€',
    e100: '100€',
    e200: '200€',
    e500: '500€',
  };

  const calculateTotal = () => {
    return Object.keys(coins).reduce((total, key) => {
      return total + (coins[key] * coinValues[key]);
    }, 0);
  };

  const handleCoinChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    setCoins(prev => ({ ...prev, [key]: Math.max(0, numValue) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let amountValue;
    if (inputMode === 'total') {
      amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        toast.error('Por favor, introduce una cantidad válida');
        return;
      }
    } else {
      amountValue = calculateTotal();
      if (amountValue <= 0) {
        toast.error('Por favor, introduce al menos una moneda o billete');
        return;
      }
    }

    if (type === 'withdrawal' && amountValue > maxAmount) {
      toast.error('No tienes suficiente saldo');
      return;
    }

    setLoading(true);
    try {
      const coinDetails = inputMode === 'coins' ? 
        Object.keys(coins)
          .filter(key => coins[key] > 0)
          .map(key => `${coins[key]}x ${coinLabels[key]}`)
          .join(', ') : null;
      
      const finalDescription = coinDetails 
        ? (description.trim() ? `${description.trim()} (${coinDetails})` : coinDetails)
        : (description.trim() || null);

      await axios.post(
        `${API}/transactions`,
        {
          piggy_bank_id: piggyBankId,
          type,
          amount: amountValue,
          description: finalDescription,
        },
        { withCredentials: true }
      );
      toast.success(type === 'deposit' ? '¡Dinero añadido!' : '¡Dinero retirado!');
      onSuccess();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(error.response?.data?.detail || 'Error al procesar la transacción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="transaction-dialog">
      <div className={`bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] rounded-xl p-6 w-full ${inputMode === 'coins' ? 'max-w-2xl' : 'max-w-md'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            {type === 'deposit' ? 'Añadir Dinero' : 'Retirar Dinero'}
          </h3>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] hover:bg-[#FDFBF7] p-2 rounded-lg transition-colors"
            data-testid="close-transaction-dialog"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Toggle entre modos */}
          {type === 'deposit' && (
            <div className="flex space-x-1 p-1 bg-[#FDFBF7] border-2 border-[#1A1A1A] rounded-lg">
              <button
                type="button"
                onClick={() => setInputMode('total')}
                className={`flex-1 py-1.5 px-3 rounded-md font-bold text-xs uppercase transition-all ${
                  inputMode === 'total'
                    ? 'bg-[#A8E6CF] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]'
                    : 'bg-transparent text-[#1A1A1A]'
                }`}
                data-testid="mode-total-button"
              >
                Cantidad Total
              </button>
              <button
                type="button"
                onClick={() => setInputMode('coins')}
                className={`flex-1 py-1.5 px-3 rounded-md font-bold text-xs uppercase transition-all ${
                  inputMode === 'coins'
                    ? 'bg-[#A8E6CF] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]'
                    : 'bg-transparent text-[#1A1A1A]'
                }`}
                data-testid="mode-coins-button"
              >
                Monedas/Billetes
              </button>
            </div>
          )}

          {/* Input de cantidad total */}
          {inputMode === 'total' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Cantidad (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={type === 'withdrawal' ? maxAmount : undefined}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="neo-input text-lg font-bold"
                placeholder="0.00"
                required
                data-testid="transaction-amount-input"
              />
              {type === 'withdrawal' && maxAmount !== undefined && (
                <p className="text-xs text-[#1A1A1A] mt-1 font-medium">
                  Saldo disponible: €{maxAmount.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Input de monedas y billetes */}
          {inputMode === 'coins' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Selecciona cantidad
                </label>
                <div className="text-right bg-[#A8E6CF] px-3 py-1.5 border-2 border-[#1A1A1A] rounded-lg shadow-[2px_2px_0px_#1A1A1A]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">Total</p>
                  <p className="text-xl font-black text-[#1A1A1A] leading-none" data-testid="coins-total">
                    €{calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Monedas */}
                <div className="bg-[#FDFBF7] p-3 border-2 border-[#1A1A1A] rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">Monedas</p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {['c1', 'c2', 'c5', 'c10', 'c20', 'c50', 'e1', 'e2'].map((key) => (
                      <div key={key} className="flex flex-col items-center">
                        <label className="text-[10px] font-bold text-[#1A1A1A] mb-1">
                          {coinLabels[key]}
                        </label>
                        <div className="flex flex-col space-y-0.5">
                          <button
                            type="button"
                            onClick={() => handleCoinChange(key, coins[key] + 1)}
                            className="w-9 h-6 bg-[#A8E6CF] border-2 border-[#1A1A1A] rounded text-[#1A1A1A] font-black text-xs hover:bg-[#86D4BA] active:shadow-none shadow-[1px_1px_0px_#1A1A1A]"
                          >
                            +
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={coins[key]}
                            onChange={(e) => handleCoinChange(key, e.target.value)}
                            className="w-9 h-6 text-center text-xs font-bold border-2 border-[#1A1A1A] rounded bg-white focus:outline-none focus:bg-[#FDFBF7]"
                            data-testid={`coin-${key}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleCoinChange(key, coins[key] - 1)}
                            className="w-9 h-6 bg-[#FFD3B6] border-2 border-[#1A1A1A] rounded text-[#1A1A1A] font-black text-xs hover:bg-[#FFC299] active:shadow-none shadow-[1px_1px_0px_#1A1A1A]"
                          >
                            −
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billetes */}
                <div className="bg-[#FDFBF7] p-3 border-2 border-[#1A1A1A] rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">Billetes</p>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['e5', 'e10', 'e20', 'e50', 'e100', 'e200', 'e500'].map((key) => (
                      <div key={key} className="flex flex-col items-center">
                        <label className="text-[10px] font-bold text-[#1A1A1A] mb-1">
                          {coinLabels[key]}
                        </label>
                        <div className="flex flex-col space-y-0.5">
                          <button
                            type="button"
                            onClick={() => handleCoinChange(key, coins[key] + 1)}
                            className="w-11 h-6 bg-[#A8E6CF] border-2 border-[#1A1A1A] rounded text-[#1A1A1A] font-black text-xs hover:bg-[#86D4BA] active:shadow-none shadow-[1px_1px_0px_#1A1A1A]"
                          >
                            +
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={coins[key]}
                            onChange={(e) => handleCoinChange(key, e.target.value)}
                            className="w-11 h-6 text-center text-xs font-bold border-2 border-[#1A1A1A] rounded bg-white focus:outline-none focus:bg-[#FDFBF7]"
                            data-testid={`bill-${key}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleCoinChange(key, coins[key] - 1)}
                            className="w-11 h-6 bg-[#FFD3B6] border-2 border-[#1A1A1A] rounded text-[#1A1A1A] font-black text-xs hover:bg-[#FFC299] active:shadow-none shadow-[1px_1px_0px_#1A1A1A]"
                          >
                            −
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Descripción (Opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="neo-input"
              placeholder="Ej: Ahorro mensual, Regalo..."
              data-testid="transaction-description-input"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="neo-button neo-button-secondary flex-1"
              disabled={loading}
              data-testid="cancel-transaction-button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="neo-button flex-1"
              disabled={loading}
              data-testid="submit-transaction-button"
            >
              {loading ? 'Procesando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PiggyBankDetail;
