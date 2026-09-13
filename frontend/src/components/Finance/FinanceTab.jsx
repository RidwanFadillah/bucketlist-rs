import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Crown,
} from 'lucide-react';
import { SettlementCard } from './SettlementCard';
import { ExpenseModal } from './ExpenseModal';
import { ExpenseCharts } from './ExpenseCharts';
import { SavingsSummaryBanner } from './Savings/SavingsSummaryBanner';
import { SavingsGoalCard } from './Savings/SavingsGoalCard';
import { SavingsGoalModal } from './Savings/SavingsGoalModal';
import { SavingsDepositModal } from './Savings/SavingsDepositModal';
import { useToast } from '../Common/Toast';

export const FinanceTab = ({
  expensesData,
  savingsData,
  bucketlist = [],
  settings,
  onCreateExpense,
  onUpdateExpense,
  onDeleteExpense,
  onSettleExpenses,
  onCreateSavingsGoal,
  onUpdateSavingsGoal,
  onDeleteSavingsGoal,
  onAddSavingsDeposit,
  onDeleteSavingsDeposit
}) => {
  const { addToast } = useToast();
  const p1 = settings?.p1Name || 'Orang 1';
  const p2 = settings?.p2Name || 'Orang 2';

  const [subTab, setSubTab] = useState('savings');

  // Savings States
  const savings = savingsData?.data || [];
  const savingsSummary = savingsData?.summary || {};
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [depositModalGoal, setDepositModalGoal] = useState(null);

  // Expenses States
  const expenses = expensesData?.data || [];
  const expensesSummary = expensesData?.summary || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSettling, setIsSettling] = useState(false);

  const bucketlistMap = useMemo(() => {
    const map = {};
    bucketlist.forEach(b => { map[b.id] = b.title; });
    return map;
  }, [bucketlist]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchSearch = (exp.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (exp.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'all' ? true : filterStatus === 'active' ? !exp.isSettled : exp.isSettled;
      return matchSearch && matchStatus;
    });
  }, [expenses, searchQuery, filterStatus]);

  // SAVINGS HANDLERS
  const handleSaveGoal = async (formData) => {
    try {
      if (editingGoal) {
        await onUpdateSavingsGoal(editingGoal.id, formData);
        addToast('Target tabungan berhasil diperbarui!', 'success');
      } else {
        await onCreateSavingsGoal(formData);
        addToast('Target tabungan bersama baru berhasil dibuat!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan target tabungan', 'error');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Hapus target tabungan ini beserta seluruh riwayat setorannya?')) {
      try {
        await onDeleteSavingsGoal(id);
        addToast('Target tabungan telah dihapus.', 'info');
      } catch (err) {
        addToast('Gagal menghapus target tabungan', 'error');
      }
    }
  };

  const handleSaveDeposit = async (goalId, depositData) => {
    try {
      await onAddSavingsDeposit(goalId, depositData);
      addToast('Setoran tabungan berhasil dicatat! 👑', 'success');
    } catch (err) {
      addToast(err.message || 'Gagal mencatat setoran tabungan', 'error');
    }
  };

  const handleDeleteDeposit = async (goalId, depositId) => {
    if (window.confirm('Hapus catatan setoran ini?')) {
      try {
        await onDeleteSavingsDeposit(goalId, depositId);
        addToast('Catatan setoran telah dihapus.', 'info');
      } catch (err) {
        addToast('Gagal menghapus setoran', 'error');
      }
    }
  };

  // EXPENSES HANDLERS
  const handleSaveExpense = async (formData) => {
    try {
      if (editingExpense) {
        await onUpdateExpense(editingExpense.id, formData);
        addToast('Catatan pengeluaran berhasil diperbarui!', 'success');
      } else {
        await onCreateExpense(formData);
        addToast('Pengeluaran baru berhasil dicatat!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Gagal menyimpan pengeluaran', 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Hapus catatan pengeluaran ini?')) {
      try {
        await onDeleteExpense(id);
        addToast('Catatan pengeluaran telah dihapus.', 'info');
      } catch (err) {
        addToast('Gagal menghapus pengeluaran', 'error');
      }
    }
  };

  const handleSettleUp = async () => {
    try {
      setIsSettling(true);
      await onSettleExpenses();
      addToast('🎉 Seluruh saldo berhasil ditandai Lunas!', 'success');
    } catch (err) {
      addToast('Gagal menyelesaikan pelunasan saldo', 'error');
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/60 shadow-inner">
          <button
            onClick={() => setSubTab('savings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              subTab === 'savings' ? 'bg-white text-emerald-700 shadow-md font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-4 h-4 text-emerald-600" />
            <span>Tabungan Bersama 2 Orang ({savings.length})</span>
          </button>
          <button
            onClick={() => setSubTab('expenses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
              subTab === 'expenses' ? 'bg-white text-indigo-700 shadow-md font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span>Catatan Pengeluaran & Split Bill ({expenses.length})</span>
          </button>
        </div>
      </div>

      {/* TABUNGAN BERSAMA */}
      {subTab === 'savings' && (
        <div className="space-y-6">
          <SavingsSummaryBanner
            summary={savingsSummary}
            settings={settings}
            onOpenAddGoal={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
          />
          {savings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savings.map(goal => (
                <SavingsGoalCard
                  key={goal.id}
                  goal={goal}
                  settings={settings}
                  onOpenDepositModal={(targetGoal) => setDepositModalGoal(targetGoal)}
                  onEditGoal={(targetGoal) => { setEditingGoal(targetGoal); setIsGoalModalOpen(true); }}
                  onDeleteGoal={handleDeleteGoal}
                  onDeleteDeposit={handleDeleteDeposit}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <Crown className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Belum Ada Target Tabungan Bersama</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                Mulai buat target tabungan untuk tiket pesawat, hotel, atau dana liburan berdua {p1} & {p2}!
              </p>
              <button
                onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Buat Target Tabungan Pertama
              </button>
            </div>
          )}
        </div>
      )}

      {/* CATATAN PENGELUARAN */}
      {subTab === 'expenses' && (
        <div className="space-y-6">
          <SettlementCard summary={expensesSummary} settings={settings} onSettleUp={handleSettleUp} isSettling={isSettling} />
          <ExpenseCharts summary={expensesSummary} settings={settings} />

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-600" /> Daftar Riwayat Pengeluaran
                </h3>
                <p className="text-xs text-slate-500">Total {filteredExpenses.length} catatan pengeluaran</p>
              </div>
              <button
                onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Catat Pengeluaran Baru
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-3 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari transaksi atau catatan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[{ id: 'all', label: 'Semua' }, { id: 'active', label: 'Belum Lunas' }, { id: 'settled', label: 'Lunas' }].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setFilterStatus(st.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === st.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filteredExpenses.length > 0 ? (
              <div className="space-y-3">
                {filteredExpenses.map((exp) => {
                  const payerName = exp.paidBy === 'p1' ? p1 : p2;
                  const linkedDestination = bucketlistMap[exp.bucketlistId];
                  return (
                    <div
                      key={exp.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        exp.isSettled ? 'bg-slate-50/70 border-slate-200/80 opacity-80' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0 border border-indigo-100">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {exp.category || 'Umum'}
                            </span>
                            {linkedDestination && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 truncate max-w-[180px]">
                                📍 {linkedDestination}
                              </span>
                            )}
                            {exp.isSettled ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Lunas
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Aktif
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">{exp.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>{exp.date}</span>
                            <span>•</span>
                            <span>Dibayar oleh: <strong className="text-slate-700">{payerName}</strong></span>
                            <span>•</span>
                            <span>
                              Beban: <strong className="text-indigo-600">{p1}: Rp {Number(exp.splitP1 || 0).toLocaleString('id-ID')}</strong> | <strong className="text-teal-600">{p2}: Rp {Number(exp.splitP2 || 0).toLocaleString('id-ID')}</strong>
                            </span>
                          </div>
                          {exp.notes && (
                            <p className="text-[11px] text-slate-400 mt-1 italic">"{exp.notes}"</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <p className="text-base sm:text-lg font-black text-slate-800">
                            Rp {Number(exp.amount || 0).toLocaleString('id-ID')}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">
                            {exp.splitType === '50-50' ? 'Split 50:50' : exp.splitType === 'custom' ? 'Split Kustom' : '100% Payer'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditingExpense(exp); setIsExpenseModalOpen(true); }}
                            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">Belum ada catatan pengeluaran</h4>
                <p className="text-xs text-slate-400 mt-0.5 mb-4">
                  Catat pengeluaran tiket, hotel, makanan, atau oleh-oleh untuk membagi tagihan berdua secara otomatis.
                </p>
                <button
                  onClick={() => { setEditingExpense(null); setIsExpenseModalOpen(true); }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Catat Pengeluaran Pertama
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
        bucketlist={bucketlist}
      />
      <SavingsDepositModal
        isOpen={Boolean(depositModalGoal)}
        onClose={() => setDepositModalGoal(null)}
        onSave={handleSaveDeposit}
        goal={depositModalGoal}
        settings={settings}
      />
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        bucketlist={bucketlist}
        settings={settings}
      />
    </div>
  );
};
