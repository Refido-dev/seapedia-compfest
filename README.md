# SEAPEDIA

Marketplace multi-role (Admin, Seller, Buyer, Driver) — submission untuk **Software Engineering Academy COMPFEST 18**.

**Level yang diklaim: Level 1 — Foundation & Public Access**

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla, tanpa framework)
- **Backend**: Node.js + Express
- **Database**: SQLite (`better-sqlite3`)
- **Auth**: bcryptjs (password hashing) + jsonwebtoken (JWT)

---

## Cara Setup & Menjalankan

### 1. Clone repository

```bash
git clone https://github.com/Refido-dev/seapedia-compfest.git
cd seapedia-compfest
```

### 2. Setup Backend

```bash
cd backend
npm install
node server.js
```

Server akan berjalan di `http://localhost:3000`.

Database SQLite (`database.db`) akan otomatis dibuat saat pertama kali server dijalankan, lengkap dengan semua tabel yang dibutuhkan (`users`, `user_roles`, `reviews`).

### 3. Jalankan Frontend

Tidak perlu instalasi tambahan. Buka file `frontend/index.html` langsung menggunakan browser, atau gunakan extension **Live Server** di VSCode untuk pengalaman yang lebih baik.

> Pastikan backend (`node server.js`) tetap berjalan saat mengakses frontend, karena semua fitur auth dan review terhubung ke backend.

### Environment Variables

Saat ini project belum menggunakan file `.env` — konfigurasi seperti `JWT_SECRET` dan `PORT` masih di-hardcode langsung di `backend/routes/auth.js` dan `backend/server.js` untuk kebutuhan development. Tidak ada environment variable wajib yang perlu diset manual untuk menjalankan project ini.

---

## Demo Accounts (Seed Data)

Karena belum ada seeder otomatis, berikut akun yang sudah terdaftar di database dan bisa langsung dipakai untuk testing. Reviewer juga bisa mendaftar akun baru sendiri lewat halaman Register.

| Username | Password | Role(s) |
|---|---|---|
| `admin` | `admin123` | Admin |
| `buyer1` | `password123` | Buyer |
| `multirole1` | `password123` | Buyer, Seller |

### Cara membuat akun Admin

Role **Admin sengaja tidak ditampilkan sebagai pilihan di form Register publik** untuk alasan keamanan dasar. Untuk membuat akun Admin baru, gunakan endpoint API secara langsung (lihat dokumentasi API di bawah), contoh menggunakan Thunder Client/Postman:

```
POST http://localhost:3000/api/auth/register
Body:
{
  "username": "admin_baru",
  "password": "password_aman",
  "roles": ["Admin"]
}
```

---

## Struktur Folder

```
seapedia/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── db/
│   │   ├── database.js       # koneksi & skema tabel
│   │   └── database.db       # file database (auto-generated)
│   └── routes/
│       ├── auth.js           # register, login, select-role
│       └── reviews.js        # public application reviews
└── frontend/
    ├── index.html            # landing page + featured products + reviews
    ├── products.html         # katalog produk (dummy data)
    ├── product-detail.html
    ├── login.html
    ├── register.html
    ├── select-role.html      # muncul jika user punya >1 role
    ├── dashboard-buyer.html
    ├── dashboard-seller.html
    ├── dashboard-driver.html
    ├── dashboard-admin.html
    ├── css/
    │   └── style.css
    └── js/
        ├── auth.js
        ├── select-role.js
        ├── dashboard.js
        ├── main.js
        ├── reviews.js
        └── dummy-products.js
```

---

## Fitur yang Sudah Diimplementasikan (Level 1)

- **Public Marketplace Interface**: landing page, katalog produk, dan detail produk yang bisa diakses tanpa login (menggunakan dummy data, karena Product Management baru masuk di Level 2).
- **Authentication & Role Awareness**:
  - Register dengan password hashing (bcrypt) dan dukungan multi-role (1 username bisa punya lebih dari 1 role non-Admin).
  - Login dengan JWT token.
  - Jika user memiliki lebih dari 1 role, sistem akan mengarahkan ke halaman pemilihan role aktif setelah login.
  - Token JWT menyimpan `activeRole` yang digunakan untuk otorisasi.
- **Public Application Reviews**: guest maupun user login bisa mengirim review tentang pengalaman menggunakan aplikasi (bukan review produk), disimpan permanen di database.
- **Reusable UI Foundation**: struktur navbar, card, dan dashboard shell konsisten di seluruh halaman, dengan desain responsive.

## Catatan Keterbatasan

Submission ini berhenti di Level 1 sesuai dengan opsi yang diperbolehkan pada aturan penilaian ("Participants may stop at any level"). Dashboard untuk role Seller, Driver, dan Admin saat ini masih berupa shell/placeholder, karena fitur-fitur di dalamnya (manajemen toko, produk, order, dsb.) merupakan bagian dari Level 2 ke atas yang belum dikerjakan pada submission ini.

---

## Dokumentasi API

Base URL: `http://localhost:3000`

### Auth

#### `POST /api/auth/register`
Mendaftarkan user baru.

**Body:**
```json
{
  "username": "string",
  "password": "string",
  "roles": ["Buyer"]
}
```
*`roles` adalah array, bisa berisi lebih dari 1 nilai: `Buyer`, `Seller`, `Driver`, atau `Admin`.*

**Response sukses (201):**
```json
{ "message": "Registrasi berhasil", "userId": 1 }
```

**Response gagal (400/409):**
```json
{ "error": "Username sudah dipakai" }
```

---

#### `POST /api/auth/login`
Login dan mendapatkan JWT token berisi seluruh role yang dimiliki user.

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response sukses (200):**
```json
{
  "message": "Login berhasil",
  "token": "ey...",
  "roles": ["Buyer", "Seller"]
}
```

**Response gagal (401):**
```json
{ "error": "Username atau password salah" }
```

---

#### `POST /api/auth/select-role`
Memilih role aktif untuk sesi saat ini. Wajib dipanggil jika user memiliki lebih dari 1 role.

**Body:**
```json
{
  "token": "token hasil login",
  "activeRole": "Seller"
}
```

**Response sukses (200):**
```json
{
  "message": "Role aktif berhasil dipilih",
  "token": "token baru dengan field activeRole",
  "activeRole": "Seller"
}
```

**Response gagal (403):**
```json
{ "error": "Role ini bukan milik user" }
```

---

### Reviews

#### `POST /api/reviews`
Mengirim review publik tentang pengalaman menggunakan aplikasi. Tidak memerlukan autentikasi.

**Body:**
```json
{
  "name": "string",
  "rating": 5,
  "comment": "string"
}
```
*`rating` harus berupa angka 1–5.*

**Response sukses (201):**
```json
{ "message": "Review berhasil dikirim", "reviewId": 1 }
```

---

#### `GET /api/reviews`
Mengambil seluruh review yang pernah dikirim, diurutkan dari yang terbaru.

**Response sukses (200):**
```json
[
  {
    "id": 1,
    "name": "Budi",
    "rating": 5,
    "comment": "Aplikasinya enak dipakai!",
    "created_at": "2026-06-30 10:00:00"
  }
]
```

---

## Author

Muhammad Egbert Refido Hermawan
D3 Teknik Informatika, Politeknik Elektronika Negeri Surabaya (PENS)
