import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    const profile = await prisma.profile.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        foto: true,
        no_hp: true,
        alamat: true,
        farmerProfile: {
          select: {
            alamatLahan: true,
            statusVerifikasi: true,
          },
        },
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        reviewsAsFarmer: { select: { rating: true } },
      },
    })

    if (!profile || !profile.farmerProfile) {
      return NextResponse.json({ error: 'Petani tidak ditemukan' }, { status: 404 })
    }

    const ratings = profile.reviewsAsFarmer.map((r) => r.rating)
    const avgRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null

    const { reviewsAsFarmer, ...rest } = profile

    return NextResponse.json({
      ...rest,
      avgRating,
      totalReview: ratings.length,
    })
  } catch (error) {
    console.error('Farmer profile error:', error)
    return NextResponse.json({ error: 'Gagal mengambil profil petani' }, { status: 500 })
  }
}
