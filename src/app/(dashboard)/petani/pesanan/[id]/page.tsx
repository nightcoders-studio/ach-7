import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PesananActions from './pesanan-actions'

const statusLabels: Record<string, string> = {
  MENUNGGU: 'Menunggu Konfirmasi',
  DIPROSES: 'Sedang Diproses',
  DIKIRIM: 'Dalam Pengiriman',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
}

const statusColors: Record<string, string> = {
  MENUNGGU: 'bg-yellow-100 text-yellow-800',
  DIPROSES: 'bg-blue-100 text-blue-800',
  DIKIRIM: 'bg-purple-100 text-purple-800',
  SELESAI: 'bg-green-100 text-green-800',
  DIBATALKAN: 'bg-red-100 text-red-800',
}

export default async function DetailPesananPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { id } = await params

  const order = await prisma.order.findFirst({
    where: { id, farmerId: user.id },
    include: {
      konsumen: { select: { nama: true, no_hp: true, alamat: true } },
      items: true,
      transaction: { select: { metodeBayar: true, statusPayment: true } },
    },
  })

  if (!order) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/petani/pesanan" className="text-gray-500 hover:text-gray-700">← Kembali</Link>
        <h1 className="text-2xl font-bold text-gray-800">Detail Pesanan</h1>
      </div>

      {/* Status */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.productName} <span className="text-gray-400">x{item.qty} kg</span>
              </span>
              <span className="font-medium">Rp {Number(item.subtotal).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>Rp {Number(order.totalHarga).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Ongkir</span>
            <span>Rp {Number(order.ongkir).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 text-base border-t pt-2 mt-2">
            <span>Total</span>
            <span>Rp {Number(order.grandTotal).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Buyer info */}
      <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-2">
        <h2 className="font-semibold text-gray-700">Info Pembeli</h2>
        <p className="text-sm text-gray-600">{order.konsumen.nama}</p>
        {order.konsumen.no_hp && <p className="text-sm text-gray-600">📞 {order.konsumen.no_hp}</p>}
        <p className="text-sm text-gray-600">📍 {order.alamatPengiriman}</p>
        {order.catatan && (
          <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 mt-2">
            <span className="font-medium">Catatan:</span> {order.catatan}
          </div>
        )}
      </div>

      {/* Payment info */}
      {order.transaction && (
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 space-y-1">
          <h2 className="font-semibold text-gray-700">Pembayaran</h2>
          <p className="text-sm text-gray-600">Metode: {order.transaction.metodeBayar}</p>
          <p className="text-sm text-gray-600">Status: {order.transaction.statusPayment}</p>
        </div>
      )}

      {/* Actions */}
      <PesananActions orderId={order.id} status={order.status} />
    </div>
  )
}
