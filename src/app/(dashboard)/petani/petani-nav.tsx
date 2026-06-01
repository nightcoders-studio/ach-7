'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/petani', label: 'Dashboard', icon: '📊' },
  { href: '/petani/produk', label: 'Stok Saya', icon: '📦' },
  { href: '/petani/pesanan', label: 'Pesanan', icon: '📋' },
  { href: '/petani/saldo', label: 'Saldo', icon: '💰' },
]

export default function PetaniNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden sm:flex flex-col w-56 bg-white border-r border-gray-200 p-3 gap-1 shrink-0">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
          Menu Petani
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 text-xs font-medium ${
                  isActive ? 'text-green-700' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
