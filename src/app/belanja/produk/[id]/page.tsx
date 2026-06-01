import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProdukDetailClient from './produk-detail-client'

export const metadata: Metadata = {
  title: 'Detail Produk - PanganTanyoe',
  description: 'Detail produk hasil tani segar di PanganTanyoe.',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ProdukDetailPage(props: PageProps) {
  const { id } = await props.params
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

  return <ProdukDetailClient productId={id} isKonsumen={isKonsumen} />
}
