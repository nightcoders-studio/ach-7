'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function ProdukToggle({ productId, isActive }: { productId: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggle() {
    startTransition(async () => {
      await fetch(`/api/petani/produk/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors ${
        isActive
          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
      }`}
    >
      {pending ? '...' : isActive ? 'Aktif' : 'Nonaktif'}
    </button>
  )
}
