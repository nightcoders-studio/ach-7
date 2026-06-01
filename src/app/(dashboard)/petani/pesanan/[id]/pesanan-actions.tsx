'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PesananActions({ orderId, status }: { orderId: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  async function doAction(action: string) {
    startTransition(async () => {
      const res = await fetch(`/api/petani/pesanan/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Gagal memproses pesanan')
        return
      }
      router.refresh()
    })
  }

  if (status === 'SELESAI' || status === 'DIBATALKAN') return null

  return (
    <div className="flex flex-col gap-3">
      {status === 'MENUNGGU' && (
        <>
          <button
            onClick={() => doAction('terima')}
            disabled={pending}
            className="w-full rounded-lg bg-green-700 py-3 text-white font-medium text-base hover:bg-green-800 disabled:opacity-50"
          >
            {pending ? 'Memproses...' : '✓ Terima Pesanan'}
          </button>
          <button
            onClick={() => doAction('tolak')}
            disabled={pending}
            className="w-full rounded-lg border border-red-300 py-3 text-red-600 font-medium text-base hover:bg-red-50 disabled:opacity-50"
          >
            ✕ Tolak Pesanan
          </button>
        </>
      )}
      {status === 'DIPROSES' && (
        <button
          onClick={() => doAction('kirim')}
          disabled={pending}
          className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium text-base hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'Memproses...' : '📦 Tandai Sudah Dikirim'}
        </button>
      )}
      {status === 'DIKIRIM' && (
        <div className="rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
          Menunggu konfirmasi dari pembeli
        </div>
      )}
    </div>
  )
}
