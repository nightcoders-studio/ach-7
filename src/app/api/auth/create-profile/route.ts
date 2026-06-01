import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const token = request.headers.get('Authorization')?.slice(7)

    const { data: { user }, error: authError } = await supabase.auth.getUser(token ?? undefined)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (body.userId !== user.id) {
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 })
    }

    const existing = await prisma.profile.findUnique({ where: { id: user.id }, select: { id: true } })
    if (existing) {
      return NextResponse.json({ error: 'Profile sudah ada' }, { status: 409 })
    }

    const profile = await prisma.profile.create({
      data: {
        id: user.id,
        email: body.email,
        nama: body.nama,
        no_hp: body.noHp || null,
        role: body.role,
        farmerProfile:
          body.role === 'PETANI'
            ? {
                create: {
                  nik: body.nik,
                  alamatLahan: body.alamatLahan,
                  rekeningBank: body.rekeningBank,
                  noRekening: body.noRekening,
                  namaPemilikRekening: body.namaPemilikRekening,
                  fotoKtp: '',
                },
              }
            : undefined,
        wallet:
          body.role === 'PETANI'
            ? {
                create: { saldo: 0 },
              }
            : undefined,
      },
      include: {
        farmerProfile: true,
        wallet: true,
      },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Create profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
