// File: api/proxy.js

// Handler ini adalah format default untuk Vercel Serverless Function.
export default async function handler(request, response) {
  // Ambil URL target dari query parameter 'url'.
  const targetUrl = request.query.url;

  // Jika tidak ada URL yang diberikan, kirim error.
  if (!targetUrl) {
    return response.status(400).json({ error: 'URL target diperlukan' });
  }

  try {
    // Lakukan fetch ke URL target dari sisi server.
    const fetchResponse = await fetch(targetUrl, {
      headers: {
        // Beberapa situs memerlukan User-Agent browser asli untuk merespons.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Jika fetch gagal (misal: situs tidak ditemukan), teruskan status error.
    if (!fetchResponse.ok) {
      return response.status(fetchResponse.status).json({ error: `Gagal mengambil data, status: ${fetchResponse.status}` });
    }

    // Ambil konten halaman sebagai teks (HTML).
    const data = await fetchResponse.text();

    // Kirim kembali konten HTML ke frontend.
    response.status(200).send(data);
    
  } catch (error) {
    // Jika ada error lain (misal: masalah jaringan), kirim status 500.
    console.error('Error di proxy:', error);
    response.status(500).json({ error: 'Terjadi kesalahan pada server proxy.' });
  }
}