import React, { useState, useEffect } from 'react';
import { X, User, Heart, Settings as SettingsIcon, Check } from 'lucide-react';
import { updateSettings } from '../../services/api';
import { useToast } from '../Common/Toast';

export const SettingsModal = ({ isOpen, onClose, settings, onSettingsUpdated }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    p1Name: 'Ridwan',
    p2Name: 'Princess',
    currency: 'IDR',
    theme: 'adventure'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        p1Name: settings.p1Name || 'Ridwan',
        p2Name: settings.p2Name || 'Princess',
        currency: settings.currency || 'IDR',
        theme: settings.theme || 'adventure'
      });
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updateSettings(formData);
      addToast('Pengaturan profil berhasil disimpan!', 'success');
      onSettingsUpdated(updated);
      onClose();
    } catch (err) {
      addToast('Gagal menyimpan profil: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Pengaturan Profil Berdua
              </h2>
              <p className="text-xs text-slate-500">Sesuaikan nama pengguna dan preferensi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {/* Person 1 Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              Nama Orang 1 (P1)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ridwan"
              value={formData.p1Name}
              onChange={e => setFormData({ ...formData, p1Name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800 text-xs sm:text-sm"
            />
          </div>

          {/* Person 2 Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Nama Orang 2 (P2 / Princess)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Princess"
              value={formData.p2Name}
              onChange={e => setFormData({ ...formData, p2Name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-bold text-slate-800 text-xs sm:text-sm"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Mata Uang
            </label>
            <select
              value={formData.currency}
              onChange={e => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 font-medium bg-white text-xs"
            >
              <option value="IDR">Rupiah (IDR - Rp)</option>
              <option value="USD">US Dollar (USD - $)</option>
              <option value="SGD">Singapore Dollar (SGD - S$)</option>
              <option value="JPY">Japanese Yen (JPY - ¥)</option>
            </select>
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
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
