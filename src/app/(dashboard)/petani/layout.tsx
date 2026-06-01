import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import PetaniNav from './petani-nav'

export default async function PetaniLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true, nama: true, foto: true },
  })

  if (!profile || profile.role !== 'PETANI') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <span className="font-bold text-lg">Aceh Fresh</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium hidden sm:inline">{profile.nama}</span>
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold">
            {profile.nama.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <PetaniNav />
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full pb-24 sm:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
