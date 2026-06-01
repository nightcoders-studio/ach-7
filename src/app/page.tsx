import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">🌾</div>
          <h1 className="text-4xl font-bold text-green-800">Aceh Fresh</h1>
          <p className="text-lg text-gray-600">
            Pasar digital petani Aceh. Beli hasil panen segar langsung dari petani, harga terbaik tanpa perantara.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="rounded-lg bg-green-700 px-6 py-3 text-white font-medium hover:bg-green-800">
              Daftar Sekarang
            </Link>
            <Link href="/login" className="rounded-lg border border-green-700 px-6 py-3 text-green-700 font-medium hover:bg-green-50">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    )
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
    return (
      <div className="p-6 max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-green-800">👋 Halo, {profile.nama}</h1>
        <p className="text-gray-600">Dashboard petani — fitur akan segera hadir.</p>
      </div>
    )
  }

  if (profile.role === 'ADMIN') {
    return (
      <div className="p-6 max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-green-800">👋 Halo Admin</h1>
        <p className="text-gray-600">Dashboard admin — fitur akan segera hadir.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-green-800">👋 Halo, {profile.nama}</h1>
      <p className="text-gray-600">Jelajahi produk petani — fitur akan segera hadir.</p>
    </div>
  )
}
