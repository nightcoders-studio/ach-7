import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import PesananClient from './pesanan-client'

export const metadata: Metadata = {
  title: 'Pesanan Saya - PanganTanyoe',
  description: 'Lihat riwayat pesanan Anda.',
}

export default async function PesananPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?callbackUrl=/pesanan')
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (profile?.role === 'PETANI') {
    redirect('/petani')
  }

  const isKonsumen = profile?.role === 'KONSUMEN'

  return <PesananClient isKonsumen={isKonsumen} />
}
