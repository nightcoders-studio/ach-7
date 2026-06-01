import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function SaldoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const wallet = await prisma.wallet.findUnique({ where: { farmerId: user.id } })
  const saldo = wallet?.saldo ?? 0

  const withdraws = await prisma.withdrawRequest.findMany({
    where: { farmerId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const statusLabels: Record<string, string> = {
    MENUNGGU: 'Menunggu',
    DIPROSES: 'Diproses',
    SELESAI: 'Selesai',
    DITOLAK: 'Ditolak',
  }

  const statusColors: Record<string, string> = {
    MENUNGGU: 'text-yellow-600 bg-yellow-50',
    DIPROSES: 'text-blue-600 bg-blue-50',
    SELESAI: 'text-green-600 bg-green-50',
    DITOLAK: 'text-red-600 bg-red-50',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Saldo</h1>

      <div className="rounded-xl bg-gradient-to-r from-green-700 to-green-600 p-6 text-white shadow-sm">
        <p className="text-sm text-green-100 mb-1">Saldo Tersedia</p>
        <p className="text-4xl font-bold mb-4">Rp {Number(saldo).toLocaleString('id-ID')}</p>
        <Link
          href="/petani/saldo/tarik"
          className="inline-block rounded-lg bg-white text-green-700 px-6 py-2.5 text-sm font-semibold hover:bg-green-50"
        >
          Tarik Dana
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Riwayat Penarikan</h2>

        {withdraws.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500">Belum ada riwayat penarikan.</p>
          </div>
        )}

        {withdraws.map((w) => (
          <div key={w.id} className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">Rp {Number(w.nominal).toLocaleString('id-ID')}</p>
              <p className="text-xs text-gray-400">
                {w.rekeningBank} — {w.noRekening}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(w.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[w.status]}`}>
              {statusLabels[w.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
