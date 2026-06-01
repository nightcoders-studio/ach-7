import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import PetaniProfilClient from './petani-profil-client'

export const metadata: Metadata = {
  title: 'Profil Petani - PanganTanyoe',
  description: 'Lihat profil dan produk petani.',
}

export default async function PetaniProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <PetaniProfilClient />
}
