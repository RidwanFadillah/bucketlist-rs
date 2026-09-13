import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, CreditCard, Users, Check, FileText } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Transportasi & Tiket',
  'Penginapan & Hotel',
  'Kuliner & Makan',
  'Hiburan & Wisata',
  'Belanja & Oleh-oleh',
  'Darurat & Lainnya'
];

export const ExpenseModal = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  bucketlist = [],
  settings
}) => {
  const p1 = settings?.p1Name || 'Orang 1';
  const p2 = settings?.p2Name || 'Orang 2';

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Kuliner & Makan',
    bucketlistId: '',
    paidBy: 'p1',
    splitType: '50-50',
    splitP1: '',
    splitP2: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || 'Kuliner & Makan',
        bucketlistId: editingExpense.bucketlistId || '',
        paidBy: editingExpense.paidBy || 'p1',
        splitType: editingExpense.splitType || '50-50',
        splitP1: editingExpense.splitP1 || '',
        splitP2: editingExpense.splitP2 || '',
        date: editingExpense.date || new Date().toISOString().split('T')[0],
        notes: editingExpense.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Kuliner & Makan',
        bucketlistId: '',
        paidBy: 'p1',
        splitType: '50-50',
        splitP1: '',
        splitP2: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setError('');
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  const handleAmountChange = (val) => {
    const num = Number(val) || 0;
    setFormData(prev => ({
      ...prev,
      amount: val,
      splitP1: prev.splitType === 'custom' ? (prev.splitP1 || Math.round(num / 2)) : '',
      splitP2: prev.splitType === 'custom' ? (prev.splitP2 || Math.round(num / 2)) : ''
    }));
  };

  const handleSplitP1Change = (val) => {
    const numP1 = Number(val) || 0;
    const total = Number(formData.amount) || 0;
    setFormData(prev => ({
      ...prev,
      splitP1: val,
      splitP2: Math.max(0, total - numP1)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount) {
      setError('Judul dan nominal pengeluaran wajib diisi!');
      return;
    }

    const total = Number(formData.amount) || 0;
    let splitP1 = 0;
    let splitP2 = 0;

    if (formData.splitType === '50-50') {
      splitP1 = total / 2;
      splitP2 = total / 2;
    } else if (formData.splitType === '100-p1') {
      splitP1 = total;
      splitP2 = 0;
    } else if (formData.splitType === '100-p2') {
      splitP1 = 0;
      splitP2 = total;
    } else if (formData.splitType === 'custom') {
      splitP1 = Number(formData.splitP1) || 0;
      splitP2 = Number(formData.splitP2) || (total - splitP1);
    }

    onSave({
      ...formData,
      amount: total,
      splitP1,
      splitP2
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-600/20">
              Rp
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingExpense ? 'Edit Catatan Pengeluaran' : 'Catat Pengeluaran Baru'}
              </h2>
              <p className="text-xs text-slate-500">Bagi pengeluaran secara adil & transparan</p>
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

          {/* Title & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Keterangan / Judul *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Tiket Masuk Tempat Wisata"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nominal (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                <input
                  type="number"
                  required
                  placeholder="250000"
                  value={formData.amount}
                  onChange={e => handleAmountChange(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Category & Destination Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Pengeluaran
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium bg-white text-xs"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Terkait Destinasi Bucketlist
              </label>
              <select
                value={formData.bucketlistId}
                onChange={e => setFormData({ ...formData, bucketlistId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium bg-white text-xs truncate"
              >
                <option value="">-- Pengeluaran Umum / Tidak Terkait --</option>
                {bucketlist.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Payer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Siapa yang Membayar di Depan?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paidBy: 'p1' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.paidBy === 'p1'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p1}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paidBy: 'p2' })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    formData.paidBy === 'p2'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p2}
                </button>
              </div>
            </div>
          </div>

          {/* Split Bill Rules */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Aturan Pembagian Biaya (Split Bill)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
              {[
                { id: '50-50', label: 'Bagi Rata (50:50)' },
                { id: '100-p1', label: `100% ${p1}` },
                { id: '100-p2', label: `100% ${p2}` },
                { id: 'custom', label: 'Kustom Nominal' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, splitType: st.id })}
                  className={`py-2 px-2 rounded-xl border text-center transition-all ${
                    formData.splitType === st.id
                      ? 'border-indigo-600 bg-white text-indigo-700 shadow-sm font-bold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {formData.splitType === 'custom' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Beban {p1} (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.splitP1}
                    onChange={e => handleSplitP1Change(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Beban {p2} (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.splitP2}
                    onChange={e => setFormData({ ...formData, splitP2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan Tambahan
            </label>
            <textarea
              rows={2}
              placeholder="Misal: Nomor invoice, link promo, atau detail transaksi..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium"
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
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Simpan Pengeluaran
          </button>
        </div>
      </div>
    </div>
  );
};
