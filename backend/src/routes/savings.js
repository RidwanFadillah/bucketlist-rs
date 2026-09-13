const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const localDb = require('../services/localDbService');
const googleSheetsService = require('../services/googleSheetsService');

// Helper: Sinkronisasi target tabungan ke kalender
function syncSavingsToCalendar(goal) {
  const events = localDb.getEvents();
  const existingEvent = events.find(ev => ev.savingsGoalId === goal.id);

  if (goal.targetDate) {
    const eventData = {
      title: `Target Tabungan: ${goal.title} 💰`,
      type: 'deadline',
      startDate: goal.targetDate,
      endDate: goal.targetDate,
      color: goal.color || '#0EA5E9',
      savingsGoalId: goal.id,
      notes: `Target terkumpul: Rp ${Number(goal.targetAmount || 0).toLocaleString('id-ID')}`
    };

    if (existingEvent) {
      localDb.updateEventItem(existingEvent.id, eventData);
    } else {
      localDb.addEventItem({
        id: `ev-${uuidv4().substring(0, 8)}`,
        ...eventData,
        createdAt: new Date().toISOString()
      });
    }
  } else if (existingEvent) {
    localDb.deleteEventItem(existingEvent.id);
  }
}

// Calculate savings summary stats
function computeSavingsSummary(savings = [], settings = {}) {
  const p1 = settings.p1Name || 'Orang 1';
  const p2 = settings.p2Name || 'Princess';

  let totalTarget = 0;
  let totalSaved = 0;
  let totalSavedP1 = 0;
  let totalSavedP2 = 0;

  savings.forEach(goal => {
    totalTarget += Number(goal.targetAmount) || 0;
    (goal.deposits || []).forEach(dep => {
      const amt = Number(dep.amount) || 0;
      totalSaved += amt;
      if (dep.saver === 'p1') {
        totalSavedP1 += amt;
      } else if (dep.saver === 'p2') {
        totalSavedP2 += amt;
      } else if (dep.saver === 'both') {
        totalSavedP1 += amt / 2;
        totalSavedP2 += amt / 2;
      }
    });
  });

  const percentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const remaining = Math.max(0, totalTarget - totalSaved);

  return {
    totalTarget,
    totalSaved,
    totalSavedP1,
    totalSavedP2,
    percentage,
    remaining,
    p1Name: p1,
    p2Name: p2
  };
}

// GET all savings goals with stats
router.get('/', (req, res) => {
  try {
    const savings = localDb.getSavings();
    const settings = localDb.getSettings();
    const summary = computeSavingsSummary(savings, settings);
    res.json({ success: true, data: savings, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create savings goal
router.post('/', (req, res) => {
  try {
    const { title, targetAmount, targetDate, category, bucketlistId, notes, color } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({ success: false, message: 'Judul target tabungan dan nominal target wajib diisi!' });
    }

    const newGoal = {
      id: `s-${uuidv4().substring(0, 8)}`,
      title: title.trim(),
      targetAmount: Number(targetAmount) || 0,
      targetDate: targetDate || '',
      category: category || 'Liburan & Trip',
      bucketlistId: bucketlistId || '',
      color: color || '#10B981',
      notes: notes || '',
      deposits: [],
      createdAt: new Date().toISOString()
    };

    const saved = localDb.addSavingsGoal(newGoal);

    // Otomatis sinkronkan target tanggal tabungan ke kalender
    syncSavingsToCalendar(saved);

    googleSheetsService.triggerBackgroundSync();
    res.status(201).json({ success: true, data: saved, message: 'Target tabungan bersama berhasil dibuat!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add deposit to a savings goal
router.post('/:id/deposits', (req, res) => {
  try {
    const { id } = req.params;
    const { saver, amount, date, notes } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Nominal setoran tabungan wajib diisi!' });
    }

    const newDeposit = {
      id: `dep-${uuidv4().substring(0, 8)}`,
      saver: saver || 'p1',
      amount: Number(amount) || 0,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    const updatedGoal = localDb.addSavingsDeposit(id, newDeposit);
    if (!updatedGoal) {
      return res.status(404).json({ success: false, message: 'Target tabungan tidak ditemukan.' });
    }

    googleSheetsService.triggerBackgroundSync();
    res.status(201).json({ success: true, data: updatedGoal, message: 'Setoran tabungan berhasil dicatat! 👑' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE deposit from savings goal
router.delete('/:id/deposits/:depositId', (req, res) => {
  try {
    const { id, depositId } = req.params;
    const updated = localDb.deleteSavingsDeposit(id, depositId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Target tabungan atau setoran tidak ditemukan.' });
    }

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, data: updated, message: 'Riwayat setoran tabungan berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update savings goal
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = localDb.updateSavingsGoal(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Target tabungan tidak ditemukan.' });
    }

    // Update target date di kalender
    syncSavingsToCalendar(updated);

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, data: updated, message: 'Target tabungan berhasil diperbarui!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE savings goal
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Hapus juga event kalender terkait
    const events = localDb.getEvents();
    const connectedEvent = events.find(ev => ev.savingsGoalId === id);
    if (connectedEvent) {
      localDb.deleteEventItem(connectedEvent.id);
    }

    const deleted = localDb.deleteSavingsGoal(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Target tabungan tidak ditemukan.' });
    }

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, message: 'Target tabungan berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
