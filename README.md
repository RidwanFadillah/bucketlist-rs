# ✈️ DuoVenture - Travel Bucketlist & Catatan Keuangan 2 Orang

Aplikasi Web Interaktif modern untuk 2 orang (pasangan/sahabat) dalam merencanakan impian perjalanan (**Bucketlist**), mengelola keuangan bersama secara adil dan transparan (**Shared Expense & Split Bill**), serta menandai tanggal-tanggal penting / hitung mundur perjalanan (**Live Countdown & Calendar**) yang terintegrasi dengan **Google Sheets (Online Cloud Spreadsheet)**.

---

## 🌟 Fitur Utama

1. **🗺️ Travel Bucketlist Interaktif**
   - Kategori: Pantai & Laut, Gunung & Alam, Kota & Budaya, Kuliner, Staycation & Relaksasi, Internasional.
   - Status Perjalanan: *Impian (Wishlist)* $\rightarrow$ *Terencana (Planned)* $\rightarrow$ *Tercapai (Visited 🎉)* dengan efek selebrasi konfeti!
   - Galeri multi-foto destinasi dengan fitur zoom Lightbox.
   - Checklist to-do aktivitas seru di tempat wisata.
   - Kolom catatan kenangan & rating 5 bintang.

2. **💰 Catatan Keuangan 2 Orang (Split Bill & Settlement)**
   - Kustomisasi nama profil 2 orang (misal: **Ridwan** & **Partner**).
   - Opsi pembayaran (*Dibayar oleh siapa*) dan metode pembagian (*50:50, 100% P1, 100% P2, atau Kustom nominal*).
   - **Kalkulator Pelunasan (Settlement) Real-time**: Menghitung secara otomatis siapa yang berhutang ke siapa dan berapa nominalnya.
   - Tombol **Settle Up / Tandai Lunas** dengan 1 klik.
   - Grafik visual: *Pie Chart* pengeluaran per kategori & *Bar Chart* perbandingan siapa yang paling banyak mengeluarkan uang.
   - Upload dan preview foto struk belanja / bukti transfer.

3. **📅 Penanda Tanggal & Kalender Interaktif**
   - Widget **Live Countdown**: Hitung mundur hari, jam, menit, dan detik menuju liburan berikutnya.
   - Kalender bulanan interaktif dengan penanda warna (*color-coded*) untuk jadwal penerbangan, hotel, batas nabung, dan anniversary.
   - Klik langsung pada tanggal di kalender untuk menambahkan agenda baru.

4. **📊 Integrasi Database Google Sheets Online**
   - Seluruh data bucketlist, transaksi keuangan, agenda kalender, dan profil dapat langsung tersimpan di Google Spreadsheet Anda di Google Drive.
   - **Penanganan Gambar**: Foto destinasi & struk disimpan rapi di server/cloud dan link URL-nya otomatis tercatat di Google Sheets. Anda bahkan bisa membuka Google Sheets dan melihat foto secara visual!
   - Fitur Backup: Tombol ekspor cadangan data JSON kapan saja.

---

## 🚀 Cara Menjalankan Aplikasi

### Cara Cepat (1-Klik di Windows):
Cukup klik ganda file `start.bat` yang ada di folder project.

### Cara Manual lewat Terminal:
1. **Jalankan Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *(Backend akan berjalan di `http://localhost:5000`)*

2. **Jalankan Frontend Web**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Buka browser di `http://localhost:3000` atau URL yang tampil di terminal)*

---

## 📑 Panduan Singkat Menghubungkan Google Sheets (2 Menit)

1. Buka [sheets.new](https://sheets.new) di browser Anda untuk membuat Google Spreadsheet baru.
2. Klik menu **Extensions (Ekstensi)** $\rightarrow$ **Apps Script**.
3. Di dalam aplikasi DuoVenture, klik tombol **"Hubungkan Spreadsheet"** di kanan atas $\rightarrow$ klik **"Salin Skrip Google Apps Script"**.
4. Tempel (*paste*) kodenya di Apps Script, lalu klik tombol **Deploy (Terapkan)** $\rightarrow$ **New deployment (Penerapan baru)** $\rightarrow$ pilih **Web app**.
   - Execute as: **Me (email Anda)**
   - Who has access: **Anyone (Siapa saja)**
5. Salin **Web app URL** yang muncul dan tempelkan ke form di aplikasi DuoVenture. Selesai! 🎉
