import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

async function getUser(request?: Request) {
  const supabase = await createClient()
  const token = request?.headers.get('Authorization')?.slice(7)
  const { data: { user } } = await supabase.auth.getUser(token ?? undefined)
  return user
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'KONSUMEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const order = await prisma.order.findFirst({
    where: { id, konsumenId: user.id },
    include: {
      farmer: { select: { id: true, nama: true, foto: true, no_hp: true } },
      items: true,
      transaction: { select: { metodeBayar: true, statusPayment: true } },
      review: { select: { rating: true, komentar: true, createdAt: true } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })

  return NextResponse.json(order)
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'KONSUMEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const order = await prisma.order.findFirst({
    where: { id, konsumenId: user.id },
  })
  if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })

  const body = await request.json()
  const { action } = body

  if (action === 'terima') {
    if (order.status !== 'DIKIRIM') {
      return NextResponse.json({ error: 'Pesanan belum dikirim' }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: 'SELESAI' },
      })

      await tx.wallet.upsert({
        where: { farmerId: order.farmerId },
        create: {
          farmerId: order.farmerId,
          saldo: order.grandTotal,
        },
        update: {
          saldo: { increment: order.grandTotal },
        },
      })
    })

    return NextResponse.json({ success: true, status: 'SELESAI' })
  }

  if (action === 'batalkan') {
    if (!['MENUNGGU', 'DIPROSES'].includes(order.status)) {
      return NextResponse.json({ error: 'Pesanan tidak bisa dibatalkan' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id },
      data: { status: 'DIBATALKAN' },
    })

    return NextResponse.json({ success: true, status: 'DIBATALKAN' })
  }

  return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 })
}
