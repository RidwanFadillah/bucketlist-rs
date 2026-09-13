const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const localDb = require('../services/localDbService');
const googleSheetsService = require('../services/googleSheetsService');

// GET all calendar events
router.get('/', (req, res) => {
  try {
    const events = localDb.getEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create event
router.post('/', (req, res) => {
  try {
    const { title, type, startDate, endDate, color, bucketlistId, notes } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ success: false, message: 'Judul dan tanggal mulai wajib diisi!' });
    }

    const newEvent = {
      id: `ev-${uuidv4().substring(0, 8)}`,
      title: title.trim(),
      type: type || 'trip',
      startDate: startDate,
      endDate: endDate || startDate,
      color: color || '#3B82F6',
      bucketlistId: bucketlistId || '',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    const saved = localDb.addEventItem(newEvent);
    googleSheetsService.triggerBackgroundSync();
    res.status(201).json({ success: true, data: saved, message: 'Agenda kalender berhasil ditambahkan!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update event
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = localDb.updateEventItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Agenda kalender tidak ditemukan' });
    }

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, data: updated, message: 'Agenda kalender berhasil diperbarui!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE event
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = localDb.deleteEventItem(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Agenda kalender tidak ditemukan' });
    }

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, message: 'Agenda kalender berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
