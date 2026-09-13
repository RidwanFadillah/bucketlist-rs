import React from 'react';
import { Compass, Wallet, Calendar, Cloud, CloudOff, RefreshCw, Settings, Sparkles, Heart } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  syncStatus,
  onOpenSyncModal,
  onOpenSettingsModal,
  settings,
  onSyncNow,
  isSyncing
}) => {
  const p1 = settings?.p1Name || 'Ridwan';
  const p2 = settings?.p2Name || 'Princess';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Duo Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Compass className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                  DuoVenture
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  {p1} & {p2}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Bucketlist Perjalanan & Catatan Keuangan 2 Orang
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('bucketlist')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'bucketlist'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Bucketlist</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'finance'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Wallet className="w-4 h-4 text-indigo-600" />
              <span>Keuangan</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'calendar'
                  ? 'bg-white text-rose-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Kalender</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Google Sheets Status Badge */}
            <button
              onClick={onOpenSyncModal}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                syncStatus?.isConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
              }`}
              title={syncStatus?.isConfigured ? 'Google Sheets Terhubung' : 'Google Sheets Belum Terhubung'}
            >
              {syncStatus?.isConfigured ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline">Google Sheets Online</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden md:inline">Hubungkan Spreadsheet</span>
                </>
              )}
            </button>

            {/* Quick Sync Now Button */}
            {syncStatus?.isConfigured && (
              <button
                onClick={onSyncNow}
                disabled={isSyncing}
                className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                title="Sinkronisasi Data Sekarang"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={onOpenSettingsModal}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Pengaturan Profil & Nama"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
