const REVIEW_API_URL = 'http://localhost:3000/api/reviews';

// Submit review baru
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewName').value;
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value;
    const errorMsg = document.getElementById('reviewErrorMsg');

    try {
      const response = await fetch(REVIEW_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment })
      });

      const data = await response.json();

      if (!response.ok) {
        errorMsg.textContent = data.error || 'Gagal mengirim review';
        return;
      }

      // Reset form & reload daftar review
      reviewForm.reset();
      errorMsg.textContent = '';
      loadReviews();

    } catch (err) {
      errorMsg.textContent = 'Tidak bisa terhubung ke server';
    }
  });
}

// Ambil & tampilkan semua review
async function loadReviews() {
  const reviewList = document.getElementById('reviewList');
  if (!reviewList) return;

  try {
    const response = await fetch(REVIEW_API_URL);
    const reviews = await response.json();

    if (reviews.length === 0) {
      reviewList.innerHTML = '<p>Belum ada review. Jadilah yang pertama!</p>';
      return;
    }

    reviewList.innerHTML = reviews.map(review => `
      <div class="review-card">
        <div class="review-header">
          <span class="review-name">${review.name}</span>
          <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
        </div>
        <p>${review.comment}</p>
      </div>
    `).join('');

  } catch (err) {
    reviewList.innerHTML = '<p>Gagal memuat review.</p>';
  }
}

// Load review saat halaman dibuka
document.addEventListener('DOMContentLoaded', loadReviews);