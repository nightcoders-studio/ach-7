import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import ProfilClient from './profil-client'

export const metadata: Metadata = {
  title: 'Profil Saya - PanganTanyoe',
  description: 'Kelola profil akun Anda.',
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?callbackUrl=/profil')
  }

  return <ProfilClient userId={user.id} />
}
