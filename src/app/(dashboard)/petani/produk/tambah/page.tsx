'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PackagePlus, Save, Loader2, Tag, Image as ImageIcon, FileText } from 'lucide-react'

const kategoriList = [
  { value: 'SAYUR', label: 'Sayur' },
  { value: 'BUAH', label: 'Buah' },
  { value: 'BERAS', label: 'Beras' },
  { value: 'CABAI', label: 'Cabai' },
  { value: 'BAWANG', label: 'Bawang' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

export default function TambahProdukPage() {
  const [form, setForm] = useState({
    namaProduk: '', kategori: 'SAYUR', hargaPerKg: '', stok: '', satuan: 'kg', deskripsi: '', foto: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/petani/produk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        namaProduk: form.namaProduk,
        kategori: form.kategori,
        hargaPerKg: parseFloat(form.hargaPerKg) || 0,
        stok: parseInt(form.stok) || 0,
        satuan: form.satuan,
        deskripsi: form.deskripsi || null,
        foto: form.foto || null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Gagal menyimpan produk')
      setLoading(false)
      return
    }

    router.push('/petani/produk')
    router.refresh()
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/petani/produk" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tambah Produk</h1>
          <p className="text-sm text-slate-500">Masukkan detail produk hasil panen baru Anda ke etalase.</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <PackagePlus className="w-48 h-48 text-brand-green" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Tag className="w-5 h-5 text-brand-green" />
              Informasi Dasar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">Nama Produk</label>
                <input 
                  type="text" 
                  value={form.namaProduk} 
                  onChange={(e) => update('namaProduk', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 focus:outline-none"
                  placeholder="Contoh: Cabai Merah Keriting Premium" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Kategori</label>
                <select 
                  value={form.kategori} 
                  onChange={(e) => update('kategori', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 focus:outline-none appearance-none bg-white"
                >
                  {kategoriList.map((k) => (
                    <option key={k.value} value={k.value}>{k.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Satuan Jual</label>
                <select 
                  value={form.satuan} 
                  onChange={(e) => update('satuan', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 focus:outline-none appearance-none bg-white"
                >
                  <option value="kg">Kilogram (Kg)</option>
                  <option value="gram">Gram</option>
                  <option value="liter">Liter</option>
                  <option value="ikat">Ikat</option>
                  <option value="biji">Biji</option>
                  <option value="ekor">Ekor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold">Rp</span>
              Harga & Stok
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Harga per {form.satuan.charAt(0).toUpperCase() + form.satuan.slice(1)}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium sm:text-sm">Rp</span>
                  </div>
                  <input 
                    type="number" 
                    value={form.hargaPerKg} 
                    onChange={(e) => update('hargaPerKg', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-2.5 text-sm transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 focus:outline-none"
                    placeholder="15000" 
                    min={0} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Total Stok</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={form.stok} 
                    onChange={(e) => update('stok', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 pr-16 pl-4 py-2.5 text-sm transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 focus:outline-none"
                    placeholder="50" 
                    min={0} 
                    required 
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium sm:text-sm">{form.satuan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 text-brand-green" />
              Detail Tambahan
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">URL Foto (opsional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <input 
                    type="url" 
                    value={form.foto} 
                    onChange={(e) => update('foto', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 focus:outline-none"
                    placeholder="https://..." 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Deskripsi Produk (opsional)</label>
                <textarea 
                  value={form.deskripsi} 
                  onChange={(e) => update('deskripsi', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 focus:outline-none resize-y"
                  placeholder="Ceritakan tentang kualitas, asal panen, atau catatan lain..." 
                  rows={4} 
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm flex items-start">
                <span className="block">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Publikasikan Produk
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
