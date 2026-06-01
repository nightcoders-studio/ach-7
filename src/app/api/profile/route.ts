import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
        nama: true,
        email: true,
        no_hp: true,
        foto: true,
        alamat: true,
        createdAt: true,
        _count: {
          select: {
            ordersAsKonsumen: true,
          },
        },
        ordersAsKonsumen: {
          where: { status: 'SELESAI' },
          select: {
            grandTotal: true,
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const totalSpending = profile.ordersAsKonsumen.reduce(
      (sum, o) => sum + Number(o.grandTotal), 0
    )

    return NextResponse.json({
      id: profile.id,
      role: profile.role,
      nama: profile.nama,
      email: profile.email,
      no_hp: profile.no_hp,
      foto: profile.foto,
      alamat: profile.alamat,
      createdAt: profile.createdAt.toISOString(),
      stats: {
        totalOrders: profile._count.ordersAsKonsumen,
        completedOrders: profile.ordersAsKonsumen.length,
        totalSpending,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nama, no_hp, alamat } = body

    const updateData: Record<string, string> = {}
    if (typeof nama === 'string' && nama.trim()) updateData.nama = nama.trim()
    if (typeof no_hp === 'string') updateData.no_hp = no_hp.trim() || ''
    if (typeof alamat === 'string') updateData.alamat = alamat.trim() || ''

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diubah' }, { status: 400 })
    }

    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        nama: true,
        email: true,
        no_hp: true,
        foto: true,
        alamat: true,
        role: true,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
