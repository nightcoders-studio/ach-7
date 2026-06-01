'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function RegisterPetaniPage() {
  const [form, setForm] = useState({
    nama: '', email: '', password: '', noHp: '',
    nik: '', alamatLahan: '', rekeningBank: '', noRekening: '', namaPemilikRekening: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Gagal membuat akun. Silakan coba lagi.')
      setLoading(false)
      return
    }

    const token = (await supabase.auth.getSession()).data.session?.access_token

    const res = await fetch('/api/auth/create-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        userId: authData.user.id,
        email: form.email,
        nama: form.nama,
        noHp: form.noHp,
        role: 'PETANI',
        nik: form.nik,
        alamatLahan: form.alamatLahan,
        rekeningBank: form.rekeningBank,
        noRekening: form.noRekening,
        namaPemilikRekening: form.namaPemilikRekening,
      }),
    })

    if (!res.ok) {
      setError('Gagal menyimpan profil. Silakan coba lagi.')
      setLoading(false)
      return
    }

    router.refresh()
    router.push('/')
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-800">Daftar sebagai Petani</h1>
        <p className="text-sm text-gray-600">Jual hasil panen langsung ke pembeli</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
          Data kamu akan diverifikasi oleh admin sebelum bisa menjual.
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input type="text" value={form.nama} onChange={(e) => updateField('nama', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Nama sesuai KTP" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="nama@email.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. Handphone</label>
          <input type="tel" value={form.noHp} onChange={(e) => updateField('noHp', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="0812-xxxx-xxxx" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
          <input type="text" value={form.nik} onChange={(e) => updateField('nik', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="16 digit NIK" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lahan / Sawah</label>
          <textarea value={form.alamatLahan} onChange={(e) => updateField('alamatLahan', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Contoh: Gampong Lamreung, Kec. Simpang Tiga, Aceh Besar" rows={2} required />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Data Rekening Pencairan</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
              <input type="text" value={form.rekeningBank} onChange={(e) => updateField('rekeningBank', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Contoh: BRI, BSI, Mandiri" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening</label>
              <input type="text" value={form.noRekening} onChange={(e) => updateField('noRekening', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Nomor rekening" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik Rekening</label>
              <input type="text" value={form.namaPemilikRekening} onChange={(e) => updateField('namaPemilikRekening', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Nama sesuai rekening" required />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
          <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="Min. 6 karakter" minLength={6} required />
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 text-base">
          {loading ? 'Memproses...' : 'Daftar sebagai Petani'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">Masuk</Link>
      </p>
    </div>
  )
}
