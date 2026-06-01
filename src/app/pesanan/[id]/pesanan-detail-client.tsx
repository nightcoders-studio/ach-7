'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Store, MapPin, Phone, CreditCard, Clock, CheckCircle2, Circle, Package, Truck, XCircle, Loader2, ChevronRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

type OrderItem = {
  id: string
  productId: string
  productName: string
  qty: number
  hargaSatuan: number
  subtotal: number
}

type Transaction = {
  metodeBayar: string
  statusPayment: string
}

type OrderDetail = {
  id: string
  status: string
  totalHarga: number
  ongkir: number
  grandTotal: number
  alamatPengiriman: string
  catatan: string | null
  createdAt: string
  farmer: {
    id: string
    nama: string
    foto: string | null
    no_hp: string | null
  }
  items: OrderItem[]
  transaction: Transaction | null
  review: { rating: number; komentar: string; createdAt: string } | null
}

const STEPS = [
  { key: 'MENUNGGU', label: 'Menunggu', icon: Circle },
  { key: 'DIPROSES', label: 'Diproses', icon: Package },
  { key: 'DIKIRIM', label: 'Dikirim', icon: Truck },
  { key: 'SELESAI', label: 'Selesai', icon: CheckCircle2 },
]

const STATUS_COLOR: Record<string, string> = {
  MENUNGGU: 'bg-amber-100 text-amber-800 border-amber-200',
  DIPROSES: 'bg-blue-100 text-blue-800 border-blue-200',
  DIKIRIM: 'bg-purple-100 text-purple-800 border-purple-200',
  SELESAI: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  DIBATALKAN: 'bg-rose-100 text-rose-800 border-rose-200',
}

export default function PesananDetailClient({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/pesanan/${orderId}`)
        if (!res.ok) throw new Error('Pesanan tidak ditemukan')
        const data = await res.json()
        setOrder(data)
      } catch {
        toast.error('Gagal memuat detail pesanan')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handleAction = async (action: 'terima' | 'batalkan') => {
    setActionLoading(action)
    try {
      const res = await fetch(`/api/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses')
      }

      toast.success(
        action === 'terima' ? 'Pesanan telah diterima!' : 'Pesanan dibatalkan'
      )

      setOrder((prev) => prev ? { ...prev, status: data.status } : prev)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setActionLoading(null)
    }
  }

  const statusIndex = STEPS.findIndex((s) => s.key === order?.status)
  const isCancelled = order?.status === 'DIBATALKAN'

  if (loading) {
    return <DetailSkeleton />
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-slate-100">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Pesanan Tidak Ditemukan</h1>
          <p className="text-slate-600 mb-8">Pesanan yang kamu cari tidak tersedia.</p>
          <Button onClick={() => router.push('/pesanan')} className="w-full bg-brand-green hover:bg-brand-green/90 rounded-xl h-12">
            Kembali ke Pesanan
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800 selection:bg-brand-green/20 selection:text-brand-green">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 h-16 flex items-center gap-3 shadow-sm">
        <button onClick={() => router.push('/pesanan')} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Detail Pesanan</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {isCancelled ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-rose-500" />
              </div>
              <span className="text-rose-600 font-bold text-lg mb-1">Pesanan Dibatalkan</span>
              <span className="text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          ) : (
            <div className="flex items-start justify-between relative">
              {STEPS.map((step, idx) => {
                const isActive = idx <= statusIndex
                const isLast = idx === STEPS.length - 1
                const Icon = step.icon

                return (
                  <div key={step.key} className="flex items-center flex-1 relative">
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? 'bg-brand-green text-white shadow-md shadow-brand-green/30 scale-110'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                      </div>
                      <span className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                        isActive ? 'text-brand-green' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div className={`flex-1 h-1 mx-2 mt-[-28px] rounded-full transition-all duration-500 ${
                        idx < statusIndex ? 'bg-brand-green' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Farmer Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-md relative shrink-0">
              {order.farmer.foto ? (
                <Image src={order.farmer.foto} alt={order.farmer.nama} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Store className="w-7 h-7" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-brand-green uppercase tracking-wider mb-0.5">Penjual</div>
              <h3 className="text-lg font-bold text-slate-900 truncate">{order.farmer.nama}</h3>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
          {order.farmer.no_hp && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500">
              <Phone className="w-4 h-4 text-brand-green" />
              <span>{order.farmer.no_hp}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-green" />
            Produk Dipesan
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-semibold text-slate-800">{item.productName}</p>
                  <p className="text-sm text-slate-500">
                    {item.qty} × {formatRupiah(Number(item.hargaSatuan))}
                  </p>
                </div>
                <span className="font-bold text-slate-800">{formatRupiah(Number(item.subtotal))}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-green" />
            Rincian Pembayaran
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatRupiah(Number(order.totalHarga))}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Ongkos Kirim</span>
              <span className="font-medium">{formatRupiah(Number(order.ongkir))}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Metode Bayar</span>
              <span className="font-medium">{order.transaction?.metodeBayar || '-'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Status Bayar</span>
              <span className={`font-medium ${
                order.transaction?.statusPayment === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {order.transaction?.statusPayment || '-'}
              </span>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
            <span className="font-bold text-slate-900">Total Pesanan</span>
            <span className="text-xl font-black text-brand-green tracking-tight">
              {formatRupiah(Number(order.grandTotal))}
            </span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-orange" />
            Alamat Pengiriman
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{order.alamatPengiriman}</p>
          {order.catatan && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 shrink-0" />
              <span><span className="font-semibold">Catatan:</span> {order.catatan}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {order.status === 'DIKIRIM' && (
          <Button
            onClick={() => handleAction('terima')}
            disabled={actionLoading === 'terima'}
            className="w-full h-14 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-lg rounded-2xl shadow-lg shadow-brand-green/30 hover:shadow-xl hover:shadow-brand-green/40 transition-all hover:-translate-y-1"
          >
            {actionLoading === 'terima' ? (
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="w-6 h-6 mr-2" />
            )}
            Pesanan Diterima
          </Button>
        )}

        {['MENUNGGU', 'DIPROSES'].includes(order.status) && (
          <Button
            onClick={() => handleAction('batalkan')}
            disabled={actionLoading === 'batalkan'}
            variant="outline"
            className="w-full h-12 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-2xl font-semibold transition-all"
          >
            {actionLoading === 'batalkan' ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <XCircle className="w-5 h-5 mr-2" />
            )}
            Batalkan Pesanan
          </Button>
        )}

        {order.status === 'SELESAI' && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4">
              <CheckCircle2 className="w-6 h-6" />
              Pesanan sudah diterima. Terima kasih sudah berbelanja!
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="sticky top-0 z-40 bg-white border-b px-4 h-16 flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="w-40 h-6 rounded-md" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <Skeleton className="w-full h-28 rounded-2xl" />
        <Skeleton className="w-full h-20 rounded-2xl" />
        <Skeleton className="w-full h-44 rounded-2xl" />
        <Skeleton className="w-full h-36 rounded-2xl" />
        <Skeleton className="w-full h-24 rounded-2xl" />
      </div>
    </div>
  )
}
