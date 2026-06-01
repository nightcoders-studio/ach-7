import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { LandingPage } from '@/components/landing-page'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <LandingPage />
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true, nama: true },
  })

  if (!profile) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <p className="text-gray-600">Profil kamu belum lengkap.</p>
        <a href="/register" className="inline-block rounded-lg bg-green-700 px-6 py-3 text-white font-medium hover:bg-green-800">
          Lengkapi Profil
        </a>
      </div>
    )
  }

  if (profile.role === 'PETANI') {
    redirect('/petani')
  }

  if (profile.role === 'ADMIN') {
    return (
      <div className="p-6 max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-green-800">👋 Halo Admin</h1>
        <p className="text-gray-600">Dashboard admin — fitur akan segera hadir.</p>
      </div>
    )
  }

  // Redirect KONSUMEN to Browse Produk
  redirect('/belanja')
}
