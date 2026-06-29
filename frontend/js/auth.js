const API_URL = 'http://localhost:3000/api/auth';

// Handle Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Ambil semua checkbox role yang dicentang
    const checkedRoles = document.querySelectorAll('input[name="role"]:checked');
    const roles = Array.from(checkedRoles).map(cb => cb.value);

    const errorMsg = document.getElementById('errorMsg');

    if (roles.length === 0) {
      errorMsg.textContent = 'Pilih minimal 1 role';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, roles })
      });

      const data = await response.json();

      if (!response.ok) {
        errorMsg.textContent = data.error || 'Terjadi kesalahan';
        return;
      }

      alert('Registrasi berhasil! Silakan login.');
      window.location.href = 'login.html';

    } catch (err) {
      errorMsg.textContent = 'Tidak bisa terhubung ke server';
    }
  });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        errorMsg.textContent = data.error || 'Login gagal';
        return;
      }

      // Simpan token & roles di localStorage (sementara, biar persist antar halaman)
      localStorage.setItem('token', data.token);
      localStorage.setItem('roles', JSON.stringify(data.roles));

      alert('Login berhasil!');
      // Nanti diarahkan ke halaman pilih role aktif (kita bikin setelah ini)
      window.location.href = 'index.html';

    } catch (err) {
      errorMsg.textContent = 'Tidak bisa terhubung ke server';
    }
  });
}