'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Home, ListOrdered, ShoppingBag, Calendar, MapPin, Phone, Pencil, X, Check, LogOut, Loader2, CreditCard, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'

type ProfileData = {
  id: string
  role: string
  nama: string
  email: string | null
  no_hp: string | null
  foto: string | null
  alamat: string | null
  createdAt: string
  stats: {
    totalOrders: number
    completedOrders: number
    totalSpending: number
  }
}

export default function ProfilClient({ userId }: { userId: string }) {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const [editNama, setEditNama] = useState('')
  const [editNoHp, setEditNoHp] = useState('')
  const [editAlamat, setEditAlamat] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.status === 401) {
          router.push('/login?callbackUrl=/profil')
          return
        }
        const data = await res.json()
        setProfile(data)
        setEditNama(data.nama)
        setEditNoHp(data.no_hp || '')
        setEditAlamat(data.alamat || '')
      } catch {
        toast.error('Gagal memuat profil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSave = async () => {
    if (!editNama.trim()) {
      toast.error('Nama tidak boleh kosong')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: editNama.trim(),
          no_hp: editNoHp.trim() || null,
          alamat: editAlamat.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan')
      }

      const updated = await res.json()
      setProfile((prev) => prev ? {
        ...prev,
        nama: updated.nama,
        no_hp: updated.no_hp,
        alamat: updated.alamat,
      } : prev)
      setEditing(false)
      toast.success('Profil berhasil diperbarui!')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditNama(profile.nama)
      setEditNoHp(profile.no_hp || '')
      setEditAlamat(profile.alamat || '')
    }
    setEditing(false)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch {
      toast.error('Gagal keluar')
    } finally {
      setLoggingOut(false)
    }
  }

  const initials = profile?.nama
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 selection:bg-brand-green/20 selection:text-brand-green">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/belanja" className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Profil Saya</h1>
            <p className="text-xs text-slate-500">Kelola data diri kamu</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {loading ? (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-6 w-44 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        ) : !profile ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 border-dashed shadow-sm">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Profil Tidak Ditemukan</h3>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Terjadi kesalahan saat memuat data profil.
            </p>
            <Link href="/belanja">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-12 px-8 shadow-lg shadow-brand-green/20">
                Kembali ke Belanja
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  {profile.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.foto}
                      alt={profile.nama}
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-green to-brand-green/70 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                      {initials || <User className="w-10 h-10" />}
                    </div>
                  )}
                </div>

                {editing ? (
                  <div className="w-full max-w-sm space-y-4">
                    <Input
                      value={editNama}
                      onChange={(e) => setEditNama(e.target.value)}
                      placeholder="Nama lengkap"
                      className="text-center text-base"
                    />
                    <Input
                      value={editNoHp}
                      onChange={(e) => setEditNoHp(e.target.value)}
                      placeholder="Nomor HP"
                      className="text-center"
                      type="tel"
                    />
                    <textarea
                      value={editAlamat}
                      onChange={(e) => setEditAlamat(e.target.value)}
                      placeholder="Alamat lengkap"
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 focus:outline-none resize-none"
                    />

                    <div className="flex gap-3">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={saving}
                        className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 h-12 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white font-semibold shadow-lg shadow-brand-green/20"
                      >
                        {saving ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <Check className="w-5 h-5 mr-2" />
                        )}
                        Simpan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{profile.nama}</h2>

                    {profile.email && (
                      <p className="text-sm text-slate-500 mb-4">{profile.email}</p>
                    )}

                    {/* Info Items */}
                    <div className="w-full space-y-3 border-t border-slate-100 pt-4 mt-2">
                      {profile.no_hp && (
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-brand-green" />
                          </div>
                          <span>{profile.no_hp}</span>
                        </div>
                      )}

                      {profile.alamat && (
                        <div className="flex items-start gap-3 text-sm text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-brand-green" />
                          </div>
                          <span className="text-left leading-relaxed">{profile.alamat}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-brand-green" />
                        </div>
                        <span>Bergabung sejak {joinDate}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      className="mt-5 w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:text-brand-green hover:border-brand-green/30 transition-all"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Profil
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-green" />
                Aktivitas Belanja
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800">
                    {profile.stats.totalOrders}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Total Pesanan</div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-800">
                    {profile.stats.completedOrders}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Selesai</div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-lg font-extrabold text-slate-800 leading-tight">
                    {formatRupiah(profile.stats.totalSpending)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Total Belanja</div>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-50 hover:border-rose-300 transition-all disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              Keluar
            </button>
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-md mx-auto flex items-center justify-around h-16">
          <Link href="/belanja" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Beranda</span>
          </Link>

          <Link href="/pesanan" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <ListOrdered className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Pesanan</span>
          </Link>

          <Link href="/profil" className="flex flex-col items-center justify-center w-full h-full text-brand-green">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
