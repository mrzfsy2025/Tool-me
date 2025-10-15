// File: server.js
// Ini adalah backend proxy "sopan" kita

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 8080; // Kita akan jalankan server di port 3000

// Sajikan file statis (index.html dan scraper.js) dari folder publik
app.use(express.static(path.join(__dirname, 'public')));


// Ini adalah endpoint proxy yang akan dipanggil oleh scraper.js
app.get('/api/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send({ message: 'URL target diperlukan' });
    }

    console.log(`Menerima permintaan proxy untuk: ${targetUrl}`);

    try {
        // Ekstrak domain utama untuk digunakan sebagai Referer
        const urlObject = new URL(targetUrl);
        const referer = urlObject.origin; // Contoh: https://www.nama-situs.com

        // Di sinilah "kesopanan" terjadi! Kita atur headers-nya.
        const response = await axios.get(targetUrl, {
            headers: {
                // Mengaku sebagai browser Chrome di Windows
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                // Memberitahu kita datang dari halaman utama situs itu sendiri
                'Referer': referer,
                // Header tambahan agar terlihat lebih natural
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
            }
        });

        // Kirim kembali HTML yang didapat ke frontend (scraper.js)
        res.send(response.data);

    } catch (error) {
        console.error('Kesalahan pada proxy:', error.message);
        res.status(500).send({ message: `Gagal mengambil data dari server tujuan: ${error.message}` });
    }
});


// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server proxy berjalan di http://localhost:${PORT}`);
    console.log('Buka browser dan akses halaman utama untuk memulai scraping.');
});