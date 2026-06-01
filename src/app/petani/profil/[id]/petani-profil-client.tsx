'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Store, MapPin, Phone, Star, ShoppingBag, CheckCircle, ChevronRight, BadgeCheck, Loader2, Home, ListOrdered, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRupiah } from '@/lib/utils'

type FarmerProduct = {
  id: string
  namaProduk: string
  kategori: string
  hargaPerKg: number
  stok: number
  satuan: string
  foto: string | null
  deskripsi: string | null
}

type FarmerData = {
  id: string
  nama: string
  foto: string | null
  no_hp: string | null
  alamat: string | null
  farmerProfile: {
    alamatLahan: string
    statusVerifikasi: string
  } | null
  products: FarmerProduct[]
  avgRating: number | null
  totalReview: number
}

export default function PetaniProfilClient() {
  const params = useParams()
  const router = useRouter()
  const [farmer, setFarmer] = useState<FarmerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const res = await fetch(`/api/petani/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) setError(true)
          throw new Error('Gagal memuat profil')
        }
        const data = await res.json()
        setFarmer(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchFarmer()
  }, [params.id])

  const initials = farmer?.nama
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const kategoriLabel: Record<string, string> = {
    SAYUR: 'Sayur',
    BUAH: 'Buah',
    BERAS: 'Beras',
    CABAI: 'Cabai',
    BAWANG: 'Bawang',
    LAINNYA: 'Lainnya',
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 selection:bg-brand-green/20 selection:text-brand-green">

      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Profil Petani</h1>
            <p className="text-xs text-slate-500">Info dan produk dari petani</p>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {loading ? (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-28 h-28 rounded-full" />
                <Skeleton className="h-7 w-48 rounded-md" />
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-4 w-56 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-52 rounded-2xl" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-slate-100 border-dashed shadow-sm">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
              <Store className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Petani Tidak Ditemukan</h3>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Profil petani yang kamu cari tidak tersedia atau telah dinonaktifkan.
            </p>
            <Link href="/belanja">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-12 px-8 shadow-lg shadow-brand-green/20">
                Kembali ke Belanja
              </Button>
            </Link>
          </div>
        ) : farmer ? (
          <>
            {/* Farmer Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Cover */}
              <div className="h-32 bg-gradient-to-r from-brand-green/20 via-brand-green/10 to-brand-orange/20 relative">
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                  {farmer.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={farmer.foto}
                      alt={farmer.nama}
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-green to-brand-green/70 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                      {initials || <Store className="w-12 h-12" />}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-16 pb-6 px-6 text-center">
                {/* Nama + Verified Badge */}
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900">{farmer.nama}</h2>
                  {farmer.farmerProfile?.statusVerifikasi === 'TERVERIFIKASI' && (
                    <BadgeCheck className="w-6 h-6 text-blue-500 shrink-0" />
                  )}
                </div>

                {/* Status */}
                {farmer.farmerProfile?.statusVerifikasi === 'TERVERIFIKASI' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 mb-3">
                    <CheckCircle className="w-3 h-3" />
                    Petani Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 mb-3">
                    Belum Terverifikasi
                  </span>
                )}

                {/* Rating */}
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {farmer.avgRating ? (
                    <>
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="font-extrabold text-slate-800 text-lg">{farmer.avgRating.toFixed(1)}</span>
                      <span className="text-slate-400 text-sm">({farmer.totalReview} ulasan)</span>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400 font-medium">Belum ada ulasan</span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4">
                  {farmer.farmerProfile?.alamatLahan && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                      <span>{farmer.farmerProfile.alamatLahan}</span>
                    </div>
                  )}
                  {farmer.no_hp && (
                    <a
                      href={`https://wa.me/${farmer.no_hp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-brand-green font-semibold hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {farmer.no_hp}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-green" />
                  Produk {farmer.nama.split(' ')[0]}
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {farmer.products.length} produk
                </span>
              </div>

              {farmer.products.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Belum ada produk tersedia</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {farmer.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/belanja/produk/${product.id}`}
                      className="group bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md hover:border-brand-green/30 transition-all"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 mb-2.5">
                        {product.foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.foto}
                            alt={product.namaProduk}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ShoppingBag className="w-8 h-8 opacity-50" />
                          </div>
                        )}
                        {product.stok < 10 && (
                          <div className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            Sisa {product.stok}
                          </div>
                        )}
                      </div>

                      <h4 className="font-semibold text-slate-800 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-brand-green transition-colors">
                        {product.namaProduk}
                      </h4>

                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {kategoriLabel[product.kategori] || product.kategori}
                        </span>
                      </div>

                      <div className="font-bold text-brand-orange text-sm">
                        {formatRupiah(Number(product.hargaPerKg))}
                        <span className="text-xs font-normal text-slate-500"> /{product.satuan}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
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

          <Link href="/profil" className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
