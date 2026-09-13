/**
 * GOOGLE APPS SCRIPT UNTUK DATABASE BUCKETLIST, TABUNGAN 2 ORANG, PENGELUARAN & KALENDER (CLEAN TEXT MODE)
 * =========================================================================================================
 */

const SHEET_NAMES = {
  BUCKETLIST: 'Bucketlist',
  TABUNGAN: 'Tabungan_Bersama',
  KEUANGAN: 'Pengeluaran',
  KALENDER: 'Kalender',
  PENGATURAN: 'Pengaturan'
};

function doGet(e) {
  try {
    initSheetsIfNeeded();
    const data = getAllData();
    return createJsonResponse({ status: 'success', message: 'Data Google Sheets berhasil dimuat', data: data });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

function doPost(e) {
  try {
    initSheetsIfNeeded();
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const payload = contents.data;

    let result = { status: 'success' };

    switch (action) {
      case 'getAll':
        result.data = getAllData();
        break;

      case 'syncAll':
        if (payload.bucketlist) saveSheetData(SHEET_NAMES.BUCKETLIST, payload.bucketlist);
        if (payload.savings) saveSheetData(SHEET_NAMES.TABUNGAN, payload.savings);
        if (payload.expenses) saveSheetData(SHEET_NAMES.KEUANGAN, payload.expenses);
        if (payload.events) saveSheetData(SHEET_NAMES.KALENDER, payload.events);
        if (payload.settings) saveSheetData(SHEET_NAMES.PENGATURAN, [payload.settings]);
        result.message = 'Semua data berhasil disinkronisasi ke Google Sheets!';
        result.data = getAllData();
        break;

      case 'saveSavings':
        saveSheetData(SHEET_NAMES.TABUNGAN, payload);
        result.message = 'Tabungan berhasil disimpan';
        break;

      case 'saveBucketlist':
        saveSheetData(SHEET_NAMES.BUCKETLIST, payload);
        result.message = 'Bucketlist berhasil disimpan';
        break;

      case 'saveExpenses':
        saveSheetData(SHEET_NAMES.KEUANGAN, payload);
        result.message = 'Keuangan berhasil disimpan';
        break;

      case 'saveEvents':
        saveSheetData(SHEET_NAMES.KALENDER, payload);
        result.message = 'Kalender berhasil disimpan';
        break;

      case 'saveSettings':
        saveSheetData(SHEET_NAMES.PENGATURAN, Array.isArray(payload) ? payload : [payload]);
        result.message = 'Pengaturan berhasil disimpan';
        break;

      case 'ping':
        result.message = 'Koneksi Berhasil!';
        break;

      default:
        result = { status: 'error', message: 'Action tidak dikenali' };
    }

    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function initSheetsIfNeeded() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Tab 1: Bucketlist
  let sheetB = ss.getSheetByName(SHEET_NAMES.BUCKETLIST);
  if (!sheetB) {
    sheetB = ss.insertSheet(SHEET_NAMES.BUCKETLIST);
    const headers = ['ID', 'Judul Destinasi', 'Lokasi (Kota/Negara)', 'Kategori', 'Status', 'Target Tanggal', 'Estimasi Biaya (Rp)', 'Realisasi Biaya (Rp)', 'Rating (1-5)', 'Catatan / Kenangan', 'Checklist Aktivitas', 'Dibuat Pada'];
    sheetB.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#059669').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetB.setFrozenRows(1);
  }

  // Tab 2: Tabungan Bersama
  let sheetT = ss.getSheetByName(SHEET_NAMES.TABUNGAN);
  if (!sheetT) {
    sheetT = ss.insertSheet(SHEET_NAMES.TABUNGAN);
    const headers = ['ID Goal', 'Judul Tabungan', 'Target Nominal (Rp)', 'Total Terkumpul (Rp)', 'Target Tanggal', 'Kategori', 'Riwayat Setoran (JSON)', 'Catatan', 'Dibuat Pada'];
    sheetT.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#10B981').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetT.setFrozenRows(1);
  }

  // Tab 3: Pengeluaran
  let sheetK = ss.getSheetByName(SHEET_NAMES.KEUANGAN);
  if (!sheetK) {
    sheetK = ss.insertSheet(SHEET_NAMES.KEUANGAN);
    const headers = ['ID', 'Terkait Destinasi', 'Judul Transaksi', 'Nominal (Rp)', 'Kategori', 'Dibayar Oleh', 'Tipe Split', 'Beban Orang 1 (Rp)', 'Beban Orang 2 (Rp)', 'Tanggal Transaksi', 'Catatan', 'Status Lunas', 'Dibuat Pada'];
    sheetK.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#4F46E5').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetK.setFrozenRows(1);
  }

  // Tab 4: Kalender
  let sheetC = ss.getSheetByName(SHEET_NAMES.KALENDER);
  if (!sheetC) {
    sheetC = ss.insertSheet(SHEET_NAMES.KALENDER);
    const headers = ['ID', 'Judul Agenda', 'Tipe Agenda', 'Tanggal Mulai', 'Tanggal Selesai', 'Warna', 'Terkait Destinasi ID', 'Catatan', 'Dibuat Pada'];
    sheetC.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#E11D48').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetC.setFrozenRows(1);
  }

  // Tab 5: Pengaturan
  let sheetP = ss.getSheetByName(SHEET_NAMES.PENGATURAN);
  if (!sheetP) {
    sheetP = ss.insertSheet(SHEET_NAMES.PENGATURAN);
    const headers = ['Nama Orang 1', 'Nama Orang 2', 'Mata Uang', 'Tema', 'Terakhir Diperbarui'];
    sheetP.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#0D9488').setFontColor('#FFFFFF').setFontWeight('bold');
    sheetP.setFrozenRows(1);
    sheetP.getRange(2, 1, 1, 5).setValues([['Ridwan', 'Princess', 'IDR', 'adventure', new Date().toISOString()]]);
  }

  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }
}

function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    bucketlist: getSheetData(ss.getSheetByName(SHEET_NAMES.BUCKETLIST), mapRowToBucketlist),
    savings: getSheetData(ss.getSheetByName(SHEET_NAMES.TABUNGAN), mapRowToSaving),
    expenses: getSheetData(ss.getSheetByName(SHEET_NAMES.KEUANGAN), mapRowToExpense),
    events: getSheetData(ss.getSheetByName(SHEET_NAMES.KALENDER), mapRowToEvent),
    settings: getSettingsData(ss.getSheetByName(SHEET_NAMES.PENGATURAN))
  };
}

