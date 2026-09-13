import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BucketlistTab } from './components/Bucketlist/BucketlistTab';
import { FinanceTab } from './components/Finance/FinanceTab';
import { CalendarTab } from './components/Calendar/CalendarTab';
import { GoogleSheetModal } from './components/GoogleSheetSync/GoogleSheetModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { ToastProvider, useToast } from './components/Common/Toast';
import {
  getBucketlist,
  createBucketlist,
  updateBucketlist,
  deleteBucketlist,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  settleExpenses,
  getSavings,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addSavingsDeposit,
  deleteSavingsDeposit,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getSettings,
  getSyncStatus,
  syncToGoogleSheet
} from './services/api';
import { Loader2, RefreshCw } from 'lucide-react';

function AppContent() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('bucketlist'); // 'bucketlist' | 'finance' | 'calendar'
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [bucketlist, setBucketlist] = useState([]);
  const [savingsData, setSavingsData] = useState({ data: [], summary: {} });
  const [expensesData, setExpensesData] = useState({ data: [], summary: {} });
  const [events, setEvents] = useState([]);
  const [settings, setSettings] = useState({ p1Name: 'Ridwan', p2Name: 'Princess' });
  const [syncStatus, setSyncStatus] = useState({ isConfigured: false });

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [bRes, savRes, expRes, evRes, setRes, syncRes] = await Promise.all([
        getBucketlist(),
        getSavings(),
        getExpenses(),
        getEvents(),
        getSettings(),
        getSyncStatus()
      ]);

      setBucketlist(bRes || []);
      setSavingsData(savRes || { data: [], summary: {} });
      setExpensesData(expRes || { data: [], summary: {} });
      setEvents(evRes || []);
      setSettings(setRes || { p1Name: 'Ridwan', p2Name: 'Princess' });
      setSyncStatus(syncRes || { isConfigured: false });
    } catch (err) {
      console.error('Error loading data:', err);
      addToast('Gagal memuat beberapa data dari server', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Sync Now handler
  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);
      const res = await syncToGoogleSheet();
      if (res.success) {
        addToast('✨ Seluruh data berhasil disinkronkan ke Google Sheets!', 'success');
        loadAllData();
      } else {
        addToast(res.message || 'Gagal sinkronisasi data', 'error');
      }
    } catch (err) {
      addToast('Gagal sinkronisasi: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Bucketlist actions
  const handleCreateBucketlist = async (data) => {
    const res = await createBucketlist(data);
    await loadAllData();
    return res;
  };

  const handleUpdateBucketlist = async (id, data) => {
    const res = await updateBucketlist(id, data);
    await loadAllData();
    return res;
  };

  const handleDeleteBucketlist = async (id) => {
    const res = await deleteBucketlist(id);
    await loadAllData();
    return res;
  };

  // Expense actions
  const handleCreateExpense = async (data) => {
    const res = await createExpense(data);
    await loadAllData();
    return res;
  };

  const handleUpdateExpense = async (id, data) => {
    const res = await updateExpense(id, data);
    await loadAllData();
    return res;
  };

  const handleDeleteExpense = async (id) => {
    const res = await deleteExpense(id);
    await loadAllData();
    return res;
  };

  const handleSettleExpenses = async () => {
    const res = await settleExpenses();
    await loadAllData();
    return res;
  };

  // Savings actions
  const handleCreateSavingsGoal = async (data) => {
    const res = await createSavingsGoal(data);
    await loadAllData();
    return res;
  };

  const handleUpdateSavingsGoal = async (id, data) => {
    const res = await updateSavingsGoal(id, data);
    await loadAllData();
    return res;
  };

  const handleDeleteSavingsGoal = async (id) => {
    const res = await deleteSavingsGoal(id);
    await loadAllData();
    return res;
  };

  const handleAddSavingsDeposit = async (goalId, data) => {
    const res = await addSavingsDeposit(goalId, data);
    await loadAllData();
    return res;
  };

  const handleDeleteSavingsDeposit = async (goalId, depositId) => {
    const res = await deleteSavingsDeposit(goalId, depositId);
    await loadAllData();
    return res;
  };

  // Event actions
  const handleCreateEvent = async (data) => {
    const res = await createEvent(data);
    await loadAllData();
    return res;
  };

  const handleUpdateEvent = async (id, data) => {
    const res = await updateEvent(id, data);
    await loadAllData();
    return res;
  };

  const handleDeleteEvent = async (id) => {
    const res = await deleteEvent(id);
    await loadAllData();
    return res;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/25 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">DuoVenture</h2>
          <p className="text-xs text-slate-500">Memuat petualangan & catatan keuangan kalian berdua...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        syncStatus={syncStatus}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        settings={settings}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'bucketlist' && (
          <BucketlistTab
            bucketlist={bucketlist}
            onCreateBucketlist={handleCreateBucketlist}
            onUpdateBucketlist={handleUpdateBucketlist}
            onDeleteBucketlist={handleDeleteBucketlist}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceTab
            expensesData={expensesData}
            savingsData={savingsData}
            bucketlist={bucketlist}
            settings={settings}
            onCreateExpense={handleCreateExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            onSettleExpenses={handleSettleExpenses}
            onCreateSavingsGoal={handleCreateSavingsGoal}
            onUpdateSavingsGoal={handleUpdateSavingsGoal}
            onDeleteSavingsGoal={handleDeleteSavingsGoal}
            onAddSavingsDeposit={handleAddSavingsDeposit}
            onDeleteSavingsDeposit={handleDeleteSavingsDeposit}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarTab
            events={events}
            bucketlist={bucketlist}
            onCreateEvent={handleCreateEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
      </main>

      {/* Google Sheets Sync Modal */}
      <GoogleSheetModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncComplete={loadAllData}
        settings={settings}
      />

      {/* Profile / Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSettingsUpdated={(newSet) => setSettings(newSet)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
