// Fungsi utama untuk mengambil HTML dengan metode yang bisa dipilih
async function fetchHtml(url, method) {
    let requestUrl;

    switch (method) {
        case 'DIRECT':
            // Metode Langsung: Tanpa perantara. Akan gagal jika server tujuan tidak mengizinkan CORS.
            requestUrl = url;
            console.log("Mencoba koneksi langsung...");
            break;

        case 'SERVER_PROXY':
            // Metode Proxy Server Sendiri: Meminta ke backend kita sendiri.
            // PENTING: Anda harus punya server backend yang berjalan di '/proxy'
            requestUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
            console.log("Mencoba via proxy server sendiri...");
            break;

        case 'CORS_PROXY':
        default:
            // Metode Proxy Publik: Pilihan default yang paling fleksibel untuk testing.
            requestUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            console.log("Mencoba via proxy publik...");
            break;
    }

    const response = await fetch(requestUrl);
    if (!response.ok) {
        throw new Error(`Gagal mengambil data, status: ${response.status}`);
    }
    return await response.text();
}


document.getElementById('scrapeBtn').addEventListener('click', async () => {
    // Ambil semua input dari pengguna
    const targetUrl = document.getElementById('urlInput').value;
    const method = document.getElementById('fetchMethod').value;
    const keyword = document.getElementById('keywordInput').value.toLowerCase();
    const columnCount = parseInt(document.getElementById('columnCountInput').value, 10);
    const fileName = document.getElementById('fileNameInput').value || 'data-hasil-scrape';

    const statusEl = document.getElementById('status');
    const previewEl = document.getElementById('previewContainer');

    // Reset tampilan
    statusEl.innerHTML = '';
    statusEl.className = '';
    previewEl.style.display = 'none';

    if (!targetUrl) {
        updateStatus('URL tidak boleh kosong!', 'error');
        return;
    }

    updateStatus(`Mencari data dengan metode: ${method}...`, 'info');

    try {
        // Panggil fungsi fetchHtml yang sudah kita buat
        const html = await fetchHtml(targetUrl, method);

        // --- Mulai dari sini, sisa kodenya SAMA PERSIS seperti sebelumnya ---
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const allTables = doc.querySelectorAll('table');

        if (allTables.length === 0) {
            updateStatus('Tidak ada tabel sama sekali di dalam URL tersebut.', 'error');
            return;
        }

        const filteredTables = Array.from(allTables).filter(table => {
            let keywordMatch = true;
            let columnMatch = true;
            if (keyword) {
                keywordMatch = table.innerText.toLowerCase().includes(keyword);
            }
            if (!isNaN(columnCount) && columnCount > 0) {
                const firstRow = table.querySelector('tr');
                columnMatch = firstRow ? (firstRow.querySelectorAll('th, td').length === columnCount) : false;
            }
            return keywordMatch && columnMatch;
        });

        if (filteredTables.length === 0) {
            updateStatus('Tabel/Database dengan kriteria yang Anda cari tidak ditemukan.', 'error');
            return;
        }

        const targetTable = filteredTables[0];
        updateStatus(`Sukses! ${filteredTables.length} tabel ditemukan. Memproses tabel pertama...`, 'success');
        processAndDownload(targetTable, fileName);

    } catch (error) {
        updateStatus(`Terjadi kesalahan: ${error.message}. Coba ganti metode koneksi atau cek URL.`, 'error');
        console.error(error);
    }
});

// --- Fungsi processAndDownload dan updateStatus tetap SAMA PERSIS ---
function processAndDownload(table, fileName) {
    let data = [];
    const rows = table.querySelectorAll('tr');
    const previewEl = document.getElementById('previewContainer');
    previewEl.style.display = 'block';
    previewEl.innerText = table.innerText;

    rows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('th, td');
        cells.forEach(cell => {
            let cellText = cell.innerText.trim().replace(/"/g, '""');
            if (cellText.includes(',')) {
                cellText = `"${cellText}"`;
            }
            rowData.push(cellText);
        });
        data.push(rowData.join(','));
    });

    const csvContent = data.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status-${type}`;
}