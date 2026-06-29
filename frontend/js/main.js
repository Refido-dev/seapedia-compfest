// Render grid produk (dipakai di index.html dan products.html)
function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = dummyProducts.map(product => `
    <div class="product-card" onclick="goToDetail(${product.id})">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-card-info">
        <h3>${product.name}</h3>
        <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
        <p class="store">${product.storeName}</p>
      </div>
    </div>
  `).join('');
}

// Pindah ke halaman detail produk
function goToDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

// Render halaman detail produk
function renderProductDetail() {
  const container = document.getElementById('productDetail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const product = dummyProducts.find(p => p.id === productId);

  if (!product) {
    container.innerHTML = '<p>Produk tidak ditemukan.</p>';
    return;
  }

  container.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h1>${product.name}</h1>
    <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
    <p class="store">Dijual oleh: ${product.storeName}</p>
    <p>${product.description}</p>
  `;
}

// Update navbar berdasarkan status login
function updateNavbar() {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');

  if (token && loginLink && registerLink) {
    loginLink.textContent = 'Dashboard';
    loginLink.href = 'index.html'; // nanti diganti ke dashboard kalau udah dibuat
    registerLink.textContent = 'Logout';
    registerLink.href = '#';
    registerLink.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      window.location.href = 'index.html';
    };
  }
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  renderProductGrid();
  renderProductDetail();
  updateNavbar();
});