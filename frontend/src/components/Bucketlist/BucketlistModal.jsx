import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, MapPin, Calendar, Sparkles, Check } from 'lucide-react';

const CATEGORIES = [
  'Nonton Film & Date 🎬',
  'Pantai & Laut 🏖️',
  'Gunung & Alam 🌲',
  'Kota & Budaya 🏛️',
  'Kuliner & Jajan 🍜',
  'Staycation & Relaksasi 🏨',
  'Internasional & Luar Negeri ✈️'
];

export const BucketlistModal = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: 'Nonton Film & Date 🎬',
    status: 'wishlist',
    targetDate: '',
    estimatedBudget: '',
    rating: 5,
    notes: '',
    checklist: []
  });

  const [newChecklistText, setNewChecklistText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        location: editingItem.location || '',
        category: editingItem.category || 'Nonton Film & Date 🎬',
        status: editingItem.status || 'wishlist',
        targetDate: editingItem.targetDate || '',
        estimatedBudget: editingItem.estimatedBudget || '',
        rating: editingItem.rating || 5,
        notes: editingItem.notes || '',
        checklist: editingItem.checklist || []
      });
    } else {
      setFormData({
        title: '',
        location: '',
        category: 'Nonton Film & Date 🎬',
        status: 'wishlist',
        targetDate: '',
        estimatedBudget: '',
        rating: 5,
        notes: '',
        checklist: []
      });
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleAddChecklist = (e) => {
    e?.preventDefault();
    if (!newChecklistText.trim()) return;
    setFormData(prev => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: `c-${Date.now()}`, text: newChecklistText.trim(), done: false }
      ]
    }));
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Judul destinasi wajib diisi!');
      return;
    }

    onSave({
      ...formData,
      estimatedBudget: Number(formData.estimatedBudget) || 0,
      rating: Number(formData.rating) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingItem ? 'Edit Destinasi / Acara' : 'Tambah Destinasi / Acara Baru'}
              </h2>
              <p className="text-xs text-slate-500">Rencanakan agenda seru kalian berdua</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Acara / Destinasi *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Nonton Film Horor di Bioskop"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Lokasi (Tempat / Bioskop / Kota)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Contoh: XXI Mall / Bandung"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status Rencana
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'wishlist', label: 'Impian', color: 'border-amber-400 bg-amber-50 text-amber-800' },
                  { id: 'planned', label: 'Terencana', color: 'border-sky-400 bg-sky-50 text-sky-800' },
                  { id: 'visited', label: 'Tercapai 🎉', color: 'border-emerald-400 bg-emerald-50 text-emerald-800' }
                ].map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: st.id })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      formData.status === st.id
                        ? `${st.color} shadow-sm ring-2 ring-emerald-500/20`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{formData.status === 'visited' ? 'Tanggal Dikunjungi' : 'Target Tanggal Acara'}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Otomatis masuk Kalender 📅</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Perkiraan / Estimasi Biaya
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  placeholder="Contoh: 150000"
                  value={formData.estimatedBudget}
                  onChange={e => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Checklist Aktivitas / Hal yang Ingin Dilakukan
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Sewa motor, coba sate lilit..."
                  value={newChecklistText}
                  onChange={e => setNewChecklistText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddChecklist(e)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddChecklist}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>

              {formData.checklist.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 max-h-40 overflow-y-auto">
                  {formData.checklist.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 text-xs">
                      <span className={item.done ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-medium'}>
                        {item.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklist(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan Khusus / Rencana / Kenangan
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan catatan penting, itinerary singkat, atau kesan manis perjalanan ini..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
            />
          </div>
        </form>

        {/* Modal Footer */}
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
            Simpan Destinasi
          </button>
        </div>
      </div>
    </div>
  );
};
