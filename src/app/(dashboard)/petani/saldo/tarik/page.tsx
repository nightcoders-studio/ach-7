'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Wallet, Loader2, Send } from 'lucide-react'

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
    }, 2000)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-brand-green/20 animate-pulse"></div>
          <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center relative z-10">
            <CheckCircle2 className="w-12 h-12 text-brand-green" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Berhasil Diajukan!</h2>
          <p className="text-slate-500 max-w-sm">
            Permintaan penarikan dana Anda sedang diproses oleh tim kami. Anda akan dialihkan sebentar lagi.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/petani/saldo" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tarik Dana</h1>
          <p className="text-sm text-slate-500">Tarik saldo penjualan Anda ke rekening terdaftar.</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Wallet className="w-48 h-48 text-brand-green" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Nominal Penarikan</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-500 font-bold text-lg">Rp</span>
              </div>
              <input 
                type="number" 
                value={nominal} 
                onChange={(e) => setNominal(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-14 pr-4 py-4 text-xl font-bold text-slate-800 transition-all focus:border-brand-green focus:ring-4 focus:ring-brand-green/20 focus:outline-none"
                placeholder="50000" 
                min={10000} 
                step={10000} 
                required 
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Min. penarikan Rp 10.000</span>
              <span>Kelipatan Rp 10.000</span>
            </div>
          </div>

          <div className="pt-2">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm flex items-start">
                <span className="block">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !nominal || parseFloat(nominal) < 10000}
              className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Ajukan Penarikan
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
