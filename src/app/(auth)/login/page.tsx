'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
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
      <motion.div variants={item} className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-brand-green/10 rounded-full mb-4">
          <Leaf className="w-8 h-8 text-brand-green" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang Kembali</h1>
        <p className="text-slate-500">Masuk ke akun PanganTanyoe Anda</p>
      </motion.div>

      {searchParams.get('error') && (
        <motion.div variants={item} className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {searchParams.get('error') === 'auth_callback_error'
            ? 'Gagal memproses autentikasi. Silakan coba lagi.'
            : searchParams.get('error')}
        </motion.div>
      )}

      <motion.form variants={item} onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              placeholder="nama@email.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/lupa-password"
            className="text-sm font-medium text-brand-green hover:text-brand-green/80 transition-colors"
          >
            Lupa kata sandi?
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
            {error === 'Invalid login credentials'
              ? 'Email atau kata sandi salah.'
              : error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-green to-brand-orange hover:opacity-90 transition-opacity text-white py-6 text-base font-semibold rounded-xl shadow-lg shadow-brand-green/20"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </motion.form>

      <motion.p variants={item} className="text-center text-sm text-slate-500">
        Belum punya akun?{' '}
        <Link href="/register" className="text-brand-green hover:text-brand-green/80 font-semibold transition-colors">
          Daftar Sekarang
        </Link>
      </motion.p>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-slate-500">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  )
}
