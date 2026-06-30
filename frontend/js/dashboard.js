document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const activeRole = localStorage.getItem('activeRole');

  // Kalau belum login, tendang ke halaman login
  if (!token || !activeRole) {
    window.location.href = 'login.html';
    return;
  }

  // Tampilkan info user + role aktif di navbar
  const userInfo = document.getElementById('userInfo');
  if (userInfo) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    userInfo.textContent = `Role aktif: ${activeRole}` +
      (roles.length > 1 ? ` (punya juga: ${roles.filter(r => r !== activeRole).join(', ')})` : '');
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
  localStorage.removeItem('activeRole');
  window.location.href = 'login.html';
}