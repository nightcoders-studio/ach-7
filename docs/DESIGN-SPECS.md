# 🎨 Design Spec — MVP Platform Pangan Petani

> Untuk tim desain: daftar halaman, layout, dan komponen yang diperlukan untuk MVP.

---

## 📱 Platform Target
- **Mobile web** (responsif) — prioritas utama
- Desktop web — secondary
- Petani interface: font besar, tombol besar, minim step

---

## 🗺️ Site Map

```
                                ┌─────────────────────────┐
                                │   Landing / Beranda     │
                                │   (Konsumen)            │
                                └─────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │   Auth Pages     │   │  Konsumen Pages  │   │  Petani Pages    │
    │  - Login         │   │  - Home/Browse   │   │  - Dashboard     │
    │  - Register      │   │  - Detail Produk │   │  - Input Stok     │
    │  - Lupa Password │   │  - Keranjang     │   │  - Pesanan Masuk  │
    └─────────────────┘   │  - Checkout      │   │  - Detail Pesanan │
                          │  - Status Pesan  │   │  - Saldo / Tarik  │
                          │  - Riwayat       │   │  - Profil         │
                          │  - Profil Petani │   └─────────────────┘
                          └─────────────────┘           │
                                                        ▼
                                              ┌─────────────────┐
                                              │  Admin Pages     │
                                              │  - Dashboard     │
                                              │  - Verifikasi    │
                                              │  - Monitor       │
                                              │  - Sengketa      │
                                              │  - Laporan       │
                                              └─────────────────┘
```

---

## 📄 Daftar Halaman MVP

### Role: Konsumen (6 halaman)

| # | Halaman | Deskripsi | Elemen Utama |
|---|---------|-----------|--------------|
| 1 | **Beranda** | Halaman utama setelah login. Menampilkan daftar produk dari semua petani. | - Header (logo + search + cart icon + profile)<br>- Carousel/kategori (sayur, buah, beras, dll)<br>- Grid/list produk (foto, nama, harga, nama petani, rating)<br>- Filter: kategori, harga, rating |
| 2 | **Detail Produk** | Halaman detail satu produk dari petani tertentu. | - Foto produk besar + galeri<br>- Nama produk, harga/kg, stok tersedia<br>- Nama petani + foto profil + rating<br>- Tombol "Tambah ke Keranjang"<br>- Input jumlah (kg)<br>- Review dari pembeli lain |
| 3 | **Profil Petani** | Halaman profil lengkap petani. | - Foto + nama + lokasi petani<br>- Rating rata-rata<br>- Semua produk dari petani ini<br>- Review dari pembeli |
| 4 | **Keranjang** | Daftar produk yang dipilih sebelum checkout. | - List item (foto, nama, qty, subtotal)<br>- Tombol edit qty / hapus<br>- Ringkasan total<br>- Tombol "Checkout" |
| 5 | **Checkout** | Input alamat dan pilih pembayaran. | - Pilih/input alamat pengiriman<br>- Ongkir dihitung otomatis (jarak)<br>- Ringkasan pesanan (produk, ongkir, total)<br>- Pilih metode bayar (Transfer/QRIS)<br>- Tombol "Bayar Sekarang" |
| 6 | **Status Pesanan** | Tracking pesanan setelah bayar. | - Status bar: Menunggu → Diproses → Dikirim → Selesai<br>- Detail pesanan<br>- Tombol "Konfirmasi Terima" (setelah sampai)<br>- Rating setelah selesai |

### Role: Petani (5 halaman)

