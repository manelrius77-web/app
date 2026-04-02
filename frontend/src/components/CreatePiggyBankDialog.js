import React, { useState } from 'react';
import axios from 'axios';
import { PiggyBank } from '@phosphor-icons/react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const colors = [
  { name: 'Menta', value: 'mint', class: 'bg-[#A8E6CF]' },
  { name: 'Lavanda', value: 'lavender', class: 'bg-[#DCD3FF]' },
  { name: 'Melocotón', value: 'peach', class: 'bg-[#FFD3B6]' },
  { name: 'Coral', value: 'coral', class: 'bg-[#FF9B9B]' },
  { name: 'Amarillo', value: 'yellow', class: 'bg-[#FFE8A1]' },
];

const CreatePiggyBankDialog = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('mint');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Por favor, introduce un nombre');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API}/piggy-banks`,
        {
          name: name.trim(),
          color: selectedColor,
          goal: goal ? parseFloat(goal) : null,
        },
        { withCredentials: true }
      );
      toast.success('¡Hucha creada!');
      onSuccess();
    } catch (error) {
      console.error('Error creating piggy bank:', error);
      toast.error('Error al crear la hucha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="create-piggy-bank-dialog">
      <div className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A1A]">
            Nueva Hucha
          </h3>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] hover:bg-[#FDFBF7] p-2 rounded-lg transition-colors"
            data-testid="close-dialog-button"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Nombre de la Hucha
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neo-input"
              placeholder="Ej: Vacaciones, Coche nuevo..."
              required
              data-testid="piggy-bank-name-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`${color.class} border-2 ${selectedColor === color.value ? 'border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]' : 'border-[#1A1A1A]'} rounded-xl h-16 transition-all hover:shadow-[3px_3px_0px_#1A1A1A]`}
                  data-testid={`color-${color.value}`}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <PiggyBank size={24} weight="duotone" className="mx-auto text-[#1A1A1A]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Meta de Ahorro (Opcional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1A1A1A] font-bold">
                €
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="neo-input pl-9"
                placeholder="0.00"
                data-testid="goal-input"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="neo-button neo-button-secondary flex-1"
              disabled={loading}
              data-testid="cancel-button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="neo-button flex-1"
              disabled={loading}
              data-testid="create-button"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePiggyBankDialog;
