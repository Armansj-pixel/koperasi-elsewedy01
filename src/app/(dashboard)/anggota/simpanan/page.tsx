'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Wallet, CreditCard, ArrowDownToLine, FileText, User } from 'lucide-react'
import { fmt, fmtShort } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Beranda', href: '/anggota', icon: <Home size={17} /> },
  { id: 'simpanan', label: 'Simpanan', href: '/anggota/simpanan', icon: <Wallet size={17} /> },
  { id: 'pinjaman', label: 'Pinjaman', href: '/anggota/pinjaman', icon: <CreditCard size={17} /> },
  { id: 'tarik', label: 'Tarik Simpanan', href: '/anggota/penarikan', icon: <ArrowDownToLine size={17} /> },
  { id: 'ajukan', label: 'Ajukan Pinjaman', href: '/anggota/ajukan-pinjaman', icon: <CreditCard size={17} /> },
  { id: 'berita', label: 'Info & Berita', href: '/anggota/berita', icon: <FileText size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/anggota/profil', icon: <User size={17} /> },
]

export default function SimpananPage() {
  const [saldo, setSaldo] = useState(0)
  const [mutasi, setMutasi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/simpanan?type=saldo').then(r => r.json()),
      fetch('/api/simpanan?type=mutasi&limit=30').then(r => r.json()),
    ]).then(([s, m]) => {
      setSaldo(s.saldo || 0)
      setMutasi(Array.isArray(m) ? m : [])
      setLoading(false)
    })
  }, [])

  return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Simpanan Saya">
      <div className="space-y-5">
        {/* Saldo card */}
        <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #0D2137, #1E4A73)' }}>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Saldo Simpanan</p>
          <p className="font-black text-3xl">{loading ? '...' : fmt(saldo)}</p>
          <p className="text-blue-300 text-sm mt-2">Diperbarui otomatis setiap tanggal 25</p>
        </div>

        {/* Info box */}
        <div className="card bg-gold-50 border border-gold-200">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚙️</span>
            <div>
              <p className="font-bold text-gold-600 text-sm">Simpanan Bulanan Otomatis</p>
              <p className="text-xs text-gold-500 mt-1">
                Simpanan Anda dipotong otomatis setiap <strong>tanggal 25</strong> bersamaan dengan cicilan pinjaman (jika ada).
                Nominal sesuai kesepakatan saat pendaftaran.
              </p>
            </div>
          </div>
        </div>

        {/* Mutasi */}
        <div className="card">
          <h3 className="font-bold text-navy-700 mb-4">Riwayat Mutasi</h3>
          {loading ? (
            <div className="text-center py-10 text-gray-400">Memuat...</div>
          ) : mutasi.length === 0 ? (
            <div className="text-center py-10 text-gray-400">Belum ada mutasi.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {mutasi.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                      ${m.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {m.type === 'credit' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{m.keterangan}</p>
                      <p className="text-xs text-gray-400">{fmtShort(m.created_at)}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${m.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {m.type === 'credit' ? '+' : '-'}{fmt(m.nominal)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
