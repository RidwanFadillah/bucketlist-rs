import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Tag, Check, Sparkles } from 'lucide-react';

const SAVINGS_CATEGORIES = [
  'Liburan & Trip',
  'Tiket Pesawat & Kereta',
  'Hotel & Villa',
  'Dana Darurat Perjalanan',
  'Belanja & Kuliner',
  'Impian Lainnya'
];

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#0EA5E9', // Sky
  '#6366F1', // Indigo
  '#EC4899', // Rose
  '#F59E0B', // Amber
  '#8B5CF6'  // Purple
];

export const SavingsGoalModal = ({
  isOpen,
  onClose,
  onSave,
  editingGoal,
  bucketlist = []
}) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    targetDate: '',
    category: 'Liburan & Trip',
    bucketlistId: '',
    color: '#10B981',
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || '',
        targetAmount: editingGoal.targetAmount || '',
        targetDate: editingGoal.targetDate || '',
        category: editingGoal.category || 'Liburan & Trip',
        bucketlistId: editingGoal.bucketlistId || '',
        color: editingGoal.color || '#10B981',
        notes: editingGoal.notes || ''
      });
    } else {
      setFormData({
        title: '',
        targetAmount: '',
        targetDate: '',
        category: 'Liburan & Trip',
        bucketlistId: '',
        color: '#10B981',
        notes: ''
      });
    }
    setError('');
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.targetAmount) {
      setError('Judul target tabungan dan nominal target wajib diisi!');
      return;
    }

    onSave({
      ...formData,
      targetAmount: Number(formData.targetAmount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                {editingGoal ? 'Edit Target Tabungan' : 'Buat Target Tabungan Bersama'}
              </h2>
              <p className="text-xs text-slate-500">Tentukan target dana perjalanan berdua</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama / Judul Tabungan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Tabungan Liburan Labuan Bajo 2026"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-xs sm:text-sm"
            />
          </div>

          {/* Target Amount & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Dana (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  required
                  placeholder="10000000"
                  value={formData.targetAmount}
                  onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-800 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Tanggal Tercapai
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium text-xs"
              />
            </div>
          </div>

          {/* Category & Destination Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Tabungan
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium bg-white text-xs"
              >
                {SAVINGS_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hubungkan ke Destinasi Bucketlist
              </label>
              <select
                value={formData.bucketlistId}
                onChange={e => setFormData({ ...formData, bucketlistId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium bg-white text-xs truncate"
              >
                <option value="">-- Tabungan Bebas / Umum --</option>
                {bucketlist.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color theme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Warna Tema
            </label>
            <div className="flex items-center gap-2 pt-1">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    formData.color === c ? 'scale-125 ring-2 ring-slate-800 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan / Motivasi Menabung
            </label>
            <textarea
              rows={2}
              placeholder="Misal: Sisihkan Rp 500rb per orang tiap tanggal gajian..."
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
            Simpan Target
          </button>
        </div>
      </div>
    </div>
  );
};
