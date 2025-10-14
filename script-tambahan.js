// Di dalam file server.js, di dalam rute /proxy
{try {
    const response = await axios.get(targetUrl, { /* ... headers ... */ });
    
    // TAMBAHKAN BARIS INI:
    console.log('--- HTML Mentah yang Diterima Server ---');
    console.log(response.data.substring(0, 1000)); // Tampilkan 1000 karakter pertama
    console.log('------------------------------------');

    res.send(response.data);
} catch (error) {//--