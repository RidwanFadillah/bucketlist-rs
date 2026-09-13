const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const localDb = require('../services/localDbService');
const { calculateFinanceSummary } = require('../services/financeCalculator');
const googleSheetsService = require('../services/googleSheetsService');

// Multer storage for receipts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `struk-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar struk yang diperbolehkan!'));
    }
  }
});

// GET all expenses with summary
router.get('/', (req, res) => {
  try {
    const expenses = localDb.getExpenses();
    const settings = localDb.getSettings();
    const summary = calculateFinanceSummary(expenses, settings);
    res.json({ success: true, data: expenses, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upload receipt image
router.post('/upload-receipt', upload.single('receipt'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file struk yang diunggah.' });
    }
    const host = req.get('host');
    const protocol = req.protocol;
    const url = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.json({ success: true, url, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create expense
router.post('/', (req, res) => {
  try {
    const {
      bucketlistId,
      title,
      amount,
      category,
      paidBy,
      splitType,
      splitP1,
      splitP2,
      date,
      receiptImage,
      notes
    } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: 'Judul dan nominal pengeluaran wajib diisi!' });
    }

    const parsedAmount = Number(amount) || 0;
    let finalSplitP1 = 0;
    let finalSplitP2 = 0;

    if (splitType === '50-50') {
      finalSplitP1 = parsedAmount / 2;
      finalSplitP2 = parsedAmount / 2;
    } else if (splitType === '100-p1') {
      finalSplitP1 = parsedAmount;
      finalSplitP2 = 0;
    } else if (splitType === '100-p2') {
      finalSplitP1 = 0;
      finalSplitP2 = parsedAmount;
    } else if (splitType === 'custom') {
      finalSplitP1 = Number(splitP1) || 0;
      finalSplitP2 = Number(splitP2) || (parsedAmount - finalSplitP1);
    } else {
      finalSplitP1 = parsedAmount / 2;
      finalSplitP2 = parsedAmount / 2;
    }

    const newExpense = {
      id: `e-${uuidv4().substring(0, 8)}`,
      bucketlistId: bucketlistId || '',
      title: title.trim(),
      amount: parsedAmount,
      category: category || 'Lainnya',
      paidBy: paidBy || 'p1',
      splitType: splitType || '50-50',
      splitP1: finalSplitP1,
      splitP2: finalSplitP2,
      date: date || new Date().toISOString().split('T')[0],
      receiptImage: receiptImage || '',
      notes: notes || '',
      isSettled: false,
      createdAt: new Date().toISOString()
    };

    const saved = localDb.addExpenseItem(newExpense);

    // If linked to bucketlist, update actual cost of bucketlist
    if (bucketlistId) {
      const allExpenses = localDb.getExpenses();
      const linkedTotal = allExpenses
        .filter(e => e.bucketlistId === bucketlistId)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      localDb.updateBucketlistItem(bucketlistId, { actualCost: linkedTotal });
    }

    googleSheetsService.triggerBackgroundSync();
    res.status(201).json({ success: true, data: saved, message: 'Catatan pengeluaran berhasil disimpan!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST settle up (mark all active expenses as settled)
router.post('/settle', (req, res) => {
  try {
    const updated = localDb.settleExpenses();
    const settings = localDb.getSettings();
    const summary = calculateFinanceSummary(updated, settings);

    googleSheetsService.triggerBackgroundSync();
    res.json({
      success: true,
      message: '🎉 Luar biasa! Seluruh saldo pengeluaran telah berhasil ditandai Lunas (Settled)!',
      data: updated,
      summary
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update expense
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = localDb.updateExpenseItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Catatan pengeluaran tidak ditemukan' });
    }

    // Update linked bucketlist if applicable
    if (updated.bucketlistId) {
      const allExpenses = localDb.getExpenses();
      const linkedTotal = allExpenses
        .filter(e => e.bucketlistId === updated.bucketlistId)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      localDb.updateBucketlistItem(updated.bucketlistId, { actualCost: linkedTotal });
    }

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, data: updated, message: 'Pengeluaran berhasil diperbarui!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE expense
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const expenses = localDb.getExpenses();
    const target = expenses.find(e => e.id === id);
    const deleted = localDb.deleteExpenseItem(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Pengeluaran tidak ditemukan' });
    }

    if (target && target.bucketlistId) {
      const allExpenses = localDb.getExpenses();
      const linkedTotal = allExpenses
        .filter(e => e.bucketlistId === target.bucketlistId)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      localDb.updateBucketlistItem(target.bucketlistId, { actualCost: linkedTotal });
    }

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, message: 'Catatan pengeluaran berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
