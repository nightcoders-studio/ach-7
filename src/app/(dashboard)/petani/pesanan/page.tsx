import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const statusLabels: Record<string, string> = {
  MENUNGGU: 'Menunggu',
  DIPROSES: 'Diproses',
  DIKIRIM: 'Dikirim',
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

export default async function PesananPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const orders = await prisma.order.findMany({
    where: { farmerId: user.id },
    include: {
      konsumen: { select: { nama: true } },
      items: { select: { productName: true, qty: true, subtotal: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pesanan Masuk</h1>

      {orders.length === 0 && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm border border-gray-100">
          <p className="text-5xl mb-3">📋</p>
          <p className="text-gray-500">Belum ada pesanan masuk.</p>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/petani/pesanan/${order.id}`}
            className="block rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:border-green-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="font-semibold text-gray-800">
                  {order.items[0]?.productName}{order.items.length > 1 ? ` + ${order.items.length - 1} lainnya` : ''}
                </p>
                <p className="text-sm text-gray-500">
                  {order.konsumen.nama} — Rp {Number(order.grandTotal).toLocaleString('id-ID')}
                </p>
              </div>
              <span className="text-gray-400 text-lg">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
