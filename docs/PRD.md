# 📋 PRD — Platform Pangan Petani

> **Product Requirements Document**
> Fokus: Aceh Besar ↔ Banda Aceh
> Model: Platform Pertemuan Petani & Konsumen (Upwork/Fiverr untuk Pangan)

---

## 1. Product Overview

### 1.1 Visi
Menjadi platform digital yang menghubungkan **petani lokal Aceh langsung ke konsumen**, memotong rantai tengkulak, menstabilkan harga pangan, dan meningkatkan kesejahteraan petani.

### 1.2 Misi
- Memberikan akses pasar langsung ke petani Aceh Besar
- Menyediakan pangan segar dengan harga adil bagi konsumen Banda Aceh
- Menciptakan transparansi harga pangan berbasis data
- Membangun ekosistem logistik pangan lokal yang efisien

### 1.3 Model Platform
Platform **seperti Upwork/Fiverr** — petani menjadi mitra yang terdaftar, mengelola sendiri produknya, dan bertanggung jawab atas pengiriman. Platform memfasilitasi transaksi yang aman via rekber (rekening bersama), sistem rating, dan acuan harga transparan.

---

## 2. Problem Statement

### 2.1 Masalah Utama

| # | Masalah | Data |
|---|---------|------|
| 1 | Inflasi Aceh tertinggi nasional | 6,71% (Des 2025) — BPS |
| 2 | Petani jual di bawah HPP | Gabah Rp 6.000-6.200/kg (HPP Rp 6.500) |
| 3 | Biaya produksi naik terus | Pupuk Rp 550rb/zak, NTP turun 0,24% |
| 4 | Rantai pasok dikuasai tengkulak | MBG masih impor dari Sumut |
| 5 | Surplus tak termonetisasi | Aceh Besar surplus 210rb ton beras |

### 2.2 Dampak
- Petani: margin tipis, daya tawar rendah, ketergantungan pada tengkulak
- Konsumen: harga mahal, akses terbatas ke pangan segar langsung dari sumbernya
- Daerah: inflasi tinggi, kebocoran ekonomi karena pangan didatangkan dari luar

---

## 3. Target Users

### 3.1 User Persona — Konsumen

| Atribut | Detail |
|---------|--------|
| **Nama** | Fira (28), guru SMA di Banda Aceh |
| **Kebiasaan** | Belanja mingguan di Pasar Ulee Kareng, sering tidak sempat karena kerja |
| **Pain** | Harga naik turun, kualitas sayur kadang tidak segar, tidak tahu asal petani |
| **Harapan** | Bisa beli pangan segar langsung dari petani dengan harga jelas, diantar ke rumah |
| **Literasi digital** | Tinggi — pengguna Gojek, Shopee, mobile banking |

### 3.2 User Persona — Petani

| Atribut | Detail |
|---------|--------|
| **Nama** | Pak Rosmaini (53), petani di Simpang Tiga, Aceh Besar |
| **Kebiasaan** | Jual gabah ke tengkulak dengan harga murah, terkadang tidak balik modal |
| **Pain** | Harga ditentukan tengkulak, tidak tahu harga pasar, sering rugi |
| **Harapan** | Bisa jual langsung dengan harga lebih baik, ada jangkauan pembeli lebih luas |
| **Literasi digital** | Rendah — punya HP Android WhatsApp-an, tapi belum pernah transaksi online |

### 3.3 User Persona — Admin Platform

| Atribut | Detail |
|---------|--------|
| **Nama** | Tim platform (1-2 orang, founder) |
| **Tugas** | Verifikasi petani, monitor transaksi, handle sengketa, pantau data |
| **Pain** | Harus memastikan trust kedua belah pihak, skalabilitas manual |

---

## 4. Features

### 4.1 MVP Features (Phase 1)

| Fitur | User | Prioritas |
|-------|------|-----------|
| Register & Login petani | Petani | P0 |
| Register & Login konsumen | Konsumen | P0 |
| Input produk + stok + harga + foto | Petani | P0 |
| Jelajahi produk (filter kategori) | Konsumen | P0 |
| Detail produk + profil petani | Konsumen | P0 |
| Keranjang belanja | Konsumen | P0 |
| Checkout + input alamat | Konsumen | P0 |
| Pembayaran via rekber (transfer/QRIS) | Konsumen | P0 |
| Notifikasi pesanan ke petani | Petani | P0 |
| Terima/tolak pesanan | Petani | P0 |
| Tandai sudah dikirim | Petani | P0 |
| Konfirmasi terima barang | Konsumen | P0 |
| Rating & review | Konsumen | P0 |
| Tarik dana ke rekening | Petani | P0 |
| Dashboard admin | Admin | P0 |
| Verifikasi pendaftaran petani | Admin | P0 |
| Handle sengketa (refund) | Admin | P0 |
| Hitung ongkir by jarak | Platform | P0 |
| Fee platform (5-7%) | Platform | P0 |

### 4.2 Phase 2 (Post-MVP)