function getSheetData(sheet, mapperFn) {
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  const numCols = sheet.getLastColumn();
  const values = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
  return values.map(mapperFn).filter(item => item && item.id);
}

function getSettingsData(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return { p1Name: 'Ridwan', p2Name: 'Princess', currency: 'IDR', theme: 'adventure' };
  const row = sheet.getRange(2, 1, 1, 5).getValues()[0];
  return { p1Name: row[0] || 'Ridwan', p2Name: row[1] || 'Princess', currency: row[2] || 'IDR', theme: row[3] || 'adventure', updatedAt: row[4] || new Date().toISOString() };
}

function saveSheetData(sheetName, items) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  if (!items || items.length === 0) return;
  let rows = [];
  if (sheetName === SHEET_NAMES.BUCKETLIST) rows = items.map(mapBucketlistToRow);
  else if (sheetName === SHEET_NAMES.TABUNGAN) rows = items.map(mapSavingToRow);
  else if (sheetName === SHEET_NAMES.KEUANGAN) rows = items.map(mapExpenseToRow);
  else if (sheetName === SHEET_NAMES.KALENDER) rows = items.map(mapEventToRow);
  else if (sheetName === SHEET_NAMES.PENGATURAN) {
    const s = items[0] || items;
    rows = [[s.p1Name || 'Ridwan', s.p2Name || 'Princess', s.currency || 'IDR', s.theme || 'adventure', new Date().toISOString()]];
  }
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function safeString(val, maxLen) {
  if (!val) return '';
  const str = String(val);
  if (maxLen && str.length > maxLen) {
    return str.substring(0, maxLen) + '...';
  }
  return str;
}

