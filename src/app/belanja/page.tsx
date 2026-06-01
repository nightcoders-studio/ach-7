import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import BelanjaClient from './belanja-client'

export const metadata: Metadata = {
  title: 'Belanja - PanganTanyoe',
  description: 'Jelajahi produk hasil tani segar langsung dari petani.',
}

export default async function BelanjaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isKonsumen = false

  if (user) {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    
    // Farmers shouldn't be here
    if (profile?.role === 'PETANI') {
      redirect('/petani')
    }
    
    if (profile?.role === 'KONSUMEN') {
      isKonsumen = true
    }
  }

  return <BelanjaClient isKonsumen={isKonsumen} />
}
