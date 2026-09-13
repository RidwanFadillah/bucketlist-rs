import React, { useState } from 'react';
import {
  Crown,
  Plus,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  CheckCircle2,
} from 'lucide-react';

export const SavingsGoalCard = ({
  goal,
  settings,
  onOpenDepositModal,
  onEditGoal,
  onDeleteGoal,
  onDeleteDeposit,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const p1 = settings?.p1Name || 'Orang 1';
  const p2 = settings?.p2Name || 'Orang 2';

  const deposits = goal.deposits || [];
  const totalSaved = deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const targetAmount = Number(goal.targetAmount) || 0;
  const progressPercent = targetAmount > 0 ? Math.min(100, Math.round((totalSaved / targetAmount) * 100)) : 0;
  const isGoalReached = progressPercent >= 100;

  // Breakdown by saver
  let p1Saved = 0;
  let p2Saved = 0;
  deposits.forEach(d => {
    const amt = Number(d.amount) || 0;
    if (d.saver === 'p1') p1Saved += amt;
    else if (d.saver === 'p2') p2Saved += amt;
    else if (d.saver === 'both') {
      p1Saved += amt / 2;
      p2Saved += amt / 2;
    }
  });

  const p1Percent = totalSaved > 0 ? Math.round((p1Saved / totalSaved) * 100) : 50;
  const p2Percent = totalSaved > 0 ? Math.round((p2Saved / totalSaved) * 100) : 50;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Title & Goal Meta */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5"
              style={{ backgroundColor: goal.color || '#10B981' }}
            >
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {goal.category || 'Tabungan Trip'}
                </span>
                {isGoalReached && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Target Tercapai 🎉
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800 leading-snug">
                {goal.title}
              </h3>
              {goal.targetDate && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Target: {goal.targetDate}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEditGoal(goal)}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteGoal(goal.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Amount */}
        <div className="space-y-2 pt-1">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Terkumpul Bersama</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800">
                Rp {totalSaved.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold block">Target</span>
              <span className="text-sm sm:text-base font-bold text-slate-600">
                Rp {targetAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Dual Contribution Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            {totalSaved > 0 ? (
              <>
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(p1Saved / targetAmount) * 100}%` }}
                  title={`${p1}: Rp ${p1Saved.toLocaleString('id-ID')}`}
                />
                <div
                  className="h-full bg-teal-400 transition-all duration-500"
                  style={{ width: `${(p2Saved / targetAmount) * 100}%` }}
                  title={`${p2}: Rp ${p2Saved.toLocaleString('id-ID')}`}
                />
              </>
            ) : (
              <div className="h-full bg-slate-200 w-0" />
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="font-bold text-emerald-700">
              {progressPercent}% Tercapai
            </span>
            <span className="text-slate-500 font-medium">
              Sisa: Rp {Math.max(0, targetAmount - totalSaved).toLocaleString('id-ID')} lagi
            </span>
          </div>
        </div>

        {/* P1 vs P2 Contribution Breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-700 font-bold block">{p1}</span>
              <span className="font-bold text-slate-800">Rp {p1Saved.toLocaleString('id-ID')}</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-600">{p1Percent}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-teal-700 font-bold block">{p2}</span>
              <span className="font-bold text-slate-800">Rp {p2Saved.toLocaleString('id-ID')}</span>
            </div>
            <span className="text-xs font-extrabold text-teal-600">{p2Percent}%</span>
          </div>
        </div>

        {/* Notes */}
        {goal.notes && (
          <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl">
            "{goal.notes}"
          </p>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <span>Riwayat Setoran ({deposits.length})</span>
          {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => onOpenDepositModal(goal)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Setor Tabungan</span>
        </button>
      </div>

      {/* Expandable Deposit History */}
      {showHistory && (
        <div className="p-4 bg-slate-100/70 border-t border-slate-200 space-y-2 max-h-60 overflow-y-auto">
          {deposits.length > 0 ? (
            deposits.map((dep) => {
              const saverName = dep.saver === 'p1' ? p1 : dep.saver === 'p2' ? p2 : `${p1} & ${p2}`;
              return (
                <div
                  key={dep.id}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-800">
                        + Rp {Number(dep.amount || 0).toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {dep.date} • Disetor oleh: <strong className="text-slate-600">{saverName}</strong>
                        {dep.notes && ` • "${dep.notes}"`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteDeposit(goal.id, dep.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-xs text-slate-400 py-3">
              Belum ada riwayat setoran. Klik "Setor Tabungan" untuk mulai menabung!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
