import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const orders = await prisma.order.findMany({
    where: { farmerId: user.id },
    include: {
      konsumen: { select: { nama: true } },
      items: { select: { productName: true, qty: true, subtotal: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}