| Fitur | Keterangan |
|-------|------------|
| Subscription tier premium | Badge, prioritas pencarian, analitik |
| Acuan harga pasaran realtime (PIHPS API) | Harga transparan buat petani & konsumen |
| Filter radius (petani terdekat) | Prioritas lokasi |
| Chat petani ↔ konsumen | Komunikasi langsung via platform |
| Multiple payment gateway | GoPay, OVO, ShopeePay |
| WhatsApp notification | Petani dapat notif via WA |
| Petani dashboard analitik | Grafik penjualan, rating, insight |
| Multi-bahasa (Aceh/Indonesia) | Aksesibilitas lebih luas |

---

## 5. User Stories

### 5.1 Konsumen

```
US-K01: Sebagai konsumen, saya ingin mendaftar/login dengan mudah
        agar bisa mulai belanja.

US-K02: Sebagai konsumen, saya ingin melihat produk dari petani sekitar
        dengan filter kategori dan harga agar mudah menemukan kebutuhan saya.

US-K03: Sebagai konsumen, saya ingin melihat profil dan rating petani
        agar bisa memilih petani terpercaya.

US-K04: Sebagai konsumen, saya ingin menambahkan produk ke keranjang
        dan checkout dengan input alamat tujuan.

US-K05: Sebagai konsumen, saya ingin membayar via transfer/QRIS
        dengan sistem rekber agar aman.

US-K06: Sebagai konsumen, saya ingin melacak status pesanan
        agar tahu kapan barang sampai.

US-K07: Sebagai konsumen, saya ingin konfirmasi penerimaan barang
        agar dana dilepas ke petani.

US-K08: Sebagai konsumen, saya ingin memberi rating & review
        agar petani lain bisa lihat kualitas.
```

### 5.2 Petani

```
US-P01: Sebagai petani, saya ingin mendaftar sebagai mitra
        dengan verifikasi data diri agar bisa mulai menjual.

US-P02: Sebagai petani, saya ingin input stok, harga, dan foto produk
        untuk besok hari dengan antarmuka yang mudah.

US-P03: Sebagai petani, saya ingin mendapat notifikasi pesanan masuk
        agar bisa segera proses.

US-P04: Sebagai petani, saya ingin menerima atau menolak pesanan
        agar saya bisa mengatur kapasitas.

US-P05: Sebagai petani, saya ingin tandai pesanan sudah dikirim
        agar konsumen tahu status.

US-P06: Sebagai petani, saya ingin melihat saldo yang terkumpul
        dan menarik dana ke rekening kapan saja.

US-P07: Sebagai petani, saya ingin melihat rating dan review saya
        agar bisa meningkatkan layanan.
```

### 5.3 Admin

```
US-A01: Sebagai admin, saya ingin verifikasi pendaftaran petani baru
        agar hanya petani valid yang bergabung.

US-A02: Sebagai admin, saya ingin monitor semua transaksi aktif
        agar bisa pantau jika ada masalah.

US-A03: Sebagai admin, saya ingin handle sengketa antara petani & konsumen
        dengan opsi refund penuh/sebagian/cair.

US-A04: Sebagai admin, saya ingin melihat laporan transaksi harian/bulanan
        untuk evaluasi bisnis.
```

---

## 6. Functional Requirements

### 6.1 Sistem Autentikasi

| ID | Requirement |
|----|-------------|
| F-AUTH-01 | Pengguna bisa daftar sebagai konsumen (email/nomor HP + password) |
| F-AUTH-02 | Pengguna bisa daftar sebagai petani mitra (nama, KTP, lokasi, rekening) |
| F-AUTH-03 | Verifikasi petani oleh admin sebelum aktif |
| F-AUTH-04 | Login via email/nomor HP + password |
| F-AUTH-05 | Logout dari akun |

### 6.2 Modul Produk & Katalog

| ID | Requirement |
|----|-------------|
| F-PROD-01 | Petani bisa input produk (nama, kategori, stok kg, harga/kg, deskripsi, foto) |
| F-PROD-02 | Produk hanya tampil untuk jadwal besok (H-1) |
| F-PROD-03 | Konsumen bisa lihat semua produk dari petani aktif |
| F-PROD-04 | Konsumen bisa filter berdasarkan kategori produk |
| F-PROD-05 | Konsumen bisa lihat detail produk + profil petani + rating |

### 6.3 Modul Transaksi & Rekber

| ID | Requirement |
|----|-------------|
| F-TRX-01 | Konsumen bisa add to cart dan checkout |
| F-TRX-02 | Sistem hitung ongkir berdasarkan jarak petani → konsumen |
| F-TRX-03 | Pembayaran via transfer bank / QRIS — dana ditahan platform |
| F-TRX-04 | Petani dapat notifikasi pesanan baru (real-time) |
| F-TRX-05 | Petani bisa terima atau tolak pesanan |
| F-TRX-06 | Jika ditolak, dana otomatis dikembalikan ke konsumen |
| F-TRX-07 | Petani bisa tandai pesanan sebagai "sudah dikirim" |
| F-TRX-08 | Konsumen bisa konfirmasi "barang diterima" |
| F-TRX-09 | Setelah konfirmasi, dana otomatis masuk ke saldo petani |
| F-TRX-10 | Jika ada komplain, masuk ke meja admin untuk sengketa |
| F-TRX-11 | Admin bisa putuskan refund penuh, refund sebagian, atau cair ke petani |

