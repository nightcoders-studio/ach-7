'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

type Product = {
  namaProduk: string; kategori: string; hargaPerKg: number; stok: number; satuan: string; deskripsi: string | null; foto: string | null
}

export default function EditProdukPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch(`/api/petani/produk/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm(data)
        setFetching(false)
      })
      .catch(() => {
        setError('Gagal memuat data produk')
        setFetching(false)
      })
  }, [id])

  function update(key: string, value: string | number) {
    setForm((prev) => prev && { ...prev, [key]: value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setError('')
    setLoading(true)

    const res = await fetch(`/api/petani/produk/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        namaProduk: form.namaProduk,
        kategori: form.kategori,
        hargaPerKg: form.hargaPerKg,
        stok: form.stok,
        satuan: form.satuan,
        deskripsi: form.deskripsi || null,
        foto: form.foto || null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Gagal menyimpan')
      setLoading(false)
      return
    }

    router.push('/petani/produk')
    router.refresh()
  }

  if (fetching) return <p className="text-gray-500">Memuat...</p>
  if (!form) return <p className="text-red-500">Produk tidak ditemukan</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/petani/produk" className="text-gray-500 hover:text-gray-700">← Kembali</Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
          <input type="text" value={form.namaProduk} onChange={(e) => update('namaProduk', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select value={form.kategori} onChange={(e) => update('kategori', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500">
            {kategoriList.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga per Kg (Rp)</label>
            <input type="number" value={form.hargaPerKg} onChange={(e) => update('hargaPerKg', parseFloat(e.target.value) || 0)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" min={0} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input type="number" value={form.stok} onChange={(e) => update('stok', parseInt(e.target.value) || 0)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" min={0} required />
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
          <input type="url" value={form.foto || ''} onChange={(e) => update('foto', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (opsional)</label>
          <textarea value={form.deskripsi || ''} onChange={(e) => update('deskripsi', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500" rows={2} />
        </div>
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 text-base">
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  )
}
