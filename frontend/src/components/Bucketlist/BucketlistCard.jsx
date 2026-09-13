import React from 'react';
import { MapPin, Calendar, CheckSquare, Star, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const STATUS_CONFIG = {
  wishlist: {
    label: 'Impian',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  planned: {
    label: 'Terencana',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500'
  },
  visited: {
    label: 'Tercapai 🎉',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  }
};

const CATEGORY_COLORS = {
  'Nonton Film & Date 🎬': 'bg-pink-50 text-pink-700 border-pink-200',
  'Pantai & Laut 🏖️': 'bg-teal-50 text-teal-700 border-teal-200',
  'Pantai & Laut': 'bg-teal-50 text-teal-700 border-teal-200',
  'Gunung & Alam 🌲': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Gunung & Alam': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Kota & Budaya 🏛️': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Kota & Budaya': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Kuliner & Jajan 🍜': 'bg-orange-50 text-orange-700 border-orange-200',
  'Kuliner': 'bg-orange-50 text-orange-700 border-orange-200',
  'Staycation & Relaksasi 🏨': 'bg-purple-50 text-purple-700 border-purple-200',
  'Staycation & Relaksasi': 'bg-purple-50 text-purple-700 border-purple-200',
  'Internasional & Luar Negeri ✈️': 'bg-rose-50 text-rose-700 border-rose-200',
  'Internasional': 'bg-rose-50 text-rose-700 border-rose-200'
};

export const BucketlistCard = ({ item, onSelect, onQuickStatusChange }) => {
  const statusInfo = STATUS_CONFIG[item.status] || STATUS_CONFIG.wishlist;
  const categoryColor = CATEGORY_COLORS[item.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  const completedChecklist = (item.checklist || []).filter(c => c.done).length;
  const totalChecklist = (item.checklist || []).length;

  const handleStatusToggle = (e) => {
    e.stopPropagation();
    let nextStatus = 'wishlist';
    if (item.status === 'wishlist') nextStatus = 'planned';
    else if (item.status === 'planned') {
      nextStatus = 'visited';
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      nextStatus = 'wishlist';
    }
    onQuickStatusChange(item.id, nextStatus);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Header Card */}
      <div className="p-5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${categoryColor}`}>
            {item.category || 'Petualangan'}
          </span>

          <button
            onClick={handleStatusToggle}
            className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm transition-all transform active:scale-95 ${statusInfo.bg}`}
            title="Klik untuk ganti status cepat"
          >
            <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
            {statusInfo.label}
          </button>
        </div>

        <h3 className="font-bold text-lg text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate">{item.location || 'Destinasi Belum Diisi'}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Target Date */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-slate-400 font-medium">Tanggal</p>
              <p className="font-semibold text-slate-700 truncate">
                {item.targetDate || item.visitDate || 'Belum diatur'}
              </p>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0">Rp</span>
            <div className="truncate">
              <p className="text-[10px] text-slate-400 font-medium">Estimasi</p>
              <p className="font-semibold text-slate-700 truncate">
                {item.estimatedBudget ? `Rp ${(item.estimatedBudget / 1000).toLocaleString('id-ID')}k` : 'Rp 0'}
              </p>
            </div>
          </div>
        </div>

        {/* Checklist Progress */}
        {totalChecklist > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                Aktivitas ({completedChecklist}/{totalChecklist})
              </span>
              <span className="text-emerald-700 font-bold">
                {Math.round((completedChecklist / totalChecklist) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(completedChecklist / totalChecklist) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Card Footer: Rating & Action Hint */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {item.status === 'visited' && item.rating > 0 ? (
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{item.rating}.0 / 5.0</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400">
              {item.notes ? 'Ada catatan' : 'Rencana baru'}
            </span>
          )}

          <span className="flex items-center gap-1 text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform">
            Lihat Detail
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
