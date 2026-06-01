import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-5xl">🔐</div>
        <h1 className="text-2xl font-bold text-gray-800">Tautan Tidak Valid</h1>
        <p className="text-gray-600">
          Tautan yang kamu gunakan sudah kadaluarsa atau tidak valid. Silakan coba lagi.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-green-700 px-6 py-3 text-white font-medium hover:bg-green-800"
        >
          Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  )
}
