import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function PetaniDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [wallet, ordersToday, avgRating, pendingOrders] = await Promise.all([
    prisma.wallet.findUnique({ where: { farmerId: user.id } }),
    prisma.order.count({
      where: { farmerId: user.id, createdAt: { gte: today }, status: 'MENUNGGU' },
    }),
    prisma.review.aggregate({
      where: { farmerId: user.id },
      _avg: { rating: true },
    }),
    prisma.order.count({
      where: { farmerId: user.id, status: 'MENUNGGU' },
    }),
  ])

  const saldo = wallet?.saldo ?? 0
  const rating = avgRating._avg.rating ?? 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Saldo Tersedia</p>
          <p className="text-2xl font-bold text-green-700">Rp {Number(saldo).toLocaleString('id-ID')}</p>
          <Link href="/petani/saldo" className="text-xs text-green-600 hover:underline mt-2 inline-block">
            Lihat detail →
          </Link>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Rating</p>
          <p className="text-2xl font-bold text-yellow-500">★ {rating.toFixed(1)}</p>
          <p className="text-xs text-gray-400 mt-2">Ulasan dari pembeli</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Pesanan Baru</p>
          <p className="text-2xl font-bold text-blue-600">{pendingOrders}</p>
          <Link href="/petani/pesanan" className="text-xs text-green-600 hover:underline mt-2 inline-block">
            Lihat semua →
          </Link>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Masuk Hari Ini</p>
          <p className="text-2xl font-bold text-gray-700">{ordersToday}</p>
          <p className="text-xs text-gray-400 mt-2">Pesanan menunggu</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/petani/produk/tambah"
            className="flex flex-col items-center justify-center rounded-xl bg-green-700 p-6 text-white hover:bg-green-800 transition-colors"
          >
            <span className="text-3xl mb-2">➕</span>
            <span className="font-semibold">Input Stok Baru</span>
            <span className="text-sm text-green-200">Tambahkan produk</span>
          </Link>
          <Link
            href="/petani/pesanan"
            className="flex flex-col items-center justify-center rounded-xl bg-blue-600 p-6 text-white hover:bg-blue-700 transition-colors"
          >
            <span className="text-3xl mb-2">📋</span>
            <span className="font-semibold">Pesanan Masuk</span>
            <span className="text-sm text-blue-200">Proses pesanan</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
