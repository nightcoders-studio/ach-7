'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TarikDanaPage() {
  const [nominal, setNominal] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/petani/saldo/tarik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nominal: parseFloat(nominal) }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Gagal mengajukan penarikan')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/petani/saldo')
      router.refresh()
    }, 1500)
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-10 text-center shadow-sm border border-gray-100">
          <p className="text-5xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-green-700 mb-2">Berhasil Diajukan!</h2>
          <p className="text-gray-500">Penarikan dana sedang diproses admin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/petani/saldo" className="text-gray-500 hover:text-gray-700">← Kembali</Link>
        <h1 className="text-2xl font-bold text-gray-800">Tarik Dana</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nominal Penarikan (Rp)</label>
          <input type="number" value={nominal} onChange={(e) => setNominal(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-lg font-bold focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="50000" min={10000} step={10000} required />
          <p className="text-xs text-gray-400 mt-1">Min. Rp 10.000</p>
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 text-base">
          {loading ? 'Memproses...' : 'Ajukan Penarikan'}
        </Button>
      </form>
    </div>
  )
}
