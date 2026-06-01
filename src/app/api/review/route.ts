import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function getUser(request?: Request) {
  const supabase = await createClient()
  const token = request?.headers.get('Authorization')?.slice(7)
  const { data: { user } } = await supabase.auth.getUser(token ?? undefined)
  return user
}

export async function POST(request: Request) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  })
  if (profile?.role !== 'KONSUMEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const { orderId, rating, komentar } = body

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating harus 1-5' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, konsumenId: user.id },
    })

    if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
    if (order.status !== 'SELESAI') return NextResponse.json({ error: 'Pesanan belum selesai' }, { status: 400 })

    const existing = await prisma.review.findUnique({ where: { orderId } })
    if (existing) return NextResponse.json({ error: 'Sudah memberikan review' }, { status: 409 })

    const review = await prisma.review.create({
      data: {
        orderId,
        konsumenId: user.id,
        farmerId: order.farmerId,
        rating,
        komentar: komentar || null,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan review' }, { status: 500 })
  }
}
