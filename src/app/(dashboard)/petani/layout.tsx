import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import PetaniNav from './petani-nav'
import Image from 'next/image'

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/Logo.png" alt="PanganTanyoe" width={130} height={32} className="h-8 w-auto" priority />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700 hidden sm:inline">{profile.nama}</span>
          <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-brand-green/20">
            {profile.nama.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <PetaniNav />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto w-full pb-24 sm:pb-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
