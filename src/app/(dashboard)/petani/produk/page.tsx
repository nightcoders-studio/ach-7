import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProdukToggle from './produk-toggle'

export default async function ProdukPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const products = await prisma.product.findMany({
    where: { farmerId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Stok Saya</h1>
        <Link
          href="/petani/produk/tambah"
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          + Tambah
        </Link>
      </div>

      {products.length === 0 && (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm border border-gray-100">
          <p className="text-5xl mb-3">📦</p>
          <p className="text-gray-500 mb-4">Belum ada produk. Tambahkan stok pertama kamu!</p>
          <Link
            href="/petani/produk/tambah"
            className="inline-block rounded-lg bg-green-700 px-6 py-3 text-sm font-medium text-white hover:bg-green-800"
          >
            Tambah Produk
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`rounded-xl bg-white p-4 shadow-sm border transition-opacity ${
              product.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center text-2xl shrink-0">
                {product.foto ? (
                  <img src={product.foto} alt={product.namaProduk} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '🌾'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{product.namaProduk}</h3>
                    <p className="text-sm text-gray-500 capitalize">{product.kategori.toLowerCase()}</p>
                  </div>
                  <ProdukToggle productId={product.id} isActive={product.isActive} />
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <span className="font-medium text-green-700">
                    Rp {Number(product.hargaPerKg).toLocaleString('id-ID')}/{product.satuan}
                  </span>
                  <span className="text-gray-500">Stok: {product.stok} {product.satuan}</span>
                </div>
                {product.deskripsi && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.deskripsi}</p>
                )}
                <div className="flex gap-3 mt-2">
                  <Link
                    href={`/petani/produk/${product.id}/edit`}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
