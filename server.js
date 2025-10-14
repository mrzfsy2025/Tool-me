// server.js
const express = require('express');
const app = express();
const PORT = 8080;

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Parameter "url" dibutuhkan.');
    }

    // Blok try...catch yang baru ada di sini
    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // INI BAGIAN PENTING YANG DITAMBAHKAN UNTUK DEBUGGING
        console.log('--- HTML Mentah yang Diterima Server ---');
        console.log(response.data.substring(0, 1000)); // Tampilkan 1000 karakter pertama
        console.log('------------------------------------');

        res.send(response.data);

    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).send(`Gagal mengambil data dari URL: ${error.message}`);
    }
});

// Baris ini adalah satu-satunya 'pekerjaan' server:
// Menyajikan semua file yang ada di dalam folder ini (index.html, scraper.js, dll).
app.use(express.static('.'));
// Menjalankan server agar bisa diakses
app.listen(PORT, () => {
    console.log(`🚀 Server minimal berjalan di http://localhost:${PORT}`);
});