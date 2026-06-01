import Link from 'next/link'

export default function RegisterChoicePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-800">Aceh Fresh</h1>
        <p className="text-gray-600">Daftar sebagai apa?</p>
      </div>

      <div className="grid gap-4">
        <Link
          href="/register/konsumen"
          className="block rounded-xl border-2 border-green-200 bg-white p-6 text-center hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <div className="text-4xl mb-3">🛒</div>
          <h2 className="text-lg font-semibold text-gray-800">Pembeli</h2>
          <p className="text-sm text-gray-500 mt-1">
            Beli hasil panen langsung dari petani dengan harga terbaik
          </p>
        </Link>

        <Link
          href="/register/petani"
          className="block rounded-xl border-2 border-green-200 bg-white p-6 text-center hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <div className="text-4xl mb-3">🌾</div>
          <h2 className="text-lg font-semibold text-gray-800">Petani</h2>
          <p className="text-sm text-gray-500 mt-1">
            Jual hasil panen langsung ke pembeli tanpa perantara
          </p>
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
          Masuk
        </Link>
      </p>
    </div>
  )
}
