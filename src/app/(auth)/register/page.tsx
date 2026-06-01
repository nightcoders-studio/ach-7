'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, ShoppingCart, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [role, setRole] = useState<'KONSUMEN' | 'PETANI'>('KONSUMEN')
  
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
    const emailToUse = form.email.trim() !== '' ? form.email : `${form.noHp}@pangantanyoe.local`

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailToUse,
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

    const payload = {
      userId: authData.user.id,
      email: emailToUse,
      nama: form.nama,
      noHp: form.noHp,
      role: role,
      ...(role === 'PETANI' && {
        nik: form.nik,
        alamatLahan: form.alamatLahan,
        rekeningBank: form.rekeningBank,
        noRekening: form.noRekening,
        namaPemilikRekening: form.namaPemilikRekening,
      })
    }

    const res = await fetch('/api/auth/create-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
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
    <div className="w-full max-w-lg mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-brand-green tracking-tight mb-2">Buat Akun Baru</h1>
        <p className="text-brand-green/80 italic">Pilih peran Anda dalam ekosistem PanganTanyoe.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => setRole('KONSUMEN')}
          className={`relative flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-white transition-all duration-300 ${
            role === 'KONSUMEN' ? 'shadow-lg border-brand-green' : 'shadow-sm border-transparent opacity-60 hover:opacity-100'
          }`}
        >
          {role === 'KONSUMEN' && (
            <div className="absolute top-3 right-3 w-2 h-2 bg-brand-green rounded-full" />
          )}
          <ShoppingCart className={`w-8 h-8 mb-3 ${role === 'KONSUMEN' ? 'text-brand-green' : 'text-slate-400'}`} />
          <span className={`text-sm font-bold tracking-wider ${role === 'KONSUMEN' ? 'text-brand-green' : 'text-slate-500'}`}>PEMBELI</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('PETANI')}
          className={`relative flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-white transition-all duration-300 ${
            role === 'PETANI' ? 'shadow-lg border-brand-green' : 'shadow-sm border-transparent opacity-60 hover:opacity-100'
          }`}
        >
          {role === 'PETANI' && (
            <div className="absolute top-3 right-3 w-2 h-2 bg-brand-green rounded-full" />
          )}
          <Sprout className={`w-8 h-8 mb-3 ${role === 'PETANI' ? 'text-brand-green' : 'text-slate-400'}`} />
          <span className={`text-sm font-bold tracking-wider ${role === 'PETANI' ? 'text-brand-green' : 'text-slate-500'}`}>PETANI</span>
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-8">
        
        {/* Section: Profil */}
        <div className="space-y-4">
          <h3 className="flex items-center text-brand-green text-sm font-bold tracking-widest uppercase">
            <span className="w-4 h-[2px] bg-brand-green mr-2" />
            Profil {role === 'PETANI' ? 'Petani' : 'Pembeli'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-green">Nama Lengkap</label>
              <input type="text" value={form.nama} onChange={(e) => updateField('nama', e.target.value)}
                className="block w-full rounded-xl border border-brand-green/20 bg-transparent px-4 py-3 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green text-slate-800"
                placeholder="Contoh: Ahmad Fauzi" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-green">Nomor WhatsApp</label>
              <input type="tel" value={form.noHp} onChange={(e) => updateField('noHp', e.target.value)}
                className="block w-full rounded-xl border border-brand-green/20 bg-transparent px-4 py-3 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green text-slate-800"
                placeholder="Contoh: 081234567890" required />
            </div>
          </div>
        </div>

        {/* Section: Data Petani */}
        <AnimatePresence>
          {role === 'PETANI' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8 overflow-hidden"
            >
              <div className="space-y-4">
                <h3 className="flex items-center text-brand-green text-sm font-bold tracking-widest uppercase">
                  <span className="w-4 h-[2px] bg-brand-green mr-2" />
                  Data Petani
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-brand-green">NIK KTP</label>
                    <input type="text" value={form.nik} onChange={(e) => updateField('nik', e.target.value)}
                      className="block w-full rounded-xl border border-brand-green/20 bg-transparent px-4 py-3 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green text-slate-800"
                      placeholder="16-digit Nomor KTP" required={role === 'PETANI'} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-brand-green">Alamat Lahan / Sawah</label>
                    <input type="text" value={form.alamatLahan} onChange={(e) => updateField('alamatLahan', e.target.value)}
                      className="block w-full rounded-xl border border-brand-green/20 bg-transparent px-4 py-3 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green text-slate-800"
                      placeholder="Contoh: Gampong Lamreung" required={role === 'PETANI'} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="flex items-center text-brand-green text-sm font-bold tracking-widest uppercase">
                  <span className="w-4 h-[2px] bg-brand-green mr-2" />
                  Informasi Rekening Bank
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-brand-green">Nama Bank</label>
                      <input type="text" value={form.rekeningBank} onChange={(e) => updateField('rekeningBank', e.target.value)}
                        className="block w-full rounded-xl border border-brand-green/20 bg-transparent px-4 py-3 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green text-slate-800"
                        placeholder="Contoh: BSI, BCA, BRI" required={role === 'PETANI'} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-brand-green">Nomor Rekening</label>
                      <input type="text" value={form.noRekening} onChange={(e) => updateField('noRekening', e.target.value)}
                        className="block w-full rounded-xl border border-brand-green/20 bg-transparent px-4 py-3 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green text-slate-800"
                        placeholder="Contoh: 1234567890" required={role === 'PETANI'} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-brand-green">Nama Pemilik Rekening</label>
                    <input type="text" value={form.namaPemilikRekening} onChange={(e) => updateField('namaPemilikRekening', e.target.value)}
                      className="block w-full rounded-xl border border-brand-green/20 bg-transparent px-4 py-3 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green text-slate-800"
                      placeholder="Nama sesuai buku tabungan" required={role === 'PETANI'} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section: Kredensial */}
        <div className="space-y-4">
          <h3 className="flex items-center text-brand-green text-sm font-bold tracking-widest uppercase">
            <span className="w-4 h-[2px] bg-brand-green mr-2" />
            Kredensial Akun
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-green">Email (Opsional)</label>
              <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                className="block w-full rounded-xl border border-transparent bg-[#FEF9C3] px-4 py-3 text-sm transition-colors focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-slate-800"
                placeholder="nama@email.com" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-brand-green">Kata Sandi</label>
              <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)}
                className="block w-full rounded-xl border border-transparent bg-[#FEF9C3] px-4 py-3 text-sm transition-colors focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-slate-800"
                placeholder="••••••••" minLength={6} required />
            </div>
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">{error}</div>}

        <div className="pt-6 space-y-4">
          <p className="text-xs text-center text-slate-500">
            Dengan mendaftar, Anda menyetujui <Link href="#" className="font-semibold text-brand-green hover:underline">Syarat & Ketentuan</Link> serta <Link href="#" className="font-semibold text-brand-green hover:underline">Kebijakan Privasi</Link> PanganTanyoe.
          </p>

          <Button type="submit" disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green/90 transition-colors text-white py-6 text-base font-semibold rounded-xl">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Daftar Sebagai ${role === 'PETANI' ? 'Petani' : 'Pembeli'}`}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-brand-green hover:text-brand-green/80 font-semibold transition-colors">
              Masuk Sekarang
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

