import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { MetodeBayar } from '@/generated/prisma/client'

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
    const { farmerId, items, alamatPengiriman, ongkir, catatan, metodeBayar } = body

    if (!farmerId || !items?.length || !alamatPengiriman || !metodeBayar) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    if (!['TRANSFER', 'QRIS'].includes(metodeBayar)) {
      return NextResponse.json({ error: 'Metode bayar tidak valid' }, { status: 400 })
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: items.map((i: { productId: string }) => i.productId) },
        farmerId,
        isActive: true,
      },
    })

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Beberapa produk tidak tersedia' }, { status: 400 })
    }

    const orderItemsData = items.map((item: { productId: string; qty: number }) => {
      const product = products.find((p) => p.id === item.productId)!
      if (item.qty < 1) throw new Error('Qty minimal 1')
      if (item.qty > product.stok) throw new Error(`Stok ${product.namaProduk} tidak cukup`)
      return {
        productId: product.id,
        productName: product.namaProduk,
        qty: item.qty,
        hargaSatuan: product.hargaPerKg,
        subtotal: product.hargaPerKg.mul(item.qty),
      }
    })

    const totalHarga = orderItemsData.reduce(
      (sum: number, item: { subtotal: number }) => sum + Number(item.subtotal),
      0
    )
    const grandTotal = Math.round(totalHarga + (parseFloat(ongkir) || 0))

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId)!
        await tx.product.update({
          where: { id: product.id },
          data: { stok: product.stok - item.qty },
        })
      }

      const newOrder = await tx.order.create({
        data: {
          konsumenId: user.id,
          farmerId,
          totalHarga,
          ongkir: ongkir || 0,
          grandTotal,
          catatan: catatan || null,
          alamatPengiriman,
          items: { create: orderItemsData },
          transaction: {
            create: {
              metodeBayar: metodeBayar as MetodeBayar,
            },
          },
        },
        include: {
          items: true,
          transaction: { select: { id: true, metodeBayar: true, statusPayment: true } },
        },
      })

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat pesanan'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    if (profile?.role !== 'KONSUMEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const orders = await prisma.order.findMany({
      where: { konsumenId: user.id },
      include: {
        farmer: { select: { id: true, nama: true, foto: true } },
        items: { select: { productName: true, qty: true, subtotal: true } },
        transaction: { select: { metodeBayar: true, statusPayment: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('List orders error:', error)
    return NextResponse.json({ error: 'Gagal mengambil pesanan' }, { status: 500 })
  }
}
