'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-800">PanganTanyoe</h1>
        <p className="text-gray-600">Masuk ke akun kamu</p>
      </div>

      {searchParams.get('error') && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {searchParams.get('error') === 'auth_callback_error'
            ? 'Gagal memproses autentikasi. Silakan coba lagi.'
            : searchParams.get('error')}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="nama@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kata Sandi
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex justify-end">
          <Link
            href="/lupa-password"
            className="text-sm text-green-600 hover:text-green-700"
          >
            Lupa kata sandi?
          </Link>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error === 'Invalid login credentials'
              ? 'Email atau kata sandi salah.'
              : error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 text-base"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Belum punya akun?{' '}
        <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
          Daftar
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  )
}
