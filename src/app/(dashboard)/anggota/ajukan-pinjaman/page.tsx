'use client'
import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Wallet, CreditCard, ArrowDownToLine, FileText, User } from 'lucide-react'
import { fmt, LOAN_LIMIT, LOAN_MAX_TENOR } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const NAV = [
  { id: 'home', label: 'Beranda', href: '/anggota', icon: <Home size={17} /> },
  { id: 'simpanan', label: 'Simpanan', href: '/anggota/simpanan', icon: <Wallet size={17} /> },
  { id: 'pinjaman', label: 'Pinjaman', href: '/anggota/pinjaman', icon: <CreditCard size={17} /> },
  { id: 'tarik', label: 'Tarik Simpanan', href: '/anggota/penarikan', icon: <ArrowDownToLine size={17} /> },
  { id: 'ajukan', label: 'Ajukan Pinjaman', href: '/anggota/ajukan-pinjaman', icon: <CreditCard size={17} /> },
  { id: 'berita', label: 'Info & Berita', href: '/anggota/berita', icon: <FileText size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/anggota/profil', icon: <User size={17} /> },
]

export default function AjukanPinjamanPage() {
  const router = useRouter()
  const [nominal, setNominal] = useState(5000000)
  const [tenor, setTenor] = useState(6)
  const [tujuan, setTujuan] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const cicilan = Math.ceil(nominal / tenor)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tujuan.trim()) { setError('Tujuan pinjaman wajib diisi.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/pinjaman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nominal, tenor, tujuan }),
    })
    const data = await res.json()
    if (data.success) { setSuccess(true); setTimeout(() => router.push('/anggota/pinjaman'), 2000) }
    else setError(data.error || 'Gagal mengajukan pinjaman.')
    setLoading(false)
  }

  if (success) return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Ajukan Pinjaman">
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">✅</div>
        <h2 className="font-black text-xl text-navy-700">Pengajuan Terkirim!</h2>
        <p className="text-gray-500 text-sm text-center">Email konfirmasi dikirim. Mengarahkan ke halaman pinjaman...</p>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Ajukan Pinjaman">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Info limit */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card bg-gold-50 border border-gold-200">
            <p className="text-xs text-gold-500 font-semibold">Limit Pinjaman</p>
            <p className="font-black text-lg text-gold-600">{fmt(LOAN_LIMIT)}</p>
          </div>
          <div className="card bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-500 font-semibold">Tenor Maksimal</p>
            <p className="font-black text-lg text-blue-600">{LOAN_MAX_TENOR} Bulan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <h3 className="font-bold text-navy-700 text-lg">Form Pengajuan Pinjaman</h3>

          {/* Nominal slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label mb-0">Nominal Pinjaman</label>
              <span className="font-black text-gold-500 text-base">{fmt(nominal)}</span>
            </div>
            <input type="range" min={1000000} max={LOAN_LIMIT} step={500000}
              value={nominal} onChange={e => setNominal(Number(e.target.value))}
              className="w-full accent-gold-400" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{fmt(1000000)}</span><span>{fmt(LOAN_LIMIT)}</span>
            </div>
          </div>

          {/* Tenor slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="label mb-0">Tenor</label>
              <span className="font-black text-navy-700 text-base">{tenor} Bulan</span>
            </div>
            <input type="range" min={1} max={LOAN_MAX_TENOR} step={1}
              value={tenor} onChange={e => setTenor(Number(e.target.value))}
              className="w-full accent-navy-700" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 bln</span><span>12 bln</span>
            </div>
          </div>

          {/* Simulasi */}
          <div className="rounded-xl p-4 border-2 border-gold-300 bg-gold-50">
            <p className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-3">📊 Simulasi Cicilan</p>
            <div className="grid grid-cols-3 gap-3">
              {[['Pokok', fmt(nominal)], ['Cicilan/Bln', fmt(cicilan)], ['Tenor', `${tenor} bln`]].map(([l, v]) => (
                <div key={l} className="bg-white rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">{l}</p>
                  <p className="font-black text-sm text-navy-700 mt-1">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gold-600 mt-3">
              Cicilan dipotong otomatis setiap <strong>tanggal 25</strong> mulai bulan berikutnya.
            </p>
          </div>

          {/* Tujuan */}
          <div>
            <label className="label">Tujuan Pinjaman *</label>
            <textarea className="input-field min-h-[90px] resize-none"
              placeholder="Jelaskan keperluan penggunaan dana..."
              value={tujuan} onChange={e => setTujuan(e.target.value)} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
            {loading ? 'Mengajukan...' : 'Ajukan Pinjaman →'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Proses approval: <strong>Sekretaris (L1) → Bendahara (L2) → Ketua (L3)</strong><br />
            Email konfirmasi dikirim di setiap tahap.
          </p>
        </form>
      </div>
    </AppLayout>
  )
}
