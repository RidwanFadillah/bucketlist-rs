const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const localDb = require('../services/localDbService');
const googleSheetsService = require('../services/googleSheetsService');

// Helper: Sinkronisasi agenda kalender dari item bucketlist
function syncBucketlistToCalendar(item) {
  const events = localDb.getEvents();
  const existingEvent = events.find(ev => ev.bucketlistId === item.id);

  if (item.targetDate) {
    const eventData = {
      title: `Trip ${item.title} ✈️`,
      type: 'trip',
      startDate: item.targetDate,
      endDate: item.targetDate,
      color: item.status === 'visited' ? '#10B981' : item.status === 'planned' ? '#0EA5E9' : '#F59E0B',
      bucketlistId: item.id,
      notes: `Agenda destinasi: ${item.location || item.title} (Status: ${item.status === 'visited' ? 'Tercapai 🎉' : item.status === 'planned' ? 'Terencana' : 'Impian'})`
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
    // Jika targetDate dihapus, hapus juga event terkait
    localDb.deleteEventItem(existingEvent.id);
  }
}

// GET all bucketlist items
router.get('/', (req, res) => {
  try {
    const items = localDb.getBucketlist();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create bucketlist item
router.post('/', (req, res) => {
  try {
    const {
      title,
      location,
      category,
      status,
      targetDate,
      visitDate,
      estimatedBudget,
      actualCost,
      rating,
      notes,
      images,
      checklist
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Judul destinasi wajib diisi!' });
    }

    const newItem = {
      id: `b-${uuidv4().substring(0, 8)}`,
      title: title.trim(),
      location: (location || '').trim(),
      category: category || 'Pantai & Laut',
      status: status || 'wishlist',
      targetDate: targetDate || '',
      visitDate: visitDate || '',
      estimatedBudget: Number(estimatedBudget) || 0,
      actualCost: Number(actualCost) || 0,
      rating: Number(rating) || 0,
      notes: notes || '',
      images: Array.isArray(images) ? images : (images ? [images] : []),
      checklist: Array.isArray(checklist) ? checklist : [],
      createdAt: new Date().toISOString()
    };

    const saved = localDb.addBucketlistItem(newItem);

    // Otomatis sinkronkan ke kalender jika ada tanggal
    syncBucketlistToCalendar(saved);

    googleSheetsService.triggerBackgroundSync();
    res.status(201).json({ success: true, data: saved, message: 'Destinasi impian berhasil ditambahkan!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update bucketlist item
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = localDb.updateBucketlistItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Item bucketlist tidak ditemukan' });
    }

    // Otomatis update agenda di kalender jika tanggal atau judul berubah
    syncBucketlistToCalendar(updated);

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, data: updated, message: 'Item bucketlist berhasil diperbarui!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE bucketlist item
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Hapus juga event kalender yang terhubung
    const events = localDb.getEvents();
    const connectedEvent = events.find(ev => ev.bucketlistId === id);
    if (connectedEvent) {
      localDb.deleteEventItem(connectedEvent.id);
    }

    const deleted = localDb.deleteBucketlistItem(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Item bucketlist tidak ditemukan' });
    }

    googleSheetsService.triggerBackgroundSync();
    res.json({ success: true, message: 'Destinasi berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
