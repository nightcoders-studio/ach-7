import pg from 'pg'
import crypto from 'crypto'

const { Pool } = pg

const pool = new Pool({
  connectionString: 'postgresql://postgres:acehhackathon@db.tihaicgrlatnlxgavuwx.supabase.co:5432/postgres',
})

const SUPABASE_URL = 'https://tihaicgrlatnlxgavuwx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpaGFpY2dybGF0bmx4Z2F2dXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyODQyMTYsImV4cCI6MjA5NTg2MDIxNn0.wZ_P0k-_LTeAhz0JZmWsKjURRurKz2aHKeDuJ6wp7q8'

function uuid() {
  return crypto.randomUUID()
}

async function signupUser(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok && data.code !== '23505') {
    throw new Error(`Signup failed for ${email}: ${data.msg || data.message}`)
  }
  // If user already exists, get their ID from DB
  if (data.code === '23505') {
    const r = await pool.query("SELECT id FROM auth.users WHERE email = $1", [email])
    return r.rows[0].id
  }
  return data.user.id
}

async function main() {
  const client = await pool.connect()

  try {
    console.log('🧹 Cleaning database...')
    await client.query('BEGIN')

    await client.query('DELETE FROM disputes')
    await client.query('DELETE FROM reviews')
    await client.query('DELETE FROM transactions')
    await client.query('DELETE FROM order_items')
    await client.query('DELETE FROM orders')
    await client.query('DELETE FROM products')
    await client.query('DELETE FROM withdraw_requests')
    await client.query('DELETE FROM wallets')
    await client.query('DELETE FROM farmer_profiles')
    await client.query('DELETE FROM profiles')

    await client.query('DELETE FROM auth.identities')
    await client.query('DELETE FROM auth.users')

    await client.query('COMMIT')
    console.log('✅ Database cleaned')

    // ─── CREATE USERS VIA SUPABASE AUTH API ─────────────────────
    console.log('\n👤 Creating users via Auth API...')

    const farmers = [
      {
        email: 'budi@petani.local',
        name: 'Budi Santoso',
        noHp: '08126543210',
        alamat: 'Jl. Teuku Umar No. 45, Kec. Syiah Kuala, Banda Aceh',
        nik: '1173011507850001',
        alamatLahan: 'Desa Lambaro, Kec. Ingin Jaya, Aceh Besar',
        rekeningBank: 'BSI',
        noRekening: '7001234567',
        namaPemilikRekening: 'Budi Santoso',
      },
      {
        email: 'siti@petani.local',
        name: 'Siti Rahma',
        noHp: '085277788899',
        alamat: 'Gampong Punge, Kec. Meuraxa, Banda Aceh',
        nik: '1171016208900002',
        alamatLahan: 'Gampong Blang, Kec. Kuta Baro, Aceh Besar',
        rekeningBank: 'Mandiri',
        noRekening: '123004567890',
        namaPemilikRekening: 'Siti Rahma',
      },
      {
        email: 'amri@petani.local',
        name: 'Amri Zulkifli',
        noHp: '082370010203',
        alamat: 'Jl. Lingkar Kampus, Kec. Kopelma Darussalam, Banda Aceh',
        nik: '1171011501920003',
        alamatLahan: 'Desa Rukoh, Kec. Syiah Kuala, Banda Aceh',
        rekeningBank: 'BRI',
        noRekening: '009988776655',
        namaPemilikRekening: 'Amri Zulkifli',
      },
    ]

    const consumers = [
      {
        email: 'fathiya@user.local',
        name: 'Fathiya Aulia',
        noHp: '081362513478',
        alamat: 'Jl. Sultan Iskandar Muda No. 12, Kec. Kuta Alam, Banda Aceh',
      },
      {
        email: 'rafi@user.local',
        name: 'Rafi Maulana',
        noHp: '085362514789',
        alamat: 'Desa Lamteh, Kec. Peukan Bada, Aceh Besar',
      },
    ]

    // Sign up all users
    const budiId = await signupUser('budi@petani.local', '123456')
    const sitiId = await signupUser('siti@petani.local', '123456')
    const amriId = await signupUser('amri@petani.local', '123456')
    const fathiyaId = await signupUser('fathiya@user.local', '123456')
    const rafiId = await signupUser('rafi@user.local', '123456')

    const farmersWithIds = farmers.map((f, i) => {
      const ids = [budiId, sitiId, amriId]
      return { ...f, id: ids[i] }
    })

    const consumersWithIds = consumers.map((c, i) => {
      const ids = [fathiyaId, rafiId]
      return { ...c, id: ids[i] }
    })

    console.log('✅ 5 auth users created')

    // ─── CREATE PROFILES ─────────────────────────────────────────
    console.log('\n📋 Creating profiles...')

    for (const farmer of farmersWithIds) {
      await client.query(
        `INSERT INTO profiles (id, role, nama, email, no_hp, alamat, created_at, updated_at)
         VALUES ($1, 'PETANI', $2, $3, $4, $5, NOW(), NOW())`,
        [farmer.id, farmer.name, farmer.email, farmer.noHp, farmer.alamat]
      )
    }

    for (const konsumen of consumersWithIds) {
      await client.query(
        `INSERT INTO profiles (id, role, nama, email, no_hp, alamat, created_at, updated_at)
         VALUES ($1, 'KONSUMEN', $2, $3, $4, $5, NOW(), NOW())`,
        [konsumen.id, konsumen.name, konsumen.email, konsumen.noHp, konsumen.alamat]
      )
    }
    console.log('✅ 5 profiles created')

    // ─── CREATE FARMER PROFILES ──────────────────────────────────
    console.log('\n🌾 Creating farmer profiles & wallets...')

    for (const farmer of farmersWithIds) {
      await client.query(
        `INSERT INTO farmer_profiles (id, profile_id, nik, foto_ktp, alamat_lahan,
          status_verifikasi, rekening_bank, no_rekening, nama_pemilik_rekening,
          created_at, updated_at)
         VALUES ($1, $2, $3, '/dummy/ktp.jpg', $4,
          'TERVERIFIKASI', $5, $6, $7, NOW(), NOW())`,
        [uuid(), farmer.id, farmer.nik, farmer.alamatLahan, farmer.rekeningBank, farmer.noRekening, farmer.namaPemilikRekening]
      )

      await client.query(
        `INSERT INTO wallets (id, farmer_id, saldo, updated_at)
         VALUES ($1, $2, 250000, NOW())`,
        [uuid(), farmer.id]
      )
    }
    console.log('✅ 3 farmer profiles & wallets created')

    // ─── CREATE PRODUCTS ─────────────────────────────────────────
    console.log('\n🥬 Creating products...')

    const [budi, siti, amri] = farmersWithIds

    const productDefs = [
      // Budi — sayur
      { farmerId: budi.id, nama: 'Bayam Hijau', kategori: 'SAYUR', harga: 12000, stok: 50, desk: 'Bayam segar panen hari ini, kaya zat besi.' },
      { farmerId: budi.id, nama: 'Kangkung', kategori: 'SAYUR', harga: 10000, stok: 40, desk: 'Kangkung organik, tanpa pestisida.' },
      { farmerId: budi.id, nama: 'Sawi Hijau', kategori: 'SAYUR', harga: 14000, stok: 30, desk: 'Sawi hijau segar, cocok untuk tumis.' },
      { farmerId: budi.id, nama: 'Wortel Lokal', kategori: 'SAYUR', harga: 18000, stok: 25, desk: 'Wortel lokal manis, tinggi vitamin A.' },
      // Siti — buah
      { farmerId: siti.id, nama: 'Pisang Cavendish', kategori: 'BUAH', harga: 15000, stok: 60, desk: 'Pisang cavendish manis alami, matang di pohon.' },
      { farmerId: siti.id, nama: 'Pepaya California', kategori: 'BUAH', harga: 12000, stok: 35, desk: 'Pepaya california merah, manis dan segar.' },
      { farmerId: siti.id, nama: 'Jeruk Lokal', kategori: 'BUAH', harga: 25000, stok: 20, desk: 'Jeruk lokal manis, vitamin C tinggi.' },
      { farmerId: siti.id, nama: 'Semangka Merah', kategori: 'BUAH', harga: 8000, stok: 40, desk: 'Semangka merah legit, panen pagi ini.' },
      // Amri — beras & cabai
      { farmerId: amri.id, nama: 'Beras Premium', kategori: 'BERAS', harga: 16000, stok: 200, desk: 'Beras premium kualitas terbaik, pulen dan wangi.' },
      { farmerId: amri.id, nama: 'Cabai Merah Besar', kategori: 'CABAI', harga: 45000, stok: 15, desk: 'Cabai merah segar, pedas mantap.' },
      { farmerId: amri.id, nama: 'Cabai Rawit Setan', kategori: 'CABAI', harga: 55000, stok: 10, desk: 'Cabai rawit super pedas untuk sambal favorit.' },
      { farmerId: amri.id, nama: 'Bawang Merah', kategori: 'BAWANG', harga: 35000, stok: 20, desk: 'Bawang merah lokal, ukuran sedang hingga besar.' },
    ]

    const productIds = []
    for (const prod of productDefs) {
      const id = uuid()
      productIds.push(id)
      await client.query(
        `INSERT INTO products (id, farmer_id, nama_produk, kategori, harga_per_kg, stok, satuan, deskripsi, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'kg', $7, true, NOW(), NOW())`,
        [id, prod.farmerId, prod.nama, prod.kategori, prod.harga, prod.stok, prod.desk]
      )
    }
    console.log('✅ 12 products created')

    // ─── CREATE ORDERS ───────────────────────────────────────────
    console.log('\n📦 Creating orders, items, transactions & reviews...')

    async function createOrder({ konsumen, farmer, status, items, ongkir, metodeBayar, paymentStatus, paidAt, createdAt, review }) {
      const orderId = uuid()
      let totalHarga = 0

      for (const item of items) {
        item.subtotal = item.qty * item.hargaSatuan
        totalHarga += item.subtotal
      }

      const grandTotal = totalHarga + ongkir
      const orderCreatedAt = createdAt || new Date()

      await client.query(
        `INSERT INTO orders (id, konsumen_id, farmer_id, status, total_harga, ongkir, grand_total,
          catatan, alamat_pengiriman, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)`,
        [orderId, konsumen.id, farmer.id, status, totalHarga, ongkir, grandTotal,
         items[0].catatan || null, konsumen.alamat, orderCreatedAt]
      )

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, product_name, qty, harga_satuan, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [uuid(), orderId, item.productId, item.productName, item.qty, item.hargaSatuan, item.subtotal]
        )
      }

      await client.query(
        `INSERT INTO transactions (id, order_id, metode_bayar, status_payment, paid_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $6)`,
        [uuid(), orderId, metodeBayar, paymentStatus, paidAt || null, orderCreatedAt]
      )

      if (review) {
        await client.query(
          `INSERT INTO reviews (id, order_id, konsumen_id, farmer_id, rating, komentar, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [uuid(), orderId, konsumen.id, farmer.id, review.rating, review.komentar, review.createdAt || orderCreatedAt]
        )
      }

      if (status === 'SELESAI' && paymentStatus === 'PAID') {
        await client.query(
          `UPDATE wallets SET saldo = saldo + $1 WHERE farmer_id = $2`,
          [grandTotal, farmer.id]
        )
      }

      return orderId
    }

    function daysAgo(n) {
      const d = new Date()
      d.setDate(d.getDate() - n)
      return d
    }

    // Product ID lookup
    const p = {
      bayam: productIds[0], kangkung: productIds[1], sawi: productIds[2], wortel: productIds[3],
      pisang: productIds[4], pepaya: productIds[5], jeruk: productIds[6], semangka: productIds[7],
      beras: productIds[8], cabaiMerah: productIds[9], cabaiRawit: productIds[10], bawang: productIds[11],
    }

    const f = consumersWithIds[0]
    const r = consumersWithIds[1]

    // 1. Fathiya → Budi — SELESAI (5 days ago)
    await createOrder({
      konsumen: f, farmer: budi, status: 'SELESAI',
      items: [
        { productId: p.bayam, productName: 'Bayam Hijau', qty: 2, hargaSatuan: 12000, catatan: 'Tolong yg segar ya' },
        { productId: p.kangkung, productName: 'Kangkung', qty: 1, hargaSatuan: 10000 },
        { productId: p.wortel, productName: 'Wortel Lokal', qty: 1, hargaSatuan: 18000 },
      ],
      ongkir: 5000, metodeBayar: 'TRANSFER', paymentStatus: 'PAID', paidAt: daysAgo(5), createdAt: daysAgo(5),
      review: { rating: 5, komentar: 'Sayurnya segar sekali, packing rapi. Terima kasih Pak Budi!', createdAt: daysAgo(3) },
    })

    // 2. Fathiya → Siti — SELESAI (4 days ago)
    await createOrder({
      konsumen: f, farmer: siti, status: 'SELESAI',
      items: [
        { productId: p.pisang, productName: 'Pisang Cavendish', qty: 3, hargaSatuan: 15000, catatan: 'Tolong yg matang' },
        { productId: p.jeruk, productName: 'Jeruk Lokal', qty: 1, hargaSatuan: 25000 },
      ],
      ongkir: 5000, metodeBayar: 'QRIS', paymentStatus: 'PAID', paidAt: daysAgo(4), createdAt: daysAgo(4),
      review: { rating: 4, komentar: 'Buahnya manis, cuma jeruknya ada yg sedikit asam. Overall puas!', createdAt: daysAgo(2) },
    })

    // 3. Rafi → Amri — SELESAI (6 days ago)
    await createOrder({
      konsumen: r, farmer: amri, status: 'SELESAI',
      items: [
        { productId: p.beras, productName: 'Beras Premium', qty: 10, hargaSatuan: 16000, catatan: 'Beras utk kebutuhan 2 minggu' },
        { productId: p.bawang, productName: 'Bawang Merah', qty: 1, hargaSatuan: 35000 },
      ],
      ongkir: 8000, metodeBayar: 'TRANSFER', paymentStatus: 'PAID', paidAt: daysAgo(6), createdAt: daysAgo(6),
      review: { rating: 5, komentar: 'Beras pulen enak, bawang segar. Recommended!', createdAt: daysAgo(4) },
    })

    // 4. Rafi → Budi — DIKIRIM (2 days ago)
    await createOrder({
      konsumen: r, farmer: budi, status: 'DIKIRIM',
      items: [
        { productId: p.kangkung, productName: 'Kangkung', qty: 2, hargaSatuan: 10000, catatan: 'Cepet ya bang' },
        { productId: p.sawi, productName: 'Sawi Hijau', qty: 1, hargaSatuan: 14000 },
      ],
      ongkir: 8000, metodeBayar: 'TRANSFER', paymentStatus: 'PAID', paidAt: daysAgo(2), createdAt: daysAgo(2),
    })

    // 5. Fathiya → Amri — DIPROSES (1 day ago)
    await createOrder({
      konsumen: f, farmer: amri, status: 'DIPROSES',
      items: [
        { productId: p.cabaiMerah, productName: 'Cabai Merah Besar', qty: 1, hargaSatuan: 45000, catatan: 'Campur cabe rawit 1 kg ya' },
        { productId: p.cabaiRawit, productName: 'Cabai Rawit Setan', qty: 1, hargaSatuan: 55000 },
      ],
      ongkir: 5000, metodeBayar: 'TRANSFER', paymentStatus: 'PAID', paidAt: daysAgo(1), createdAt: daysAgo(1),
    })

    // 6. Rafi → Siti — MENUNGGU
    await createOrder({
      konsumen: r, farmer: siti, status: 'MENUNGGU',
      items: [
        { productId: p.pepaya, productName: 'Pepaya California', qty: 2, hargaSatuan: 12000 },
        { productId: p.semangka, productName: 'Semangka Merah', qty: 3, hargaSatuan: 8000 },
      ],
      ongkir: 8000, metodeBayar: 'TRANSFER', paymentStatus: 'PENDING', createdAt: new Date(),
    })

    // 7. Fathiya → Amri — DIBATALKAN (7 days ago)
    await createOrder({
      konsumen: f, farmer: amri, status: 'DIBATALKAN',
      items: [
        { productId: p.bawang, productName: 'Bawang Merah', qty: 2, hargaSatuan: 35000, catatan: 'Maaf pak, pesanan dibatalkan' },
      ],
      ongkir: 5000, metodeBayar: 'TRANSFER', paymentStatus: 'REFUND', createdAt: daysAgo(7),
    })

    console.log('✅ 7 orders created with items, transactions & reviews')

    // ─── WRITE CREDENTIALS FILE ──────────────────────────────────
    const credsContent = `═══════════════════════════════════════════
  AKUN PANGANTANYOE — DATABASE SEED
═══════════════════════════════════════════

🌾 PETANI (akhiran @petani.local)
────────────────────────────
  Email              | Password
  budi@petani.local  | 123456
  siti@petani.local  | 123456
  amri@petani.local  | 123456

👥 KONSUMEN (akhiran @user.local)
────────────────────────────
  Email               | Password
  fathiya@user.local  | 123456
  rafi@user.local     | 123456

📦 DATA DUMMY
────────────────────────────
  3 Petani terverifikasi x 4 produk = 12 produk
  7 Pesanan (2 SELESAI, 1 DIKIRIM, 1 DIPROSES, 1 MENUNGGU, 1 DIBATALKAN)
  3 Review (rating 5, 4, 5)
═══════════════════════════════════════════
`

    const fs = await import('fs')
    const credsPath = '/home/rvlionxz/akun-pangantanyoe.txt'
    fs.writeFileSync(credsPath, credsContent)
    console.log(`\n📝 Credentials saved to: ${credsPath}`)
    console.log(credsContent)

    console.log('\n✅ SEED COMPLETE!')
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
