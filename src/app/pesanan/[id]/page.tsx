import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import PesananDetailClient from './pesanan-detail-client'

export const metadata: Metadata = {
  title: 'Detail Pesanan - PanganTanyoe',
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PesananDetailPage(props: PageProps) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?callbackUrl=/pesanan/${id}`)
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (profile?.role === 'PETANI') {
    redirect('/petani')
  }

  return <PesananDetailClient orderId={id} />
}