| # | Halaman | Deskripsi | Elemen Utama |
|---|---------|-----------|--------------|
| 7 | **Dashboard Petani** | Halaman utama setelah login petani. | - Ringkasan: total penjualan hari ini, pesanan baru, rating<br>- Tombol besar "Input Stok Besok"<br>- Daftar pesanan masuk terbaru<br>- Grafik sederhana |
| 8 | **Input Stok** | Form untuk input produk H-1. | - Pilih nama produk (dropdown)<br>- Input jumlah stok (kg)<br>- Input harga per kg<br>- Upload foto produk (kamera/gallery)<br>- Tombol "Publikasikan" |
| 9 | **Pesanan Masuk** | Daftar pesanan yang perlu diproses. | - List pesanan (nama produk, qty, alamat, total)<br>- Tombol "Terima" / "Tolak"<br>- Status: baru / diterima / dikirim / selesai |
| 10 | **Detail Pesanan** | Detail satu pesanan. | - Info produk + jumlah + harga<br>- Alamat konsumen lengkap<br>- Tombol "Tandai Sudah Dikirim"<br>- Riwayat status |
| 11 | **Saldo & Tarik Dana** | Halaman saldo dan penarikan. | - Saldo tersedia (angka besar)<br>- Riwayat transaksi (masuk/keluar)<br>- Tombol "Tarik ke Rekening"<br>- Form: nominal, pilih rekening |

### Role: Admin (4 halaman)

| # | Halaman | Deskripsi | Elemen Utama |
|---|---------|-----------|--------------|
| 12 | **Dashboard Admin** | Overview platform. | - Total petani, total konsumen, total transaksi<br>- Pendapatan platform (fee)<br>- Sengketa aktif<br>- Grafik transaksi harian/mingguan |
| 13 | **Verifikasi Petani** | Daftar pendaftar baru. | - List petani baru (nama, lokasi, status verifikasi)<br>- Tombol "Lihat Berkas"<br>- Tombol "Setujui" / "Tolak" |
| 14 | **Monitor Transaksi** | Semua transaksi di platform. | - Tabel: ID, petani, konsumen, status, nominal<br>- Filter status (baru/selesai/refund)<br>- Tombol "Detail" |
| 15 | **Sengketa** | Menangani komplain. | - List sengketa (ID transaksi, alasan, bukti)<br>- Detail komplain<br>- Tombol putusan: "Refund Penuh" / "Cair ke Petani" / "Refund Sebagian" |

### Role: Guest (2 halaman)

| # | Halaman | Deskripsi | Elemen Utama |
|---|---------|-----------|--------------|
| 16 | **Landing Page** | Halaman sebelum login. | - Hero section: "Beli Pangan Langsung dari Petani Aceh"<br>- Cara kerja (3 langkah sederhana)<br>- Testimoni / data dampak<br>- Tombol "Mulai Belanja" / "Daftar Jadi Mitra" |
| 17 | **Login / Register** | Form autentikasi. | - Tab: Login / Register<br>- Pilih role: Konsumen / Petani<br>- Form: email/nohp + password<br>- Register petani: tambah KTP, lokasi, rekening |



## 📱 Page List Summary

| # | Halaman | Role | Prioritas MVP |
|---|---------|------|---------------|
| 1 | Landing Page | Guest | P0 |
| 2 | Login / Register | Guest | P0 |
| 3 | Beranda (Browse) | Konsumen | P0 |
| 4 | Detail Produk | Konsumen | P0 |
| 5 | Profil Petani | Konsumen | P0 |
| 6 | Keranjang | Konsumen | P0 |
| 7 | Checkout | Konsumen | P0 |
| 8 | Status Pesanan | Konsumen | P0 |
| 9 | Dashboard Petani | Petani | P0 |
| 10 | Input Stok | Petani | P0 |
| 11 | Pesanan Masuk | Petani | P0 |
| 12 | Detail Pesanan | Petani | P0 |
| 13 | Saldo & Tarik Dana | Petani | P0 |
| 14 | Dashboard Admin | Admin | P0 |
| 15 | Verifikasi Petani | Admin | P0 |
| 16 | Monitor Transaksi | Admin | P0 |
| 17 | Sengketa | Admin | P0 |

> **Total: 17 halaman untuk MVP**
> Prioritas P0 — semua wajib untuk MVP launch.
