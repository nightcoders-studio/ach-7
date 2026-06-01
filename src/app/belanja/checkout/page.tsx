import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import CheckoutClient from './checkout-client'

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ productId?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { productId } = await searchParams

  if (!user) {
    redirect('/login?callbackUrl=/belanja/checkout?productId=' + productId)
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  if (profile?.role !== 'KONSUMEN') {
    redirect('/belanja')
  }

  if (!productId) {
    redirect('/belanja')
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      farmer: {
        select: { nama: true }
      }
    }
  })

  if (!product || product.stok === 0) {
    redirect('/belanja')
  }

  const serializedProduct = {
    ...product,
    hargaPerKg: Number(product.hargaPerKg),
  }

  const userProfile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { alamat: true }
  })

  const initialAddress = userProfile?.alamat || ''

  return (
    <CheckoutClient 
      product={serializedProduct} 
      initialAddress={initialAddress} 
    />
  )
}
