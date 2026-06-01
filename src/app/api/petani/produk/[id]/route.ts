import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const product = await prisma.product.findFirst({
    where: { id, farmerId: user.id },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(product)
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const existing = await prisma.product.findFirst({ where: { id, farmerId: user.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const body = await request.json()
    const product = await prisma.product.update({
      where: { id },
      data: {
        namaProduk: body.namaProduk,
        kategori: body.kategori,
        hargaPerKg: body.hargaPerKg,
        stok: body.stok,
        satuan: body.satuan ?? existing.satuan,
        deskripsi: body.deskripsi ?? existing.deskripsi,
        foto: body.foto ?? existing.foto,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const existing = await prisma.product.findFirst({ where: { id, farmerId: user.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const body = await request.json()
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: body.isActive },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Toggle product error:', error)
    return NextResponse.json({ error: 'Gagal' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const existing = await prisma.product.findFirst({ where: { id, farmerId: user.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 })
  }
}
