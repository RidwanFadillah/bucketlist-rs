import React from 'react';
import { Crown, Target, Plus, Sparkles, TrendingUp, Heart } from 'lucide-react';

export const SavingsSummaryBanner = ({ summary, settings, onOpenAddGoal }) => {
  const p1 = settings?.p1Name || 'Orang 1';
  const p2 = settings?.p2Name || 'Orang 2';

  const totalTarget = summary?.totalTarget || 0;
  const totalSaved = summary?.totalSaved || 0;
  const totalSavedP1 = summary?.totalSavedP1 || 0;
  const totalSavedP2 = summary?.totalSavedP2 || 0;
  const percentage = summary?.percentage || 0;
  const remaining = summary?.remaining || 0;

  return (
    <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Header & Add Goal Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <Crown className="w-3.5 h-3.5" />
              <span>Tabungan Bersama 2 Orang</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Tabungan Impian {p1} & {p2} 👑
            </h2>
            <p className="text-xs text-slate-300">
              Kumpulkan dana liburan dan wujudkan impian perjalanan bersama!
            </p>
          </div>

          <button
            onClick={onOpenAddGoal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Buat Target Tabungan Baru</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Saved */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-xs text-emerald-300 font-semibold block">Total Terkumpul</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              Rp {totalSaved.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
              {percentage}% dari target
            </span>
          </div>

          {/* Total Target */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-xs text-slate-300 font-semibold block">Total Target Dana</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
              Rp {totalTarget.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-300 font-medium mt-1 block">
              Sisa: Rp {remaining.toLocaleString('id-ID')}
            </span>
          </div>

          {/* P1 Contribution */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-xs text-emerald-200 font-semibold block">Setoran {p1}</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-300 mt-1 block">
              Rp {totalSavedP1.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              {totalSaved > 0 ? Math.round((totalSavedP1 / totalSaved) * 100) : 0}% dari total
            </span>
          </div>

          {/* P2 Contribution */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-xs text-teal-200 font-semibold block">Setoran {p2}</span>
            <span className="text-lg sm:text-xl font-bold text-teal-300 mt-1 block">
              Rp {totalSavedP2.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5">
              {totalSaved > 0 ? Math.round((totalSavedP2 / totalSaved) * 100) : 0}% dari total
            </span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Kemajuan Keseluruhan Tabungan</span>
            <span className="text-emerald-400 font-bold">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
