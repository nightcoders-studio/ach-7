import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      farmer: {
        select: {
          id: true,
          nama: true,
          foto: true,
          farmerProfile: { select: { alamatLahan: true } },
          reviewsAsFarmer: { select: { rating: true } },
        },
      },
    },
  })

  if (!product) {
    return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })
  }

  const ratings = product.farmer.reviewsAsFarmer.map((r) => r.rating)
  const avgRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : null

  const { reviewsAsFarmer, ...farmerInfo } = product.farmer

  return NextResponse.json({
    ...product,
    farmer: { ...farmerInfo, avgRating, totalReview: ratings.length },
  })
}