### 6.4 Modul Rating & Review

| ID | Requirement |
|----|-------------|
| F-RATE-01 | Konsumen bisa beri rating 1-5 bintang setelah transaksi selesai |
| F-RATE-02 | Konsumen bisa tulis review teks |
| F-RATE-03 | Rating ditampilkan di profil petani |
| F-RATE-04 | Rating rata-rata dihitung otomatis |

### 6.5 Modul Saldo & Penarikan

| ID | Requirement |
|----|-------------|
| F-WD-01 | Petani punya saldo platform yang terisi otomatis setelah konfirmasi |
| F-WD-02 | Petani bisa lihat riwayat saldo masuk |
| F-WD-03 | Petani bisa ajukan tarik dana ke rekening terdaftar |
| F-WD-04 | Proses pencairan maksimal 1x24 jam |

### 6.6 Modul Admin

| ID | Requirement |
|----|-------------|
| F-ADM-01 | Admin bisa lihat daftar pendaftaran petani baru |
| F-ADM-02 | Admin bisa setujui/tolak pendaftaran dengan alasan |
| F-ADM-03 | Admin bisa monitor semua transaksi (aktif, selesai, refund) |
| F-ADM-04 | Admin bisa lihat dan selesaikan sengketa |
| F-ADM-05 | Admin bisa lihat pendapatan platform (fee transaksi) |

---

## 7. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NF-01 | Platform bisa diakses via **mobile web** (responsif) — prioritas utama |
| NF-02 | **Petani interface** harus super simpel, font besar, minim step |
| NF-03 | Waktu render halaman < 2 detik |
| NF-04 | Notifikasi real-time (WebSocket / polling) untuk pesanan baru |
| NF-05 | Aman: data rekening petani terenkripsi, password hashed |
| NF-06 | Tersedia 24/7 dengan uptime minimal 99% |

---

## 8. Business Model

| Aspek | Detail |
|-------|--------|
| **Revenue MVP** | Fee 5-7% per transaksi (dipotong dari pembayaran konsumen) |
| **Revenue Phase 2** | Fee + subscription premium petani (badge, prioritas, analitik) |
| **Biaya operasional** | Server, payment gateway fee, tim |
| **Unit ekonomi** | Fee per transaksi — platform untung kalau petani untung |
| **Target pertama** | 10-20 petani aktif, 200+ konsumen aktif dalam 3 bulan |

---

## 9. Success Metrics

| Metrik | Target MVP (3 bulan) |
|--------|---------------------|
| Petani aktif | 10-20 mitra |
| Konsumen terdaftar | 200+ |
| Transaksi per bulan | 100+ |
| Repeat purchase rate | > 40% |
| Rating rata-rata petani | > 4.0/5.0 |
| Sengketa yang terjadi | < 5% dari total transaksi |
| Fee revenue | Cover biaya server |

---

## 10. Tech Stack (Saran Awal)

| Layer | Pilihan |
|-------|---------|
| **Frontend** | Next.js + Tailwind CSS + shadcn/ui |
| **Editor** | TBD |
| **Backend** | Next.js API routes |
| **Database** | PostgreSQL (Supabase / Neon) |
| **Payment** | Midtrans / Xendit (rekber) |
| **Auth** | NextAuth / Supabase Auth |
| **Deploy** | Vercel |

---

## 11. Risks & Mitigation

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Petani gak bisa input produk sendiri | Platform guna | Desain super simpel + fitur voice input, training offline |
| Trust issue — konsumen takut bayar di muka | Tidak transaksi | Sistem rekber jelas + edukasi pengguna |
| Petani gak antar tepat waktu | Komplain | Rating system + denda/sanksi dari saldo |
| Skalabilitas logistik | Pengiriman terbatas | Petani antar sendiri (tanpa armada platform) |
| Kompetisi dengan tengkulak | Petani balik ke tengkulak | Tunjukkan harga lebih baik + bukti transaksi |

---

## 12. Roadmap

### Phase 1 — MVP (Estimasi 2-3 bulan)
```
Bulan 1:
├── Setup project + database + auth
├── Modul petani: daftar, input produk
├── Modul konsumen: daftar, jelajah, keranjang
└── Pembayaran rekber sederhana

Bulan 2:
├── Checkout + ongkir
├── Notifikasi pesanan
├── Konfirmasi terima + dana cair
├── Dashboard admin
└── Rating & review

Validasi: 10 petani + 50 konsumen
```

### Phase 2 — Scale (Post-MVP)
```
├── Fitur subscription premium
├── Integrasi PIHPS untuk acuan harga
├── Chat petani-konsumen
├── Multiple payment gateway
├── WhatsApp integration
└── Analitik & insight
```

---

> **Owner:** [Nama Tim / Founder]
> **Status:** Draft — siap didiskusikan dan direvisi
