import React from 'react';
import { ArrowRightLeft, CheckCircle2, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettlementCard = ({ summary, settings, onSettleUp, isSettling }) => {
  const p1 = settings?.p1Name || 'Orang 1';
  const p2 = settings?.p2Name || 'Orang 2';

  const settlement = summary?.settlement || {
    isBalanced: true,
    message: 'Semua saldo pengeluaran sudah impas!'
  };

  const handleSettle = () => {
    if (window.confirm('Tandai seluruh saldo aktif saat ini sebagai Lunas (Settled)?')) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onSettleUp();
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-indigo-900/50">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Summary & Debt Highlights */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Kalkulator Settlement & Pembagian Saldo
            </h3>
          </div>

          {settlement.isBalanced ? (
            <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-2xl">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-bold text-emerald-300 text-sm sm:text-base">
                  Saldo Saat Ini Impas / Seimbang!
                </h4>
                <p className="text-xs text-slate-300">
                  Tidak ada hutang aktif antara {p1} dan {p2}.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/30 p-4 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-500/30 text-pink-300 shrink-0 mt-0.5">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-pink-200 font-semibold uppercase tracking-wide">
                    Status Pelunasan
                  </p>
                  <h4 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                    {settlement.debtorName} perlu mentransfer{' '}
                    <span className="text-amber-300 font-black">
                      Rp {Number(settlement.amount || 0).toLocaleString('id-ID')}
                    </span>{' '}
                    ke {settlement.creditorName}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Dihitung otomatis dari beban pembagian seluruh pengeluaran bersama yang belum diselesaikan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Breakdown Stats & Settle Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* P1 Paid */}
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[130px]">
            <p className="text-[11px] text-slate-400 font-semibold">{p1} Membayar</p>
            <p className="font-bold text-sm sm:text-base text-emerald-400 mt-0.5">
              Rp {Number(summary?.activePaidByP1 || 0).toLocaleString('id-ID')}
            </p>
          </div>

          {/* P2 Paid */}
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[130px]">
            <p className="text-[11px] text-slate-400 font-semibold">{p2} Membayar</p>
            <p className="font-bold text-sm sm:text-base text-teal-400 mt-0.5">
              Rp {Number(summary?.activePaidByP2 || 0).toLocaleString('id-ID')}
            </p>
          </div>

          {/* Settle Up Action */}
          {!settlement.isBalanced && (
            <button
              onClick={handleSettle}
              disabled={isSettling}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSettling ? 'Memproses...' : 'Tandai Lunas (Settle Up)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
