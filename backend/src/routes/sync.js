const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const localDb = require('../services/localDbService');
const googleSheetsService = require('../services/googleSheetsService');

// GET Google Apps Script template code
router.get('/script-code', (req, res) => {
  try {
    const scriptPath = path.join(__dirname, '../../google-apps-script/Code.js');
    if (fs.existsSync(scriptPath)) {
      const code = fs.readFileSync(scriptPath, 'utf-8');
      res.json({ success: true, code });
    } else {
      res.status(404).json({ success: false, message: 'File template Apps Script tidak ditemukan.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST test connection to Google Sheets
router.post('/test-connection', async (req, res) => {
  try {
    const { url } = req.body;
    const result = await googleSheetsService.testConnection(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST sync local database to Google Sheets
router.post('/sync-to-sheet', async (req, res) => {
  try {
    const result = await googleSheetsService.syncToGoogleSheets();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST sync from Google Sheets to local database
router.post('/sync-from-sheet', async (req, res) => {
  try {
    const result = await googleSheetsService.syncFromGoogleSheets();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET status
router.get('/status', (req, res) => {
  try {
    const settings = localDb.getSettings();
    const isConfigured = googleSheetsService.isConfigured();
    res.json({
      success: true,
      isConfigured,
      googleSheetUrl: settings.googleSheetUrl || '',
      lastSyncedAt: settings.lastSyncedAt || null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET export backup JSON
router.get('/export-backup', (req, res) => {
  try {
    const db = localDb.readDb();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=bucketlist_backup_${Date.now()}.json`);
    res.send(JSON.stringify(db, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
