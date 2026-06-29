const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();
const JWT_SECRET = 'rahasia-belajar-seapedia'; // nanti pindahin ke .env, untuk sekarang oke dulu

// REGISTER
router.post('/register', (req, res) => {
    const { username, password, roles } = req.body;
    // roles contoh: ["Buyer"] atau ["Buyer", "Seller"]

    if (!username || !password || !roles || roles.length === 0) {
        return res.status(400).json({ error: 'Username, password, dan minimal 1 role wajib diisi' });
    }

    try {
        // Hash password sebelum disimpan
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Simpan user baru
        const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const result = insertUser.run(username, hashedPassword);
        const userId = result.lastInsertRowid;

        // Simpan tiap role yang dipilih
        const insertRole = db.prepare('INSERT INTO user_roles (user_id, role) VALUES (?, ?)');
        roles.forEach(role => insertRole.run(userId, role));

        res.status(201).json({ message: 'Registrasi berhasil', userId });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Username sudah dipakai' });
        }
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// LOGIN
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    // Cari user berdasarkan username
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
        return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Cocokkan password yang diinput dengan hash di database
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Ambil semua role yang dimiliki user ini
    const roles = db.prepare('SELECT role FROM user_roles WHERE user_id = ?').all(user.id)
        .map(r => r.role);

    // Bikin token JWT (isinya: id user + daftar role yang dia punya)
    const token = jwt.sign(
        { id: user.id, username: user.username, roles },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    res.json({ message: 'Login berhasil', token, roles });
});

module.exports = router;