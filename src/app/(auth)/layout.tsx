import { Sprout } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#F4FBFA] sm:bg-white">
      {/* Left Pane (Image) - Hidden on mobile, half width on lg */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559884743-74a57598c6c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Sawah Padi" 
            className="w-full h-full object-cover"
          />
          {/* Gradients to fade smoothly */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        {/* Logo/Brand */}
        <Link href="/" className="relative z-10 flex items-center gap-2 w-max hover:opacity-90 transition-opacity">
          <Sprout className="w-8 h-8 text-white" />
          <span className="text-xl font-bold text-white tracking-tight">PanganTanyoe</span>
        </Link>

        {/* Text at bottom */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Kedaulatan Pangan<br/>Mulai dari Desa.
          </h2>
          <p className="text-lg text-white/90 font-medium">
            Hubungkan pasokan pangan lokal langsung dari Petani ke pasar dan sekolah.
          </p>
        </div>
      </div>

      {/* Right Pane (Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-[#F4FBFA] lg:bg-[#F4FBFA]">
        <div className="w-full max-w-md bg-transparent">
          {children}
        </div>
      </div>
    </div>
  )
}
