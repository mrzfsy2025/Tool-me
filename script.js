// File: script.js

// Tunggu sampai semua elemen halaman dimuat.
document.addEventListener('DOMContentLoaded', () => {
  // Ambil elemen-elemen penting dari halaman HTML.
  const form = document.getElementById('scraper-form'); // Pastikan form Anda punya id="scraper-form"
  const urlInput = document.getElementById('url-input'); // Pastikan input URL punya id="url-input"
  const resultContainer = document.getElementById('result-container'); // Siapkan div untuk hasil
  const errorContainer = document.getElementById('error-container'); // Siapkan div untuk pesan error

  // Tambahkan event listener saat form disubmit.
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Mencegah form refresh halaman.

    // Ambil URL yang diketik pengguna.
    const targetUrl = urlInput.value;

    // Tampilkan pesan loading dan bersihkan hasil sebelumnya.
    resultContainer.innerHTML = 'Sedang memuat data...';
    errorContainer.innerHTML = '';

    // Periksa apakah URL sudah diisi.
    if (!targetUrl) {
      errorContainer.innerHTML = 'URL tidak boleh kosong!';
      resultContainer.innerHTML = '';
      return;
    }

    try {
      // Panggil backend proxy kita.
      // encodeURIComponent memastikan karakter khusus di URL aman untuk dikirim.
      const response = await fetch(`/proxy?url=${encodeURIComponent(targetUrl)}`);

      // Jika respons dari proxy tidak OK (misal: error 404 atau 500).
      if (!response.ok) {
        // Ambil pesan error dari JSON yang dikirim proxy.
        const errorData = await response.json();
        throw new Error(errorData.error || `Terjadi kesalahan: Status ${response.status}`);
      }

      // Ambil hasil HTML dari proxy.
      const htmlResult = await response.text();
      
      // Di sini kamu bisa memproses htmlResult lebih lanjut untuk mencari tabel,
      // atau menampilkannya langsung. Untuk sekarang kita tampilkan saja.
      // CATATAN: Menampilkan HTML langsung bisa berisiko keamanan (XSS).
      // Ini hanya untuk tujuan debugging.
      resultContainer.textContent = htmlResult; 
      // Untuk menampilkan HTML (berisiko): resultContainer.innerHTML = htmlResult;

    } catch (error) {
      // Tangkap dan tampilkan pesan error jika terjadi masalah.
      console.error('Error:', error);
      errorContainer.innerHTML = `Gagal: ${error.message}`;
      resultContainer.innerHTML = '';
    }
  });
});