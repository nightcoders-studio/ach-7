'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, MapPin, Star, ShoppingCart, User, Home, ListOrdered, ChevronRight, LayoutGrid, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

const CATEGORIES = [
  { value: '', label: 'Semua' },
  { value: 'SAYUR', label: 'Sayur' },
  { value: 'BUAH', label: 'Buah' },
  { value: 'BERAS', label: 'Beras' },
  { value: 'CABAI', label: 'Cabai' },
  { value: 'BAWANG', label: 'Bawang' },
  { value: 'LAINNYA', label: 'Lainnya' },
]

type Product = {
  id: string
  namaProduk: string
  kategori: string
  hargaPerKg: number
  stok: number
  satuan: string
  foto: string | null
  avgRating: number | null
  farmer: {
    id: string
    nama: string
    foto: string | null
  }
}

export default function BelanjaClient({ isKonsumen }: { isKonsumen: boolean }) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [kategori, setKategori] = useState('')
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchProducts = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page
      if (reset) {
        setLoading(true)
        setProducts([])
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams({
        search: debouncedSearch,
        kategori,
        page: currentPage.toString(),
        limit: '12'
      })

      const res = await fetch(`/api/produk?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        if (reset) {
          setProducts(data.products)
        } else {
          setProducts(prev => [...prev, ...data.products])
        }
        setHasMore(data.pagination.page < data.pagination.totalPages)
        if (!reset) {
          setPage(currentPage + 1)
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [debouncedSearch, kategori, page])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPage(1)
    fetchProducts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, kategori])
  /* eslint-enable react-hooks/set-state-in-effect */

  const loadMore = () => {
    fetchProducts(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 selection:bg-brand-green/20 selection:text-brand-green">
      
      {/* Header & Hero */}
      <div className="bg-white px-4 pt-4 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <img src="/Logo.png" alt="PanganTanyoe" className="h-10 w-auto" />
            {!isKonsumen && (
              <Link href="/login" className="text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full hover:bg-brand-green/20 transition-colors">
                Masuk
              </Link>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari sayur, buah, beras..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-100/50 pl-10 pr-4 py-3.5 text-sm transition-all focus:border-brand-green focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-6">
        
        {/* Categories */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setKategori(cat.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                kategori === cat.value
                  ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-brand-green" />
              Produk Tersedia
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 animate-pulse space-y-3">
                  <div className="w-full aspect-square bg-slate-200 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Produk tidak ditemukan</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product) => (
                <Link href={`/belanja/produk/${product.id}`} key={product.id} className="group flex flex-col bg-white rounded-2xl p-3 shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-green/30 transition-all">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                    {product.foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.foto} alt={product.namaProduk} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingBag className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                    {product.stok < 10 && (
                      <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        Sisa {product.stok}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-tight mb-1 group-hover:text-brand-green transition-colors">
                      {product.namaProduk}
                    </h3>
                    <div className="text-xs text-slate-500 mb-2">{product.stok} {product.satuan} tersedia</div>
                    <div className="font-bold text-brand-orange text-base mt-auto">
                      Rp {product.hargaPerKg.toLocaleString('id-ID')}
                      <span className="text-xs font-normal text-slate-500"> /{product.satuan}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                    {product.farmer.foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.farmer.foto} alt={product.farmer.nama} className="w-5 h-5 rounded-full object-cover bg-slate-200" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-brand-green" />
                      </div>
                    )}
                    <span className="text-xs text-slate-600 font-medium truncate flex-1">{product.farmer.nama}</span>
                    <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {product.avgRating ? product.avgRating.toFixed(1) : '—'}
                    </div>
                  </div>

                  {isKonsumen && (
                    <button className="mt-3 w-full bg-brand-green/10 text-brand-green font-semibold text-sm py-2 rounded-xl group-hover:bg-brand-green group-hover:text-white transition-colors flex items-center justify-center gap-1.5">
                      <ShoppingCart className="w-4 h-4" />
                      Beli
                    </button>
                  )}
                </Link>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="pt-4 flex justify-center">
              <button 
                onClick={loadMore} 
                disabled={loadingMore}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-brand-green font-medium py-2.5 px-6 rounded-full text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  'Muat Lebih Banyak'
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
        <div className="max-w-md mx-auto flex items-center justify-around h-16">
          <Link href="/belanja" className="flex flex-col items-center justify-center w-full h-full text-brand-green">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Beranda</span>
          </Link>
          
          <Link href={isKonsumen ? "/pesanan" : "/login"} className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <ListOrdered className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Pesanan</span>
          </Link>

          <Link href={isKonsumen ? "/profil" : "/login"} className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>

      {/* Styles for hiding scrollbar in categories */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}
