import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import type { KategoriProduk } from '@/generated/prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const search = searchParams.get('search') || ''
  const kategori = searchParams.get('kategori') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))

  const where: Record<string, unknown> = { isActive: true }

  if (search) {
    where.namaProduk = { contains: search, mode: 'insensitive' }
  }

  if (kategori) {
    where.kategori = kategori as KategoriProduk
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        farmer: { select: { id: true, nama: true, foto: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
