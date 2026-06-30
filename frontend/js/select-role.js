const API_URL = 'http://localhost:3000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  if (!token || roles.length === 0) {
    // Belum login, lempar ke halaman login
    window.location.href = 'login.html';
    return;
  }

  const roleButtonsContainer = document.getElementById('roleButtons');

  // Bikin 1 button untuk tiap role yang dimiliki user
  roleButtonsContainer.innerHTML = roles.map(role => `
    <button onclick="selectRole('${role}')" style="margin-bottom: 0.7rem;">
      Masuk sebagai ${role}
    </button>
  `).join('');
});

async function selectRole(role) {
  const token = localStorage.getItem('token');
  const errorMsg = document.getElementById('errorMsg');

  try {
    const response = await fetch(`${API_URL}/select-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, activeRole: role })
    });

    const data = await response.json();

    if (!response.ok) {
      errorMsg.textContent = data.error || 'Gagal memilih role';
      return;
    }

    // Simpan token baru (yang sudah ada activeRole-nya) dan activeRole
    localStorage.setItem('token', data.token);
    localStorage.setItem('activeRole', data.activeRole);

    // Arahkan ke dashboard sesuai role
    window.location.href = `dashboard-${role.toLowerCase()}.html`;

  } catch (err) {
    errorMsg.textContent = 'Tidak bisa terhubung ke server';
  }
}