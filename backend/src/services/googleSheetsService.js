const axios = require('axios');
const localDb = require('./localDbService');

/**
 * Service untuk komunikasi dengan Google Sheets melalui Google Apps Script Web App
 */
class GoogleSheetsService {
  constructor() {
    this.timeout = 20000;
  }

  getScriptUrl() {
    // 1. Cek dari .env terlebih dahulu
    const envUrl = process.env.GOOGLE_SHEET_URL || process.env.VITE_GOOGLE_SHEET_URL;
    if (envUrl && envUrl.trim().startsWith('https://script.google.com/')) {
      return envUrl.trim();
    }
    // 2. Cek dari database settings
    const settings = localDb.getSettings();
    return settings.googleSheetUrl ? settings.googleSheetUrl.trim() : '';
  }

  isConfigured() {
    const url = this.getScriptUrl();
    return Boolean(url && url.startsWith('https://script.google.com/'));
  }

  async testConnection(urlToTest = null) {
    const url = urlToTest || this.getScriptUrl();
    if (!url) {
      return { success: false, message: 'URL Google Apps Script belum diisi.' };
    }

    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        maxRedirects: 5
      });

      let data = response.data;
      if (typeof data === 'string') {
        if (data.includes('<!DOCTYPE html>') || data.includes('ServiceLogin') || data.includes('accounts.google.com')) {
          return {
            success: false,
            message: 'Google meminta login akun. Solusi: Di Apps Script -> Deploy -> New Deployment -> atur "Who has access" ke "Anyone" (Siapa saja).'
          };
        }
        try {
          data = JSON.parse(data);
        } catch (e) {
          return { success: false, message: 'Respon dari Google Sheets tidak sesuai format JSON.' };
        }
      }

      if (data && (data.status === 'success' || data.data)) {
        return {
          success: true,
          message: 'Koneksi ke Google Sheets berhasil terhubung!',
          data: data.data
        };
      }
      return { success: false, message: data?.message || 'Respon dari Google Sheets tidak sesuai format.' };
    } catch (err) {
      console.error('Google Sheets connection error:', err.message);
      return {
        success: false,
        message: `Gagal terhubung ke Google Sheets: ${err.message}. Pastikan izin deployment diatur ke "Anyone".`
      };
    }
  }

  // Sanitize data before sending to Google Sheets (prevent 50,000 char per cell limit on base64)
  sanitizeForSheet(item) {
    if (!item) return item;
    const clean = { ...item };

    // Sanitize image arrays
    if (Array.isArray(clean.images)) {
      clean.images = clean.images.map(img => {
        if (typeof img === 'string' && img.length > 500 && img.startsWith('data:image/')) {
          return '[Foto Terlampir di Aplikasi]';
        }
        return img;
      });
    }

    // Sanitize receipt image
    if (typeof clean.receiptImage === 'string' && clean.receiptImage.length > 500 && clean.receiptImage.startsWith('data:image/')) {
      clean.receiptImage = '[Bukti Struk Terlampir di Aplikasi]';
    }

    // Sanitize deposits in savings
    if (Array.isArray(clean.deposits)) {
      clean.deposits = clean.deposits.map(d => ({
        ...d,
        receiptImage: (typeof d.receiptImage === 'string' && d.receiptImage.length > 500 && d.receiptImage.startsWith('data:image/'))
          ? '[Bukti Transfer Terlampir]'
          : d.receiptImage
      }));
    }

    return clean;
  }

  async syncToGoogleSheets() {
    const url = this.getScriptUrl();
    if (!this.isConfigured()) {
      return { success: false, message: 'Google Sheets belum dikonfigurasi.' };
    }

    try {
      const db = localDb.readDb();
      const payload = {
        action: 'syncAll',
        data: {
          bucketlist: (db.bucketlist || []).map(b => this.sanitizeForSheet(b)),
          savings: (db.savings || []).map(s => this.sanitizeForSheet(s)),
          expenses: (db.expenses || []).map(e => this.sanitizeForSheet(e)),
          events: db.events || [],
          settings: db.settings || {}
        }
      };

      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: this.timeout,
        maxRedirects: 5
      });

      let resData = response.data;
      if (typeof resData === 'string') {
        try { resData = JSON.parse(resData); } catch (e) {}
      }

      if (resData && resData.status === 'success') {
        localDb.updateSettings({ lastSyncedAt: new Date().toISOString() });
        return {
          success: true,
          message: 'Seluruh data berhasil disinkronisasi ke Google Sheets!',
          timestamp: new Date().toISOString()
        };
      }
      return { success: false, message: resData?.message || 'Gagal sinkronisasi data.' };
    } catch (err) {
      console.error('Sync to Google Sheets error:', err.message);
      return { success: false, message: `Error sinkronisasi: ${err.message}` };
    }
  }

  async syncFromGoogleSheets() {
    const url = this.getScriptUrl();
    if (!this.isConfigured()) {
      return { success: false, message: 'Google Sheets belum dikonfigurasi.' };
    }

    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        maxRedirects: 5
      });

      let resData = response.data;
      if (typeof resData === 'string') {
        try { resData = JSON.parse(resData); } catch (e) {}
      }

      if (resData && resData.status === 'success' && resData.data) {
        const remoteData = resData.data;
        const currentDb = localDb.readDb();

        const mergedDb = {
          bucketlist: (remoteData.bucketlist && remoteData.bucketlist.length > 0) ? remoteData.bucketlist : currentDb.bucketlist,
          savings: (remoteData.savings && remoteData.savings.length > 0) ? remoteData.savings : currentDb.savings,
          expenses: (remoteData.expenses && remoteData.expenses.length > 0) ? remoteData.expenses : currentDb.expenses,
          events: (remoteData.events && remoteData.events.length > 0) ? remoteData.events : currentDb.events,
          settings: {
            ...currentDb.settings,
            ...(remoteData.settings || {}),
            lastSyncedAt: new Date().toISOString()
          }
        };

        localDb.writeDb(mergedDb);
        return {
          success: true,
          message: 'Data terbaru dari Google Sheets berhasil dimuat!',
          data: mergedDb
        };
      }
      return { success: false, message: 'Gagal mengambil data dari Google Sheets.' };
    } catch (err) {
      console.error('Sync from Google Sheets error:', err.message);
      return { success: false, message: `Error mengambil data: ${err.message}` };
    }
  }

  // Auto sync in background (non-blocking)
  triggerBackgroundSync() {
    if (this.isConfigured()) {
      this.syncToGoogleSheets().catch(err => console.log('Background sync skipped:', err.message));
    }
  }
}

module.exports = new GoogleSheetsService();
