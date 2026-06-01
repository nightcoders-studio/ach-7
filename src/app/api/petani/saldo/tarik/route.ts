import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { farmerProfile: true, wallet: true },
  })
  if (profile?.role !== 'PETANI') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const nominal = parseFloat(body.nominal)

  if (!nominal || nominal <= 0) {
    return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 })
  }

  if (nominal < 10000) {
    return NextResponse.json({ error: 'Minimal penarikan Rp 10.000' }, { status: 400 })
  }

  const wallet = profile.wallet
  if (!wallet || Number(wallet.saldo) < nominal) {
    return NextResponse.json({ error: 'Saldo tidak mencukupi' }, { status: 400 })
  }

  const farmerProfile = profile.farmerProfile
  if (!farmerProfile) {
    return NextResponse.json({ error: 'Data rekening belum lengkap' }, { status: 400 })
  }

  try {
    const withdraw = await prisma.$transaction([
      prisma.withdrawRequest.create({
        data: {
          farmerId: user.id,
          nominal,
          rekeningBank: farmerProfile.rekeningBank,
          noRekening: farmerProfile.noRekening,
        },
      }),
      prisma.wallet.update({
        where: { farmerId: user.id },
        data: { saldo: { decrement: nominal } },
      }),
    ])

    return NextResponse.json({ withdraw: withdraw[0] })
  } catch (error) {
    console.error('Withdraw error:', error)
    return NextResponse.json({ error: 'Gagal memproses penarikan' }, { status: 500 })
  }
}
