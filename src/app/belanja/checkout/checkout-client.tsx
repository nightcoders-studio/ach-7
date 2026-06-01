'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin, CreditCard, QrCode, Loader2, Minus, Plus, Truck, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'

type CheckoutProduct = {
  id: string
  farmerId: string
  namaProduk: string
  hargaPerKg: number
  foto: string | null
  satuan: string
  stok: number
  farmer: { nama: string }
}

export default function CheckoutClient({ product, initialAddress }: { product: CheckoutProduct, initialAddress: string }) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [alamat, setAlamat] = useState(initialAddress || '')
  const [catatan, setCatatan] = useState('')
  const [metodeBayar, setMetodeBayar] = useState<'TRANSFER' | 'QRIS'>('TRANSFER')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hargaSatuan = Number(product.hargaPerKg)
  const subtotal = hargaSatuan * qty
  const ongkir = 15000 // Statis sementara
  const grandTotal = subtotal + ongkir

  const handleQtyChange = (type: 'inc' | 'dec') => {
    if (type === 'inc' && qty < product.stok) {
      setQty(qty + 1)
    } else if (type === 'dec' && qty > 1) {
      setQty(qty - 1)
    }
  }

  const handleCheckout = async () => {
    if (!alamat.trim()) {
      toast.error('Alamat pengiriman wajib diisi')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: product.farmerId,
          items: [{ productId: product.id, qty }],
          alamatPengiriman: alamat,
          ongkir,
          catatan: catatan || undefined,
          metodeBayar
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat pesanan')
      }

      toast.success('Pesanan berhasil dibuat!')
      router.push(`/pesanan/${data.id}`)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 md:py-12 pb-24">
      {/* Mobile Navbar */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 h-16 flex items-center md:hidden">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 ml-2">Checkout</h1>
      </div>

      <div className="max-w-4xl mx-auto md:px-6">
        <button onClick={() => router.back()} className="hidden md:flex items-center text-slate-500 hover:text-brand-green mb-8 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>

        <h1 className="hidden md:block text-3xl font-bold text-slate-900 mb-8">Checkout Pesanan</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Form & Details */}
          <div className="flex-1 space-y-6">
            
            {/* Product Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Store className="w-5 h-5 mr-2 text-brand-green" />
                {product.farmer.nama}
              </h2>
              
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-slate-100 rounded-xl relative overflow-hidden shrink-0 border border-slate-200">
                  {product.foto ? (
                    <Image src={product.foto} alt={product.namaProduk} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{product.namaProduk}</h3>
                  <div className="text-brand-green font-bold mb-2">
                    {formatRupiah(hargaSatuan)} <span className="text-slate-400 font-normal text-sm">/ {product.satuan}</span>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm font-medium text-slate-500">Jumlah:</span>
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button 
                        onClick={() => handleQtyChange('dec')}
                        disabled={qty <= 1}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-green disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-700">{qty}</span>
                      <button 
                        onClick={() => handleQtyChange('inc')}
                        disabled={qty >= product.stok}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-green disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-brand-orange" />
                Informasi Pengiriman
              </h2>
              
              <div className="space-y-3">
                <Label htmlFor="alamat" className="text-slate-700 font-semibold">Alamat Lengkap <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <MapPin className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                  <Textarea 
                    id="alamat"
                    placeholder="Masukkan alamat lengkap pengiriman..."
                    className="pl-10 min-h-[100px] bg-slate-50 focus:bg-white transition-colors"
                    value={alamat}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAlamat(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="catatan" className="text-slate-700 font-semibold">Catatan untuk Penjual (Opsional)</Label>
                <Input 
                  id="catatan"
                  placeholder="Contoh: Pilih yang warna merah semua ya"
                  className="bg-slate-50 focus:bg-white"
                  value={catatan}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCatatan(e.target.value)}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Metode Pembayaran</h2>
              
              <RadioGroup value={metodeBayar} onValueChange={(val: 'TRANSFER' | 'QRIS') => setMetodeBayar(val)} className="gap-4">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${metodeBayar === 'TRANSFER' ? 'border-brand-green bg-brand-green/5' : 'border-slate-100 hover:border-slate-200'}`}>
                  <RadioGroupItem value="TRANSFER" id="transfer" />
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Transfer Bank (Manual)</div>
                      <div className="text-sm text-slate-500">Transfer langsung ke rekening platform</div>
                    </div>
                  </div>
                </label>
                
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${metodeBayar === 'QRIS' ? 'border-brand-green bg-brand-green/5' : 'border-slate-100 hover:border-slate-200'}`}>
                  <RadioGroupItem value="QRIS" id="qris" />
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">QRIS</div>
                      <div className="text-sm text-slate-500">Bayar instan dengan e-wallet / mobile banking</div>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div className="w-full md:w-[350px]">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Ringkasan Belanja</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Harga ({qty} barang)</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(ongkir)}</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-900">Total Belanja</span>
                  <span className="text-2xl font-black text-brand-green tracking-tight">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              <Button 
                onClick={handleCheckout} 
                disabled={isSubmitting || product.stok === 0}
                className="w-full h-14 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-green/30 hover:-translate-y-1 transition-all"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                Buat Pesanan
              </Button>
              <p className="text-xs text-center text-slate-400 mt-4">
                Dengan membuat pesanan, Anda menyetujui syarat & ketentuan yang berlaku.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
