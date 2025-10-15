// Anda perlu menginstal puppeteer terlebih dahulu: npm install puppeteer
import puppeteer from 'puppeteer';
import 'dotenv/config';

async function scrapeDataPresensi() {
  // 1. Luncurkan browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 2. Buka halaman login
  const loginUrl = 'https://sistem-presensi-guru-production-3d6d.up.railway.app/';
  await page.goto(loginUrl);

  // 3. Cari form, isi username dan password, lalu klik login
  // PENTING: '#username', '#password', dan '#login-button' harus diganti
  // dengan selector CSS yang sebenarnya dari form login Anda.
  // ...
await page.goto(loginUrl);
console.log("Berhasil membuka halaman login.");

await page.type('#email', 'USERNAME_LOGIN');
console.log("Berhasil mengisi username.");
// await page.type('.form-input login-field', 'USERNAME_LOGIN');

await page.type('#guru_id', 'PASSWORD_LOGIN');
console.log("Berhasil mengisi password.");

await page.click('#tombol_login_yang_benar');
console.log("Berhasil menekan tombol login.");
  // 4. Tunggu sampai halaman dashboard (setelah login) termuat
  await page.waitForNavigation();
  console.log('Login berhasil! Sekarang berada di halaman dashboard.');
  // 5. Ambil konten halaman setelah login
  const content = await page.content(); // Ini adalah HTML dari halaman dashboard
  // 6. Dari sini, Anda bisa memproses 'content' untuk mencari tabel,
  // sama seperti yang kita lakukan di scraper sebelumnya.
  console.log('Mulai mencari tabel di halaman dashboard...');
  // 7. Tutup browser setelah selesai
  await browser.close();
}

scrapeDataPresensi();