'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [nik, setNik] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'NIK atau password salah.'); return }
      // Redirect based on role
      const map: Record<string, string> = {
        anggota: '/anggota', sekretaris: '/pengurus',
        bendahara: '/pengurus', ketua: '/pengurus', admin: '/admin',
      }
      router.push(map[data.role] || '/anggota')
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0D2137 0%, #1E4A73 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo-koperasi.jpg" alt="Koperasi" width={100} height={100}
              className="rounded-2xl shadow-2xl" />
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight">Koperasi Jasa Karyawan</h1>
          <p className="text-blue-300 text-sm mt-1">PT. Elsewedy Electric Indonesia</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-navy-700 font-black text-xl mb-1">Masuk ke Akun</h2>
          <p className="text-gray-400 text-sm mb-7">Gunakan NIK dan password Anda</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Nomor Induk Karyawan (NIK)</label>
              <input className="input-field" placeholder="Masukkan NIK Anda"
                value={nik} onChange={e => setNik(e.target.value)} required autoComplete="username" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input-field pr-10" type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold">
                  {showPw ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? 'Memverifikasi...' : 'Masuk →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Lupa password? Hubungi Admin / Pengurus Koperasi
            </p>
          </div>
        </div>

        {/* CarloTech footer */}
        <div className="mt-8 text-center">
          <Image src="/logo-carlotech.png" alt="CarloTech" width={100} height={28}
            className="mx-auto mb-2 opacity-80" />
          <p className="text-blue-400 text-xs">© {new Date().getFullYear()} CarloTech — The Ecosystem of Innovation</p>
        </div>
      </div>
    </div>
  )
}
