import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { OrderStatus } from '@/generated/prisma/client'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const order = await prisma.order.findFirst({
    where: { id, farmerId: user.id },
    include: {
      konsumen: { select: { nama: true, no_hp: true, alamat: true } },
      items: true,
      transaction: { select: { metodeBayar: true, statusPayment: true } },
    },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(order)
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const order = await prisma.order.findFirst({ where: { id, farmerId: user.id } })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const { action } = body

  let newStatus: OrderStatus
  if (action === 'terima' && order.status === 'MENUNGGU') newStatus = 'DIPROSES' as OrderStatus
  else if (action === 'tolak' && order.status === 'MENUNGGU') newStatus = 'DIBATALKAN' as OrderStatus
  else if (action === 'kirim' && order.status === 'DIPROSES') newStatus = 'DIKIRIM' as OrderStatus
  else return NextResponse.json({ error: 'Aksi tidak valid untuk status ini' }, { status: 400 })

  await prisma.order.update({ where: { id }, data: { status: newStatus } })

  return NextResponse.json({ success: true, status: newStatus })
}
