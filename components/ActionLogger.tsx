import React, { useState } from 'react';
import { AVAILABLE_ACTIONS } from '../constants';
import { EcoAction } from '../types';
import { CheckCircle, Plus } from 'lucide-react';

interface ActionLoggerProps {
  onLogAction: (action: EcoAction) => void;
}

const ActionLogger: React.FC<ActionLoggerProps> = ({ onLogAction }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    const action = AVAILABLE_ACTIONS.find(a => a.id === selectedId);
    if (action) {
      setIsAnimating(true);
      setTimeout(() => {
        onLogAction(action);
        setSelectedId(null);
        setIsAnimating(false);
      }, 800);
    }
  };

  if (isAnimating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-pulse">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Action Logged!</h2>
        <p className="text-slate-500 mt-2">Saving the planet, one step at a time.</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Log Action</h2>
      <p className="text-slate-500 mb-6">What did you do for the planet today?</p>

      <div className="grid grid-cols-2 gap-4">
        {AVAILABLE_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handleSelect(action.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 text-center ${
              selectedId === action.id
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md transform scale-105'
                : 'border-white bg-white hover:border-slate-200 shadow-sm text-slate-700'
            }`}
          >
            <span className="text-4xl">{action.icon}</span>
            <div>
              <p className="font-semibold text-sm">{action.name}</p>
              <p className="text-xs text-slate-400 mt-1">{action.baseCarbonSaving}kg CO₂e</p>
            </div>
          </button>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 w-full px-4 z-10 max-w-md mx-auto right-0">
        <button
          onClick={handleSubmit}
          disabled={!selectedId}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
            selectedId
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-xl'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus size={24} /> Log Impact
        </button>
      </div>
    </div>
  );
};

export default ActionLogger;