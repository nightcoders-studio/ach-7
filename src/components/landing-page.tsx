"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Leaf, ShieldCheck, Truck, Star, ShoppingBasket, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-white selection:bg-brand-green/20 selection:text-brand-green overflow-hidden">
      
      {/* Floating Navigation */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 pointer-events-none"
      >
        <nav className="mx-auto max-w-5xl rounded-full border border-slate-200/50 bg-white/70 backdrop-blur-xl shadow-sm pointer-events-auto">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-brand-green to-brand-orange p-1.5 rounded-full">
                <Leaf className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">PanganTanyoe</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
              <Link href="#cara-kerja" className="hover:text-brand-green transition-colors">Cara Kerja</Link>
              <Link href="#testimoni" className="hover:text-brand-green transition-colors">Testimoni</Link>
              <Link href="/register?role=petani" className="hover:text-brand-green transition-colors">Mitra Petani</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-brand-orange transition-colors">Masuk</Link>
              <Link href="/register" className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-brand-green px-5 text-sm font-medium text-white hover:bg-brand-green/90 hover:shadow-md hover:-translate-y-0.5 transition-all">
                Mulai
              </Link>
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center p-2 -mr-2 text-slate-700 hover:text-brand-green transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-[100] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-tr from-brand-green to-brand-orange p-1.5 rounded-full">
                    <Leaf className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-slate-900">PanganTanyoe</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-6">
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#cara-kerja" className="text-lg font-medium text-slate-700 hover:text-brand-green transition-colors">Cara Kerja</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#testimoni" className="text-lg font-medium text-slate-700 hover:text-brand-green transition-colors">Testimoni</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/register?role=petani" className="text-lg font-medium text-slate-700 hover:text-brand-green transition-colors">Mitra Petani</Link>
                <hr className="border-slate-100" />
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-lg font-medium text-slate-700 hover:text-brand-orange transition-colors">Masuk</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/register" className="inline-flex h-12 items-center justify-center rounded-full bg-brand-green px-6 text-base font-medium text-white hover:bg-brand-green/90 transition-all mt-2">
                  Mulai Sekarang
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1559884743-74a57598c6c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Sawah Padi" 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlays: Hijau Cerah */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/95 via-brand-green/80 to-transparent"></div>
            {/* Sedikit gelap di bawah untuk memastikan teks terbaca, tapi tidak biru */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-12 sm:mt-0">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-white mb-6">
                <Leaf className="h-4 w-4 mr-2" />
                Banda Aceh & Aceh Besar
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-[5rem] font-bold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-lg">
                Beli Pangan Langsung dari <span className="text-brand-orange">Petani Aceh</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl font-medium drop-shadow-md">
                Beras, sayur, dan cabai segar dipanen pagi, sampai di rumah Anda hari yang sama. Harga adil untuk konsumen, untung lebih untuk petani.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link href="/register" className="inline-flex h-14 items-center justify-center rounded-full bg-brand-orange px-8 text-base font-bold text-slate-900 hover:bg-brand-orange/90 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <ShoppingBasket className="h-5 w-5 mr-2" /> Mulai Belanja
                </Link>
                <Link href="/register?role=petani" className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 text-base font-semibold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all">
                  <Leaf className="h-5 w-5 mr-2" /> Daftar Jadi Mitra Petani
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-8 sm:gap-16 text-white">
                <div>
                  <div className="text-4xl font-extrabold tracking-tight">320+</div>
                  <div className="text-sm font-medium text-white/70 mt-1">Petani Mitra</div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold tracking-tight">12K+</div>
                  <div className="text-sm font-medium text-white/70 mt-1">Pesanan Selesai</div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold tracking-tight flex items-center">
                    4.8<Star className="h-6 w-6 ml-1 fill-white text-white" />
                  </div>
                  <div className="text-sm font-medium text-white/70 mt-1">Rating Rata-rata</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="cara-kerja" className="py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mb-16 md:flex md:justify-between md:items-end"
            >
              <motion.div variants={fadeInUp} className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">Sesederhana itu.</h2>
                <p className="text-lg text-slate-500 font-medium">
                  Kami mendesain pengalaman belanja yang adil dan efisien. Dari ladang, langsung ke dapur Anda.
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 sm:gap-8"
            >
              {[
                { step: "01", title: "Pilih & Pesan", icon: <Leaf className="h-6 w-6" />, desc: "Jelajahi produk segar harian langsung dari ratusan profil petani terverifikasi.", color: "from-brand-green/5 to-white", iconBg: "bg-brand-green/10 text-brand-green", border: "border-brand-green/20", numColor: "text-brand-green/5" },
                { step: "02", title: "Bayar Aman", icon: <ShieldCheck className="h-6 w-6" />, desc: "Dana ditahan sistem hingga pesanan diterima. Pembayaran praktis via QRIS/Transfer.", color: "from-brand-orange/5 to-white", iconBg: "bg-brand-orange/10 text-brand-orange", border: "border-brand-orange/20", numColor: "text-brand-orange/5" },
                { step: "03", title: "Panen & Antar", icon: <Truck className="h-6 w-6" />, desc: "Petani memanen khusus untuk Anda, dan pesanan langsung diantar di hari yang sama.", color: "from-brand-green/5 to-white", iconBg: "bg-brand-green/10 text-brand-green", border: "border-brand-green/20", numColor: "text-brand-green/5" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp} 
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`rounded-[2rem] p-8 sm:p-10 bg-gradient-to-br ${item.color} border ${item.border} shadow-sm relative overflow-hidden group bg-white`}
                >
                  <div className={`absolute -right-6 -top-6 text-[10rem] font-bold ${item.numColor} select-none transition-transform duration-500 group-hover:scale-110`}>{item.step}</div>
                  <div className={`h-14 w-14 rounded-2xl ${item.iconBg} flex items-center justify-center mb-8 relative z-10 shadow-sm`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{item.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed relative z-10">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimoni" className="py-24 sm:py-32 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">Tumbuh bersama komunitas.</h2>
              <p className="text-lg text-slate-500 font-medium">
                Dampak nyata bagi mereka yang telah bergabung.
              </p>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  quote: "Kualitas sayurnya jauh lebih baik dari pasar karena langsung dipanen pagi. Senang sekali bisa tahu siapa yang menanam makanan kita.",
                  name: "Aisyah P.",
                  role: "Konsumen setia"
                },
                {
                  quote: "Dulu sering rugi karena harga dimainkan tengkulak. Sekarang pendapatan saya naik 40% dan saya bisa menentukan harga yang adil.",
                  name: "Pak Hasballah",
                  role: "Petani Padi"
                },
                {
                  quote: "Aplikasi ini mempermudah saya mencari bahan baku segar untuk restoran. Pengirimannya cepat dan harganya sangat bersaing.",
                  name: "Reza M.",
                  role: "Pemilik Rumah Makan"
                }
              ].map((testimonial, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  className="bg-white rounded-[2rem] p-8 border border-brand-green/10 flex flex-col justify-between hover:border-brand-green/30 hover:shadow-lg hover:shadow-brand-green/5 transition-all"
                >
                  <div>
                    <div className="flex gap-1 mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                      ))}
                    </div>
                    <blockquote className="text-slate-700 text-lg font-medium leading-relaxed mb-8">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-brand-green/20 flex items-center justify-center font-bold text-brand-green text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm font-medium text-slate-500 mt-0.5">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="relative rounded-[3rem] overflow-hidden bg-brand-green px-6 py-20 sm:px-16 sm:py-24 text-center shadow-2xl shadow-brand-green/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-brand-green to-brand-orange/80 opacity-90 -z-10"></div>
              
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                Bergabung dalam ekosistem adil.
              </h2>
              <p className="text-lg sm:text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto">
                Beralihlah ke cara berbelanja yang lebih segar dan transparan. Langkah kecil Anda membawa perubahan besar bagi petani lokal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-brand-green shadow-xl hover:bg-slate-50 hover:-translate-y-1 transition-all">
                  Mulai Belanja Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/register?role=petani" className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-8 text-base font-semibold text-white hover:bg-white/20 hover:-translate-y-1 transition-all">
                  Daftar Menjadi Petani
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <div className="bg-gradient-to-tr from-brand-green to-brand-orange p-1.5 rounded-lg">
                <Leaf className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold tracking-tight text-slate-900">PanganTanyoe</span>
            </div>
            <p className="text-sm font-medium text-slate-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} PanganTanyoe &mdash; Dukung petani lokal Aceh.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
