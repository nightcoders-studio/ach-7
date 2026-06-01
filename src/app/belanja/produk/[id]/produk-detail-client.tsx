'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Star, MapPin, Store, ChevronRight, ShoppingCart, Loader2, ShieldCheck, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

type FarmerInfo = {
  id: string
  nama: string
  foto: string | null
  farmerProfile: { alamatLahan: string } | null
  avgRating: number | null
  totalReview: number
}

type ProductDetail = {
  id: string
  namaProduk: string
  deskripsi: string | null
  kategori: string
  hargaPerKg: string | number
  stok: number
  satuan: string
  foto: string | null
  farmer: FarmerInfo
}

export default function ProdukDetailClient({ productId, isKonsumen }: { productId: string, isKonsumen: boolean }) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/produk/${productId}`)
        if (!res.ok) throw new Error('Produk tidak ditemukan')
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        toast.error('Gagal mengambil data produk')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!isKonsumen) {
      toast.error('Silakan login sebagai konsumen untuk berbelanja')
      router.push('/login')
      return
    }

    setIsAdding(true)
    // TODO: Implement actual add to cart API
    setTimeout(() => {
      toast.success('Berhasil ditambahkan ke keranjang')
      setIsAdding(false)
    }, 1000)
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-green/5 to-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-brand-green/10 text-center max-w-md border border-brand-green/20">
          <Leaf className="w-16 h-16 text-brand-green mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h1>
          <p className="text-slate-600 mb-8">Maaf, produk yang Anda cari mungkin sudah dihapus atau tidak tersedia.</p>
          <Button onClick={() => router.push('/belanja')} className="w-full bg-brand-green hover:bg-brand-green/90 rounded-xl h-12 text-base">
            Kembali ke Belanja
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-green/10 to-transparent -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      
      {/* Mobile Navbar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 h-16 flex items-center justify-between md:hidden shadow-sm">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 line-clamp-1">{product.namaProduk}</h1>
        <div className="w-10"></div> {/* spacer */}
      </div>

      <div className="max-w-6xl mx-auto md:px-6 md:py-12">
        <button onClick={() => router.back()} className="hidden md:flex items-center text-slate-500 hover:text-brand-green mb-8 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Produk
        </button>

        <div className="bg-white md:rounded-[2rem] md:shadow-xl md:shadow-slate-200/50 md:border md:border-slate-100 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Left: Product Image */}
          <div className="w-full md:w-[45%] relative bg-slate-100 group overflow-hidden">
            <div className="relative aspect-square w-full h-full min-h-[300px]">
              <Image
                src={product.foto || '/placeholder.svg'}
                alt={product.namaProduk}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {/* Badges floating on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-white/90 backdrop-blur-md text-brand-green font-bold text-xs px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                {product.kategori}
              </span>
              {product.stok < 10 && product.stok > 0 && (
                <span className="bg-rose-500/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                  Sisa {product.stok}!
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-[55%] flex flex-col p-6 md:p-10 lg:p-12 relative bg-white">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {product.namaProduk}
              </h1>
              
              <div className="flex items-end gap-3 mb-8">
                <div className="text-4xl lg:text-5xl font-black text-brand-green tracking-tight">
                  {formatRupiah(Number(product.hargaPerKg))}
                </div>
                <div className="text-lg lg:text-xl font-medium text-slate-400 mb-1">
                  / {product.satuan}
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
                  <span className="text-sm font-medium text-slate-500 mb-1">Kualitas</span>
                  <span className="font-bold text-slate-800">Dijamin Segar</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold mb-2">
                    {product.stok > 99 ? '99+' : product.stok}
                  </div>
                  <span className="text-sm font-medium text-slate-500 mb-1">Tersedia</span>
                  <span className="font-bold text-slate-800">{product.stok} {product.satuan}</span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                  Deskripsi Produk
                </h3>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                  {product.deskripsi || 'Petani belum menambahkan deskripsi untuk produk ini.'}
                </p>
              </div>

              {/* Farmer Info - Made more premium */}
              <div 
                className="group relative bg-white border-2 border-slate-100 rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:border-brand-green/40 hover:shadow-lg hover:shadow-brand-green/5 transition-all duration-300 mb-8 overflow-hidden" 
                onClick={() => router.push(`/petani/profil/${product.farmer.id}`)}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-brand-green/20 group-hover:bg-brand-green transition-colors" />
                
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-md relative shrink-0">
                  {product.farmer.foto ? (
                    <Image src={product.farmer.foto} alt={product.farmer.nama} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Store className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-xs font-bold text-brand-green uppercase tracking-wider mb-1">Dijual Oleh</div>
                  <h4 className="text-lg font-bold text-slate-900 truncate group-hover:text-brand-green transition-colors">{product.farmer.nama}</h4>
                  <div className="flex items-center text-sm text-slate-500 mt-1.5">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{product.farmer.farmerProfile?.alamatLahan || 'Lokasi tidak diketahui'}</span>
                  </div>
                  <div className="flex items-center text-sm mt-1.5">
                    <Star className="w-4 h-4 text-amber-400 mr-1.5 fill-amber-400 shrink-0" />
                    <span className="font-bold text-slate-700 mr-1">{product.farmer.avgRating ? product.farmer.avgRating.toFixed(1) : 'Baru'}</span>
                    {product.farmer.totalReview > 0 && <span className="text-slate-400 font-medium">({product.farmer.totalReview} ulasan)</span>}
                  </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-green/10 transition-colors mr-2">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-green" />
                </div>
              </div>
            </div>

            {/* Desktop Buy Buttons */}
            <div className="hidden md:flex gap-4 mt-4">
              {isKonsumen ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 text-lg font-bold text-brand-green border-2 border-brand-green hover:bg-brand-green/10 rounded-xl transition-all" 
                    onClick={handleAddToCart} 
                    disabled={isAdding || product.stok === 0}
                  >
                    {isAdding ? <Loader2 className="w-6 h-6 mr-3 animate-spin" /> : <ShoppingCart className="w-6 h-6 mr-3" />}
                    Masuk Keranjang
                  </Button>
                  <Button 
                    className="flex-1 h-14 text-lg font-bold bg-brand-green hover:bg-brand-green/90 text-white rounded-xl shadow-lg shadow-brand-green/30 hover:shadow-xl hover:shadow-brand-green/40 transition-all hover:-translate-y-1" 
                    disabled={product.stok === 0}
                  >
                    Beli Langsung
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full h-14 text-lg font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg transition-all hover:-translate-y-1" 
                  onClick={() => router.push('/login')}
                >
                  Login sebagai Konsumen untuk Membeli
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200/50 z-40 md:hidden pb-safe shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
        {isKonsumen ? (
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 h-14 border-2 border-brand-green text-brand-green hover:bg-brand-green/10 rounded-xl" 
              onClick={handleAddToCart} 
              disabled={isAdding || product.stok === 0}
            >
              {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
            </Button>
            <Button 
              className="flex-[2] h-14 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-green/30" 
              disabled={product.stok === 0}
            >
              Beli Langsung
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white font-bold text-lg rounded-xl shadow-lg" 
            onClick={() => router.push('/login')}
          >
            Login untuk Membeli
          </Button>
        )}
      </div>
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 md:py-12">
      <div className="sticky top-0 z-40 bg-white border-b px-4 h-16 flex items-center md:hidden">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-40 h-6 ml-4 rounded-md" />
      </div>

      <div className="max-w-6xl mx-auto md:px-6">
        <Skeleton className="w-32 h-5 mb-8 hidden md:block rounded-md" />

        <div className="bg-white md:rounded-[2rem] md:shadow-xl md:border md:border-slate-100 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-[45%] relative">
            <Skeleton className="w-full aspect-square" />
          </div>

          <div className="w-full md:w-[55%] flex flex-col p-6 md:p-12">
            <Skeleton className="w-3/4 h-12 mb-4 rounded-xl" />
            
            <div className="flex gap-4 mb-8">
              <Skeleton className="w-48 h-14 rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Skeleton className="w-full h-28 rounded-2xl" />
              <Skeleton className="w-full h-28 rounded-2xl" />
            </div>

            <div className="mb-10">
              <Skeleton className="w-40 h-7 mb-4 rounded-md" />
              <Skeleton className="w-full h-4 mb-3 rounded-md" />
              <Skeleton className="w-full h-4 mb-3 rounded-md" />
              <Skeleton className="w-3/4 h-4 rounded-md" />
            </div>

            <div className="border-2 border-slate-100 rounded-2xl p-5 flex items-center gap-5 mb-8">
              <Skeleton className="w-16 h-16 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="w-24 h-3 mb-2 rounded-md" />
                <Skeleton className="w-48 h-6 mb-2 rounded-md" />
                <Skeleton className="w-32 h-4 rounded-md" />
              </div>
            </div>

            <div className="hidden md:flex gap-4 mt-auto">
              <Skeleton className="flex-1 h-14 rounded-xl" />
              <Skeleton className="flex-1 h-14 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
