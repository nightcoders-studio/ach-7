import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Wallet, Star, ShoppingCart, TrendingUp, PlusCircle, ClipboardList, ArrowRight } from 'lucide-react'

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-500">Pantau performa dan kelola pesanan Anda hari ini.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-brand-green/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-300">
            <Wallet className="w-16 h-16 text-brand-green" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-brand-green" />
              Saldo Tersedia
            </p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight mb-3">
              Rp {Number(saldo).toLocaleString('id-ID')}
            </p>
            <Link href="/petani/saldo" className="inline-flex items-center text-xs font-semibold text-brand-green hover:text-brand-green/80 group/link">
              Lihat detail saldo
              <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Rating Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-yellow-400/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-300">
            <Star className="w-16 h-16 text-yellow-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Rating Toko
            </p>
            <div className="flex items-end gap-2 mb-3">
              <p className="text-2xl font-bold text-slate-800 tracking-tight">{rating.toFixed(1)}</p>
              <span className="text-yellow-500 text-lg leading-none mb-1">★</span>
            </div>
            <p className="text-xs font-medium text-slate-400">Rata-rata ulasan pembeli</p>
          </div>
        </div>

        {/* Pesanan Baru Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-brand-orange/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-300">
            <ShoppingCart className="w-16 h-16 text-brand-orange" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-brand-orange" />
              Pesanan Menunggu
            </p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight mb-3">
              {pendingOrders}
            </p>
            <Link href="/petani/pesanan" className="inline-flex items-center text-xs font-semibold text-brand-orange hover:text-brand-orange/80 group/link">
              Lihat pesanan
              <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Masuk Hari Ini Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-blue-500/30">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Masuk Hari Ini
            </p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight mb-3">
              {ordersToday}
            </p>
            <p className="text-xs font-medium text-slate-400">Total pesanan baru hari ini</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 pt-4">
        <h2 className="flex items-center text-slate-800 text-lg font-bold tracking-tight">
          <span className="w-4 h-6 bg-brand-green mr-3 rounded-sm" />
          Aksi Cepat
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/petani/produk/tambah"
            className="group relative overflow-hidden flex flex-col p-6 rounded-2xl bg-gradient-to-br from-brand-green to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <PlusCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Input Stok Baru</h3>
              <p className="text-emerald-50 text-sm opacity-90">Tambahkan hasil panen baru ke etalase Anda.</p>
            </div>
          </Link>
          
          <Link
            href="/petani/pesanan"
            className="group relative overflow-hidden flex flex-col p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Kelola Pesanan</h3>
              <p className="text-indigo-50 text-sm opacity-90">Tinjau dan proses pesanan yang masuk.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
