'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function LupaPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-5xl">📧</div>
        <h1 className="text-2xl font-bold text-green-800">Cek Email Kamu</h1>
        <p className="text-gray-600">
          Kami sudah kirim tautan reset kata sandi ke <strong>{email}</strong>
        </p>
        <Link href="/login" className="text-sm text-green-600 hover:text-green-700 font-medium">
          Kembali ke halaman masuk
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-800">Lupa Kata Sandi</h1>
        <p className="text-sm text-gray-600">
          Masukkan email kamu, kami akan kirim tautan reset
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="nama@email.com" required />
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 text-base">
          {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
          Kembali ke halaman masuk
        </Link>
      </p>
    </div>
  )
}
