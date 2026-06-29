const express = require('express');
const cors = require('cors');

const db = require('./db/database');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());           // biar frontend (file HTML) bisa akses backend
app.use(express.json());  // biar server bisa baca body JSON dari request

// Route tes sederhana
app.get('/', (req, res) => {
    res.json({ message: 'SEAPEDIA backend jalan!' });
});

app.use('/api/auth', authRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});