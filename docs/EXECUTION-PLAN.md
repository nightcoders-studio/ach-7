# 🚀 Execution Plan — MVP Platform Pangan Petani

> Urutan eksekusi step-by-step. Selesaikan urut, jangan lompat.

---

## Phase 0: Init Project (1-2 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 0.1 | Init Next.js + TypeScript + Tailwind | `npx create-next-app@latest` → App Router, src/ dir | ✅ |
| 0.2 | Install shadcn/ui | `npx shadcn@latest init` → OK semua default | ✅ |
| 0.3 | Setup Supabase project | Bikin project di supabase.com → ambil API URL + anon key | ✅ |
| 0.4 | Setup Prisma + Supabase | `npm install prisma @prisma/client` → `npx prisma init` → set DATABASE_URL ke Supabase | ✅ |
| 0.5 | Install Supabase JS client | `npm install @supabase/supabase-js @supabase/ssr` | ✅ |
| 0.6 | Setup Supabase Auth helpers | Bikin `lib/supabase/client.ts` + `lib/supabase/server.ts` + middleware auth | ✅ |
| 0.7 | Deploy ke Vercel | Push ke GitHub → import di vercel.com | ⬜ |

## Phase 1: Database Schema (2-3 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 1.1 | Schema: Profile | Tabel: profiles (nama, role, alamat, foto, no_hp, lokasi) — extend dari Supabase Auth | ✅ |
| 1.2 | Schema: Farmer Profile | Tabel: farmer_profiles (nik, ktp, alamat_lahan, verifikasi, rekening) | ✅ |
| 1.3 | Schema: Product | Tabel: products (nama, kategori, harga, stok, foto, deskripsi) | ✅ |
| 1.4 | Schema: Order | Tabel: orders (konsumen, petani, status, total, ongkir, grand_total) | ✅ |
| 1.5 | Schema: Order Item | Tabel: order_items (snapshot nama produk, qty, harga, subtotal) | ✅ |
| 1.6 | Schema: Transaction | Tabel: transactions (metode bayar, status, snap token, ref) | ✅ |
| 1.7 | Schema: Wallet + Withdraw | Tabel: wallets (saldo per petani) + withdraw_requests | ✅ |
| 1.8 | Schema: Review | Tabel: reviews (rating 1-5, komentar) | ✅ |
| 1.9 | Schema: Dispute | Tabel: disputes (alasan, status, putusan) | ✅ |
| 1.10 | Run migration + generate client | `npx prisma migrate dev --name init` + generate | ✅ |

