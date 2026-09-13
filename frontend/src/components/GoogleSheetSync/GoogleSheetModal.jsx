import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Download,
  HelpCircle,
  FileSpreadsheet,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';
import {
  getSyncStatus,
  testGoogleSheetConnection,
  syncToGoogleSheet,
  syncFromGoogleSheet,
  getAppsScriptCode,
  updateSettings
} from '../../services/api';
import { useToast } from '../Common/Toast';

export const GoogleSheetModal = ({ isOpen, onClose, onSyncComplete, settings }) => {
  const { addToast } = useToast();

  const [sheetUrl, setSheetUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [syncingTo, setSyncingTo] = useState(false);
  const [syncingFrom, setSyncingFrom] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scriptCode, setScriptCode] = useState('');
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  useEffect(() => {
    if (settings?.googleSheetUrl) {
      setSheetUrl(settings.googleSheetUrl);
    }
  }, [settings]);

  useEffect(() => {
    if (isOpen) {
      getAppsScriptCode().then(code => setScriptCode(code)).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!sheetUrl.trim()) {
      addToast('Masukkan Web App URL terlebih dahulu', 'error');
      return;
    }

    try {
      setTesting(true);
      const res = await testGoogleSheetConnection(sheetUrl.trim());
      if (res.success) {
        // Save settings
        await updateSettings({ googleSheetUrl: sheetUrl.trim() });
        addToast('🎉 Koneksi Google Sheets Berhasil Terhubung!', 'success');
        onSyncComplete();
      } else {
        addToast(res.message || 'Gagal terhubung ke Google Sheets', 'error');
      }
    } catch (err) {
      addToast('Gagal menguji koneksi: ' + err.message, 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleSyncTo = async () => {
    try {
      setSyncingTo(true);
      const res = await syncToGoogleSheet();
      if (res.success) {
        addToast('Seluruh data web berhasil dikirim ke Google Sheets!', 'success');
        onSyncComplete();
      } else {
        addToast(res.message || 'Gagal sinkronisasi data', 'error');
      }
    } catch (err) {
      addToast('Gagal sinkronisasi: ' + err.message, 'error');
    } finally {
      setSyncingTo(false);
    }
  };

  const handleSyncFrom = async () => {
    try {
      setSyncingFrom(true);
      const res = await syncFromGoogleSheet();
      if (res.success) {
        addToast('Data terbaru dari Google Sheets berhasil dimuat!', 'success');
        onSyncComplete();
      } else {
        addToast(res.message || 'Gagal memuat data dari Google Sheets', 'error');
      }
    } catch (err) {
      addToast('Gagal mengambil data: ' + err.message, 'error');
    } finally {
      setSyncingFrom(false);
    }
  };

  const handleCopyCode = () => {
    if (!scriptCode) return;
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    addToast('Skrip Google Apps Script berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const isConnected = Boolean(settings?.googleSheetUrl && settings.googleSheetUrl.startsWith('https://script.google.com/'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Integrasi Database Google Sheets Online
              </h2>
              <p className="text-xs text-slate-500">
                Data real-time tersimpan di cloud spreadsheet Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Connection Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            isConnected
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-xs sm:text-sm">
                  {isConnected ? '🟢 Google Spreadsheet Terhubung Online' : '🟡 Belum Terhubung ke Google Spreadsheet'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isConnected
                    ? `Terakhir sinkronisasi: ${settings.lastSyncedAt ? new Date(settings.lastSyncedAt).toLocaleString('id-ID') : 'Baru saja'}`
                    : 'Aplikasi saat ini menggunakan database cepat lokal. Sambungkan Google Sheets untuk akses online dari HP!'}
                </p>
              </div>
            </div>
          </div>

          {/* Web App URL Input & Test */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Google Apps Script Web App URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={sheetUrl}
                onChange={e => setSheetUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Menguji...' : 'Tes & Hubungkan'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: Sync To / Sync From */}
          {isConnected && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <button
                onClick={handleSyncTo}
                disabled={syncingTo}
                className="p-3 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ArrowUpFromLine className={`w-4 h-4 text-emerald-600 ${syncingTo ? 'animate-bounce' : ''}`} />
                <span>{syncingTo ? 'Mengirim...' : 'Kirim Data ke Spreadsheet'}</span>
              </button>

              <button
                onClick={handleSyncFrom}
                disabled={syncingFrom}
                className="p-3 bg-white border border-slate-200 hover:border-sky-500 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ArrowDownToLine className={`w-4 h-4 text-sky-600 ${syncingFrom ? 'animate-bounce' : ''}`} />
                <span>{syncingFrom ? 'Mengambil...' : 'Tarik Data dari Spreadsheet'}</span>
              </button>
            </div>
          )}

          {/* Quick Setup Guide Accordion */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowCodeGuide(!showCodeGuide)}
              className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-bold text-xs text-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                Cara Menghubungkan Google Spreadsheet (Hanya 2 Menit)
              </span>
              <span className="text-teal-600">{showCodeGuide ? 'Sembunyikan' : 'Lihat Panduan'}</span>
            </button>

            {showCodeGuide && (
              <div className="p-4 bg-white border-t border-slate-200 space-y-3 text-xs text-slate-600 leading-relaxed">
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Buka Google Spreadsheet baru di Google Drive Anda atau klik{' '}
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 font-bold underline inline-flex items-center gap-0.5"
                    >
                      sheets.new <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Di menu spreadsheet, klik <strong>Extensions (Ekstensi)</strong> &rarr; <strong>Apps Script</strong>.
                  </li>
                  <li>
                    Klik tombol di bawah ini untuk <strong>Salin Skrip Kode</strong>, lalu tempel (*paste*) ke editor Apps Script:
                    <div className="mt-2 mb-2">
                      <button
                        onClick={handleCopyCode}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Kode Tersalin!' : 'Salin Skrip Google Apps Script'}</span>
                      </button>
                    </div>
                  </li>
                  <li>
                    Klik tombol <strong>Deploy (Terapkan)</strong> di pojok kanan atas &rarr; <strong>New deployment (Penerapan baru)</strong>.
                  </li>
                  <li>
                    Pilih tipe <strong>Web app (Aplikasi Web)</strong>:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-700">
                      <li>Execute as: <strong>Me (email Anda)</strong></li>
                      <li>Who has access: <strong>Anyone (Siapa saja)</strong></li>
                    </ul>
                  </li>
                  <li>
                    Klik <strong>Deploy</strong>, lalu salin <strong>Web App URL</strong> dan tempelkan pada kolom di atas!
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Backup Download Button */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Ingin simpan salinan offline?</span>
            <a
              href="/api/sync/export-backup"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Download Backup Data (JSON)
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
