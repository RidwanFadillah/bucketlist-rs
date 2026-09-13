const express = require('express');
const router = express.Router();
const localDb = require('../services/localDbService');
const googleSheetsService = require('../services/googleSheetsService');

// GET settings
router.get('/', (req, res) => {
  try {
    const settings = localDb.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update settings
router.put('/', (req, res) => {
  try {
    const updated = localDb.updateSettings(req.body);
    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, data: updated, message: 'Pengaturan profil berhasil disimpan!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
