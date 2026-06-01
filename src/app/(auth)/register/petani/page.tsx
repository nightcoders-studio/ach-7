'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Sprout, User, Mail, Phone, Lock, ArrowLeft, CreditCard, Landmark, MapPin, BadgeInfo } from 'lucide-react'

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="relative text-center space-y-2">
        <Link href="/register" className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-brand-orange transition-colors bg-slate-50 hover:bg-brand-orange/10 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="inline-flex items-center justify-center p-3 bg-brand-orange/10 rounded-full mb-4">
          <Sprout className="w-8 h-8 text-brand-orange" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar sebagai Petani</h1>
        <p className="text-sm text-slate-500">Jual hasil panen langsung ke pembeli</p>
      </motion.div>

      <motion.form variants={item} onSubmit={handleRegister} className="space-y-4">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 shadow-sm flex gap-3">
          <BadgeInfo className="w-5 h-5 text-yellow-600 shrink-0" />
          <p>Data kamu akan diverifikasi oleh admin sebelum bisa menjual hasil panen.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Nama Lengkap</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input type="text" value={form.nama} onChange={(e) => updateField('nama', e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              placeholder="Nama sesuai KTP" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              placeholder="nama@email.com" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">No. Handphone</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-slate-400" />
            </div>
            <input type="tel" value={form.noHp} onChange={(e) => updateField('noHp', e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              placeholder="0812-xxxx-xxxx" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">NIK</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-slate-400" />
            </div>
            <input type="text" value={form.nik} onChange={(e) => updateField('nik', e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              placeholder="16 digit Nomor Induk Kependudukan" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Alamat Lahan / Sawah</label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <textarea value={form.alamatLahan} onChange={(e) => updateField('alamatLahan', e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 min-h-[80px]"
              placeholder="Contoh: Gampong Lamreung, Kec. Simpang Tiga, Aceh Besar" required />
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-brand-orange" />
            Data Rekening Pencairan
          </h3>
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Bank</label>
              <input type="text" value={form.rekeningBank} onChange={(e) => updateField('rekeningBank', e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                placeholder="Contoh: BRI, BSI, Mandiri" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">No. Rekening</label>
              <input type="text" value={form.noRekening} onChange={(e) => updateField('noRekening', e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                placeholder="Nomor rekening" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Nama Pemilik Rekening</label>
              <input type="text" value={form.namaPemilikRekening} onChange={(e) => updateField('namaPemilikRekening', e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                placeholder="Nama sesuai rekening" required />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="block text-sm font-semibold text-slate-700">Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              placeholder="Min. 6 karakter" minLength={6} required />
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">{error}</div>}

        <Button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-brand-orange to-brand-green hover:opacity-90 transition-opacity text-white py-6 text-base font-semibold rounded-xl shadow-lg shadow-brand-orange/20 mt-4">
          {loading ? 'Memproses...' : 'Daftar sebagai Petani'}
        </Button>
      </motion.form>

      <motion.p variants={item} className="text-center text-sm text-slate-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-brand-orange hover:text-brand-orange/80 font-semibold transition-colors">Masuk Sekarang</Link>
      </motion.p>
    </motion.div>
  )
}
