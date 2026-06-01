'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ClipboardList, Wallet } from 'lucide-react'

const navItems = [
  { href: '/petani', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/petani/produk', label: 'Stok Saya', icon: Package },
  { href: '/petani/pesanan', label: 'Pesanan', icon: ClipboardList },
  { href: '/petani/saldo', label: 'Saldo', icon: Wallet },
]

export default function PetaniNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden sm:flex flex-col w-64 bg-white border-r border-slate-200 p-4 gap-2 shrink-0 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3 mb-2 flex items-center">
          <span className="w-4 h-[2px] bg-slate-300 mr-2 rounded-full" />
          Menu Petani
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/petani' && pathname.startsWith(item.href + '/'))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-brand-green/10 text-brand-green shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-brand-green' : 'group-hover:scale-110 group-hover:text-slate-700'}`} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-end h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/petani' && pathname.startsWith(item.href + '/'))
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                  isActive ? 'text-brand-green' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 w-8 h-1 bg-brand-green rounded-b-full" />
                )}
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 -translate-y-0.5' : ''}`} />
                <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100 font-bold' : 'opacity-80'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
