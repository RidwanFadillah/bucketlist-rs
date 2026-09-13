import React from 'react';
import { X, MapPin, Calendar, Star, Edit3, Trash2, CheckCircle, Square, CheckSquare, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BucketlistDetailModal = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleChecklist,
  onUpdateRating,
}) => {
  if (!isOpen || !item) return null;

  const handleToggleChecklist = (checkId) => {
    onToggleChecklist(item.id, checkId);
  };

  const handleRatingClick = (newRating) => {
    onUpdateRating(item.id, newRating);
    if (newRating === 5) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const statusLabel = item.status === 'visited' ? 'Tercapai 🎉' : item.status === 'planned' ? 'Terencana' : 'Impian';
  const statusColor = item.status === 'visited'
    ? 'bg-emerald-500/80'
    : item.status === 'planned'
    ? 'bg-sky-500/80'
    : 'bg-amber-500/80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full text-white ${statusColor}`}>
                {statusLabel}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {item.category || 'Petualangan'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">{item.title}</h1>
            {item.location && (
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{item.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-100 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500 text-white shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-sky-700 font-semibold">Tanggal Rencana</p>
                <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                  {item.targetDate || item.visitDate || 'Belum Dijadwalkan'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                Rp
              </div>
              <div>
                <p className="text-[11px] text-emerald-700 font-semibold">Estimasi Biaya</p>
                <p className="font-bold text-slate-800 text-xs sm:text-sm">
                  {item.estimatedBudget ? `Rp ${Number(item.estimatedBudget).toLocaleString('id-ID')}` : 'Rp 0'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                Rp
              </div>
              <div>
                <p className="text-[11px] text-indigo-700 font-semibold">Realisasi Pengeluaran</p>
                <p className="font-bold text-slate-800 text-xs sm:text-sm">
                  {item.actualCost ? `Rp ${Number(item.actualCost).toLocaleString('id-ID')}` : 'Rp 0'}
                </p>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Checklist Aktivitas Seru
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {(item.checklist || []).filter(c => c.done).length} / {(item.checklist || []).length} Selesai
              </span>
            </div>

            {item.checklist && item.checklist.length > 0 ? (
              <div className="space-y-2">
                {item.checklist.map((check) => (
                  <div
                    key={check.id}
                    onClick={() => handleToggleChecklist(check.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      check.done
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-500'
                        : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
                    }`}
                  >
                    {check.done ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${check.done ? 'line-through text-slate-400' : ''}`}>
                      {check.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-2xl text-center">
                Belum ada checklist aktivitas. Klik edit untuk menambahkan!
              </p>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Catatan & Kenangan Perjalanan
              </h3>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                {item.notes}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Rating Kepuasan Perjalanan</h4>
              <p className="text-[11px] text-slate-500">Berapa bintang untuk petualangan ini berdua?</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (item.rating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 hover:text-amber-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
