import React, { useState } from 'react';
import { X, DollarSign, Calendar, Check, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SavingsDepositModal = ({
  isOpen,
  onClose,
  onSave,
  goal,
  settings
}) => {
  const p1 = settings?.p1Name || 'Orang 1';
  const p2 = settings?.p2Name || 'Orang 2';

  const [formData, setFormData] = useState({
    saver: 'p1',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Nominal setoran tabungan wajib diisi!');
      return;
    }

    onSave(goal.id, {
      ...formData,
      amount: Number(formData.amount)
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Setor Tabungan Bersama
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[220px]">
                Target: {goal.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nominal Setoran (Rp) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
              <input
                type="number"
                required
                placeholder="500000"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Saver */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Siapa yang Menabung?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, saver: 'p1' })}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  formData.saver === 'p1'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p1}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, saver: 'p2' })}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  formData.saver === 'p2'
                    ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm ring-2 ring-teal-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p2}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, saver: 'both' })}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  formData.saver === 'both'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Keduanya (50:50)
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tanggal Setoran
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium text-xs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan Setoran
            </label>
            <input
              type="text"
              placeholder="Misal: Tabungan gaji bulan ini..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-medium"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Catat Tabungan
          </button>
        </div>
      </div>
    </div>
  );
};
