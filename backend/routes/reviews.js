const express = require('express');
const db = require('../db/database');

const router = express.Router();

// POST - tambah review baru
router.post('/', (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ error: 'Nama, rating, dan komentar wajib diisi' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating harus antara 1-5' });
  }

  try {
    const insert = db.prepare('INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)');
    const result = insert.run(name, rating, comment);

    res.status(201).json({ message: 'Review berhasil dikirim', reviewId: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET - ambil semua review (untuk ditampilkan di landing page)
router.get('/', (req, res) => {
  try {
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;