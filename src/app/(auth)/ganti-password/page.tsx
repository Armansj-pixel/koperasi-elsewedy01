'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function GantiPasswordPage() {
  const router = useRouter()
  const [pw, setPw] = useState({ new: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pw.new !== pw.confirm) { setError('Password tidak cocok.'); return }
    if (pw.new.length < 6) { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    const res = await fetch('/api/profil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_password', newPassword: pw.new }),
    })
    const data = await res.json()
    if (data.success) router.push('/anggota')
    else { setError(data.error || 'Gagal.'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0D2137 0%, #1E4A73 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo-koperasi.jpg" alt="Logo" width={80} height={80} className="mx-auto rounded-2xl shadow-xl mb-4" />
          <h1 className="text-white font-black text-xl">Ganti Password</h1>
          <p className="text-blue-300 text-sm mt-1">Wajib dilakukan saat login pertama</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-700 font-semibold">
            🔐 Akun Anda menggunakan password default. Harap ganti sekarang untuk keamanan.
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Password Baru *</label>
              <input className="input-field" type="password" placeholder="Min. 6 karakter"
                value={pw.new} onChange={e => setPw({ ...pw, new: e.target.value })} required />
            </div>
            <div>
              <label className="label">Konfirmasi Password Baru *</label>
              <input className="input-field" type="password" placeholder="Ulangi password baru"
                value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} required />
            </div>
            {error && <p className="text-red-600 text-sm font-semibold">⚠️ {error}</p>}
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-60">
              {loading ? 'Menyimpan...' : 'Simpan & Masuk →'}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Image src="/logo-carlotech.png" alt="CarloTech" width={80} height={22} className="mx-auto opacity-70 mb-1" />
          <p className="text-blue-400 text-xs">© {new Date().getFullYear()} CarloTech — The Ecosystem of Innovation</p>
        </div>
      </div>
    </div>
  )
}