function mapRowToSaving(row) {
  const deposits = parseJsonSafe(row[6], []);
  return {
    id: String(row[0] || ''),
    title: String(row[1] || ''),
    targetAmount: Number(row[2]) || 0,
    targetDate: row[4] ? formatDate(row[4]) : '',
    category: String(row[5] || 'Liburan & Trip'),
    deposits: deposits,
    notes: String(row[7] || ''),
    createdAt: row[8] ? formatDate(row[8]) : new Date().toISOString()
  };
}

function mapSavingToRow(item) {
  const deposits = item.deposits || [];
  const totalSaved = deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  return [
    safeString(item.id, 100),
    safeString(item.title, 500),
    item.targetAmount || 0,
    totalSaved,
    item.targetDate || '',
    safeString(item.category, 100),
    safeString(JSON.stringify(deposits), 10000),
    safeString(item.notes, 2000),
    item.createdAt || new Date().toISOString()
  ];
}

function mapRowToBucketlist(row) {
  return {
    id: String(row[0] || ''),
    title: String(row[1] || ''),
    location: String(row[2] || ''),
    category: String(row[3] || 'Alam/Gunung'),
    status: String(row[4] || 'wishlist'),
    targetDate: row[5] ? formatDate(row[5]) : '',
    estimatedBudget: Number(row[6]) || 0,
    actualCost: Number(row[7]) || 0,
    rating: Number(row[8]) || 0,
    notes: String(row[9] || ''),
    checklist: parseJsonSafe(row[10], []),
    createdAt: row[11] ? formatDate(row[11]) : new Date().toISOString()
  };
}

function mapBucketlistToRow(item) {
  return [
    safeString(item.id, 100),
    safeString(item.title, 500),
    safeString(item.location, 500),
    safeString(item.category, 100),
    safeString(item.status, 50),
    item.targetDate || '',
    item.estimatedBudget || 0,
    item.actualCost || 0,
    item.rating || 0,
    safeString(item.notes, 2000),
    safeString(JSON.stringify(item.checklist || []), 10000),
    item.createdAt || new Date().toISOString()
  ];
}

function mapRowToExpense(row) {
  return {
    id: String(row[0] || ''),
    bucketlistId: String(row[1] || ''),
    title: String(row[2] || ''),
    amount: Number(row[3]) || 0,
    category: String(row[4] || 'Lainnya'),
    paidBy: String(row[5] || 'p1'),
    splitType: String(row[6] || '50-50'),
    splitP1: Number(row[7]) || 0,
    splitP2: Number(row[8]) || 0,
    date: row[9] ? formatDate(row[9]) : '',
    notes: String(row[10] || ''),
    isSettled: Boolean(row[11]),
    createdAt: row[12] ? formatDate(row[12]) : new Date().toISOString()
  };
}

function mapExpenseToRow(item) {
  return [
    safeString(item.id, 100),
    safeString(item.bucketlistId, 100),
    safeString(item.title, 500),
    item.amount || 0,
    safeString(item.category, 100),
    safeString(item.paidBy, 50),
    safeString(item.splitType, 50),
    item.splitP1 || 0,
    item.splitP2 || 0,
    item.date || '',
    safeString(item.notes, 2000),
    item.isSettled ? true : false,
    item.createdAt || new Date().toISOString()
  ];
}

function mapRowToEvent(row) {
  return { id: String(row[0]||''), title: String(row[1]||''), type: String(row[2]||'trip'), startDate: row[3]?formatDate(row[3]):'', endDate: row[4]?formatDate(row[4]):'', color: String(row[5]||'#3B82F6'), bucketlistId: String(row[6]||''), notes: String(row[7]||''), createdAt: row[8]?formatDate(row[8]):new Date().toISOString() };
}

function mapEventToRow(item) {
  return [
    safeString(item.id, 100),
    safeString(item.title, 500),
    safeString(item.type, 50),
    item.startDate || '',
    item.endDate || '',
    safeString(item.color, 50),
    safeString(item.bucketlistId, 100),
    safeString(item.notes, 2000),
    item.createdAt || new Date().toISOString()
  ];
}

function formatDate(val) {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString().split('T')[0];
  return String(val);
}

function parseJsonSafe(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch (e) { return fallback; }
}
