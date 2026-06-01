'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/petani/produk" className="text-gray-500 hover:text-gray-700">← Kembali</Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Produk</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
          <input type="text" value={form.namaProduk} onChange={(e) => update('namaProduk', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Contoh: Cabai Merah Keriting" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select value={form.kategori} onChange={(e) => update('kategori', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
            {kategoriList.map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga per Kg (Rp)</label>
            <input type="number" value={form.hargaPerKg} onChange={(e) => update('hargaPerKg', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="15000" min={0} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input type="number" value={form.stok} onChange={(e) => update('stok', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="50" min={0} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
          <select value={form.satuan} onChange={(e) => update('satuan', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
            <option value="kg">Kg</option>
            <option value="gram">Gram</option>
            <option value="liter">Liter</option>
            <option value="ikat">Ikat</option>
            <option value="biji">Biji</option>
            <option value="ekor">Ekor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Foto (opsional)</label>
          <input type="url" value={form.foto} onChange={(e) => update('foto', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
          <textarea value={form.deskripsi} onChange={(e) => update('deskripsi', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Kualitas, asal, catatan lain..." rows={2} />
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 text-base">
          {loading ? 'Menyimpan...' : 'Publikasikan'}
        </Button>
      </form>
    </div>
  )
}