## Phase 2: Auth Module (3-4 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 2.1 | Halaman Login | Form email + password, pilih role (konsumen/petani) | ⬜ |
| 2.2 | Halaman Register Konsumen | Form nama, email, no_hp, alamat, password | ⬜ |
| 2.3 | Halaman Register Petani | Form nama, email, no_hp, password → lanjut ke form data petani (KTP, alamat lahan, rekening) | ⬜ |
| 2.4 | Middleware auth | Redirect ke login kalau belum login | ⬜ |
| 2.5 | Role-based guard | Route protection: /petani/* → cuma petani bisa akses | ⬜ |

## Phase 3: Farmer Module (4-5 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 3.1 | Dashboard Petani | Ringkasan: saldo, pesanan baru hari ini, rating | ⬜ |
| 3.2 | Input / Edit Stok | Form: nama produk, kategori, harga/kg, stok (kg), foto (upload ke Supabase Storage), deskripsi | ⬜ |
| 3.3 | Daftar Produk Saya | List semua produk milik petani, toggle aktif/nonaktif | ⬜ |
| 3.4 | Pesanan Masuk | List pesanan dengan status, tombol Terima / Tolak | ⬜ |
| 3.5 | Detail Pesanan | Info pesanan + alamat konsumen + tombol "Tandai Dikirim" | ⬜ |
| 3.6 | Saldo & Riwayat | Lihat saldo, riwayat transaksi masuk | ⬜ |
| 3.7 | Tarik Dana | Form nominal, pilih rekening, submit → create withdraw request | ⬜ |

## Phase 4: Consumer Module (5-6 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 4.1 | Landing Page (Guest) | Hero, cara kerja, tombol daftar/mulai | ⬜ |
| 4.2 | Beranda (Browse Produk) | Grid produk dari semua petani, filter kategori, search | ⬜ |
| 4.3 | Detail Produk | Foto, harga, stok, nama petani + profil, input qty, tombol +keranjang | ⬜ |
| 4.4 | Profil Petani | Lihat profil petani + semua produknya | ⬜ |
| 4.5 | Keranjang | List item, edit qty, total, tombol checkout | ⬜ |
| 4.6 | Checkout | Alamat, ringkasan ongkir, grand total, pilih bayar | ⬜ |
| 4.7 | Pembayaran | Redirect ke Midtrans Snap / QRIS | ⬜ |
| 4.8 | Status Pesanan | Tracking: Menunggu → Diproses → Dikirim → Selesai | ⬜ |
| 4.9 | Riwayat Pesanan | Semua pesanan yang pernah dibuat | ⬜ |
| 4.10 | Konfirmasi Terima + Rating | Tombol "Sudah Terima" + kasih bintang & review | ⬜ |

## Phase 5: Payment & Rekber (3-4 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 5.1 | Integrasi Midtrans Snap | Setup server key, client key di env | ⬜ |
| 5.2 | API: Create Transaction | Hitung total, generate snap token, simpan transaksi | ⬜ |
| 5.3 | API: Midtrans Webhook | Terima notifikasi payment status → update transaksi | ⬜ |
| 5.4 | API: Webhook handler | Kalau lunas → ubah status jadi "paid", notif petani | ⬜ |
| 5.5 | Rekber Logic | Dana tahan di Midtrans (pending) → cair setelah konfirmasi konsumen | ⬜ |

## Phase 6: Admin Module (3-4 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 6.1 | Dashboard Admin | Overview: total petani, konsumen, transaksi, pendapatan | ⬜ |
| 6.2 | Verifikasi Petani | List pendaftar baru, lihat dokumen, setujui/tolak | ⬜ |
| 6.3 | Monitor Transaksi | Tabel semua transaksi + filter status | ⬜ |
| 6.4 | Sengketa | List sengketa, detail, putusan (refund/cair/sebagian) | ⬜ |

## Phase 7: Integration & Polish (3-4 jam)

| # | Task | Detail | Status |
|---|------|--------|--------|
| 7.1 | Realtime notifikasi | Supabase Realtime utk alert pesanan baru (petani) | ⬜ |
| 7.2 | Hitung ongkir by jarak | Berdasarkan alamat konsumen → farmer (manual atau API) | ⬜ |
| 7.3 | Dashboard final testing | Test semua flow dari register → beli → terima → rating | ⬜ |
| 7.4 | Error handling + loading | Skeleton, toast, fallback UI | ⬜ |
| 7.5 | Deploy final | Push ke Vercel | ⬜ |

---

## Estimasi Total

| Phase | Jam | Note |
|-------|-----|------|
| Phase 0: Init | 1-2 | One-time setup |
| Phase 1: Schema | 2-3 | Paling kritis, tentukan relasi data |
| Phase 2: Auth | 3-4 | Bisa cepat pakai Supabase Auth |
| Phase 3: Farmer | 4-5 | Paling penting — farmer adalah kunci |
| Phase 4: Consumer | 5-6 | Terberat karena banyak halaman + UI |
| Phase 5: Payment | 3-4 | Midtrans Snap cukup embed widget |
| Phase 6: Admin | 3-4 | Dashboard + verifikasi |
| Phase 7: Polish | 3-4 | Testing + bugfix |
| **Total** | **24-32 jam** | Bisa dikerjakan parallel (frontend ≠ backend) |

---

## Rule of Thumb
1. **Jangan lanjut ke phase berikutnya kalau phase sebelumnya belum selesai** — kecuali auth sama schema aman.
2. Phase 3 (Farmer) dan Phase 4 (Consumer) bisa dikerjakan **paralel** oleh 2 orang berbeda.
3. Testing tiap selesai satu fitur, jangan nunggu final.
4. Kalau mentok di Midtrans, bisa ganti manual: konfirmasi via screenshot dulu (gaptek MVP).
