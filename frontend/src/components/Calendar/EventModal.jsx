import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, Check, Sparkles } from 'lucide-react';

const EVENT_TYPES = [
  { id: 'trip', label: 'Trip / Liburan ✈️', defaultColor: '#10B981' },
  { id: 'movie', label: 'Nonton Bioskop / Movie Date 🎬', defaultColor: '#EC4899' },
  { id: 'booking', label: 'Booking Tiket / Hotel 🏨', defaultColor: '#0EA5E9' },
  { id: 'deadline', label: 'Batas Pelunasan / Nabung 💳', defaultColor: '#F59E0B' },
  { id: 'milestone', label: 'Anniversary / Spesial 💖', defaultColor: '#F43F5E' },
  { id: 'other', label: 'Agenda Lainnya 📌', defaultColor: '#8B5CF6' }
];

const PRESET_COLORS = [
  '#10B981', // Emerald
  '#0EA5E9', // Sky
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EF4444'  // Red
];

export const EventModal = ({
  isOpen,
  onClose,
  onSave,
  editingEvent,
  bucketlist = [],
  initialDate = ''
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'trip',
    startDate: initialDate || new Date().toISOString().split('T')[0],
    endDate: initialDate || new Date().toISOString().split('T')[0],
    color: '#10B981',
    bucketlistId: '',
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        type: editingEvent.type || 'trip',
        startDate: editingEvent.startDate || '',
        endDate: editingEvent.endDate || editingEvent.startDate || '',
        color: editingEvent.color || '#10B981',
        bucketlistId: editingEvent.bucketlistId || '',
        notes: editingEvent.notes || ''
      });
    } else {
      setFormData({
        title: '',
        type: 'trip',
        startDate: initialDate || new Date().toISOString().split('T')[0],
        endDate: initialDate || new Date().toISOString().split('T')[0],
        color: '#10B981',
        bucketlistId: '',
        notes: ''
      });
    }
    setError('');
  }, [editingEvent, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (typeId) => {
    const selected = EVENT_TYPES.find(t => t.id === typeId);
    setFormData(prev => ({
      ...prev,
      type: typeId,
      color: selected ? selected.defaultColor : prev.color
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startDate) {
      setError('Judul agenda dan tanggal mulai wajib diisi!');
      return;
    }

    onSave({
      ...formData,
      endDate: formData.endDate || formData.startDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingEvent ? 'Edit Agenda Kalender' : 'Tandai Tanggal Baru'}
              </h2>
              <p className="text-xs text-slate-500">Pasang pengingat dan jadwal berdua</p>
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
              Judul Agenda / Catatan Tanggal *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Flight Soetta - Bali atau Pelunasan Hotel"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-xs sm:text-sm"
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tipe Agenda
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {EVENT_TYPES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTypeChange(t.id)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    formData.type === t.id
                      ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Mulai *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value, endDate: formData.endDate < e.target.value ? e.target.value : formData.endDate })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal Selesai (Opsional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium text-xs"
              />
            </div>
          </div>

          {/* Color & Destination link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Warna Penanda
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hubungkan dengan Destinasi
              </label>
              <select
                value={formData.bucketlistId}
                onChange={e => setFormData({ ...formData, bucketlistId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium bg-white text-xs truncate"
              >
                <option value="">-- Tidak Terkait --</option>
                {bucketlist.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Catatan Agenda
            </label>
            <textarea
              rows={2}
              placeholder="Misal: Bawa paspor, jam kumpul di bandara..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 text-xs font-medium"
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
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Simpan Agenda
          </button>
        </div>
      </div>
    </div>
  );
};
