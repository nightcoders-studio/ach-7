'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Store, ChevronRight, Clock, Package, CreditCard, Home, User, ListOrdered, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

type OrderItem = {
  productName: string
  qty: number
  subtotal: number
}

type Transaction = {
  metodeBayar: string
  statusPayment: string
}

type Order = {
  id: string
  status: string
  grandTotal: number
  totalHarga: number
  ongkir: number
  alamatPengiriman: string
  catatan: string | null
  createdAt: string
  farmer: {
    id: string
    nama: string
    foto: string | null
  }
  items: OrderItem[]
  transaction: Transaction | null
}

const STATUS_LABEL: Record<string, string> = {
  MENUNGGU: 'Menunggu Konfirmasi',
  DIPROSES: 'Sedang Diproses',
  DIKIRIM: 'Dalam Pengiriman',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
}

const STATUS_ICON: Record<string, typeof Clock> = {
  MENUNGGU: Clock,
  DIPROSES: Package,
  DIKIRIM: Package,
  SELESAI: Package,
  DIBATALKAN: AlertCircle,
}

const STATUS_COLOR: Record<string, string> = {
  MENUNGGU: 'bg-amber-100 text-amber-800 border-amber-200',
  DIPROSES: 'bg-blue-100 text-blue-800 border-blue-200',
  DIKIRIM: 'bg-purple-100 text-purple-800 border-purple-200',
  SELESAI: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  DIBATALKAN: 'bg-rose-100 text-rose-800 border-rose-200',
}

export default function PesananClient({ isKonsumen: _isKonsumen }: { isKonsumen: boolean }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/pesanan')
        if (!res.ok) {
          if (res.status === 401) return
          throw new Error('Gagal mengambil pesanan')
        }
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        toast.error('Gagal memuat pesanan')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 selection:bg-brand-green/20 selection:text-brand-green">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/belanja" className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Pesanan Saya</h1>
            <p className="text-xs text-slate-500">Riwayat belanja kamu</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                      <Skeleton className="h-3 w-1/3 rounded-md" />
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 border-dashed shadow-sm">
            <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Pesanan</h3>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Kamu belum melakukan pemesanan apapun. Yuk, mulai belanja hasil tani segar langsung dari petani!
            </p>
            <Link href="/belanja">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-12 px-8 shadow-lg shadow-brand-green/20">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = STATUS_ICON[order.status] || Clock
            return (
              <Link
                key={order.id}
                href={`/pesanan/${order.id}`}
                className="block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-green/20 transition-all group overflow-hidden"
              >
                {/* Header: Farmer + Status */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4 text-brand-green" />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm truncate">{order.farmer.nama}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-brand-green transition-colors" />
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLOR[order.status] || 'bg-slate-100 text-slate-600'}`}>
                    <StatusIcon className="w-3 h-3" />
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="px-4 py-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 truncate">
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-slate-400 mx-1">×</span>
                        <span className="text-slate-500">{item.qty}</span>
                      </span>
                      <span className="font-semibold text-slate-800 shrink-0 ml-2">
                        {formatRupiah(Number(item.subtotal))}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: Total + Date */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Total:</span>
                    <span className="font-extrabold text-slate-900 text-base">
                      {formatRupiah(Number(order.grandTotal))}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-md mx-auto flex items-center justify-around h-16">
          <Link href="/belanja" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Beranda</span>
          </Link>

          <Link href="/pesanan" className="flex flex-col items-center justify-center w-full h-full text-brand-green">
            <ListOrdered className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Pesanan</span>
          </Link>

          <Link href="/profil" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
