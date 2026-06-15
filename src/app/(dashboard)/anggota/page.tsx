'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Wallet, CreditCard, ArrowDownToLine, FileText, User } from 'lucide-react'
import { fmt, fmtShort, nextKamis, nextTanggal25 } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Beranda', href: '/anggota', icon: <Home size={17} /> },
  { id: 'simpanan', label: 'Simpanan', href: '/anggota/simpanan', icon: <Wallet size={17} /> },
  { id: 'pinjaman', label: 'Pinjaman', href: '/anggota/pinjaman', icon: <CreditCard size={17} /> },
  { id: 'tarik', label: 'Tarik Simpanan', href: '/anggota/penarikan', icon: <ArrowDownToLine size={17} /> },
  { id: 'ajukan', label: 'Ajukan Pinjaman', href: '/anggota/ajukan-pinjaman', icon: <CreditCard size={17} /> },
  { id: 'berita', label: 'Info & Berita', href: '/anggota/berita', icon: <FileText size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/anggota/profil', icon: <User size={17} /> },
]

export default function AnggotaDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/simpanan/saldo').then(r => r.json()),
      fetch('/api/pinjaman?status=cair').then(r => r.json()),
      fetch('/api/simpanan/mutasi?limit=5').then(r => r.json()),
    ]).then(([saldo, pinjaman, mutasi]) => {
      setData({ saldo, pinjaman: pinjaman[0] || null, mutasi })
      setLoading(false)
    })
  }, [])

  const saldoSimpanan = data?.saldo?.saldo || 0
  const pinjaman = data?.pinjaman
  const mutasi = data?.mutasi || []
  const sisaCicilan = pinjaman ? (pinjaman.cicilan?.filter((c: any) => c.status === 'menunggu').length || 0) : 0

  return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Beranda">
      <div className="space-y-5">
        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #0D2137, #1E4A73)' }}>
          <p className="text-blue-300 text-sm mb-1">Selamat datang 👋</p>
          <h2 className="font-black text-2xl mb-4">Ahmad Fauzi</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gold-300 text-xs font-bold uppercase tracking-wider mb-1">Simpanan</div>
              <div className="font-black text-xl">{loading ? '—' : fmt(saldoSimpanan)}</div>
            </div>
            <div>
              <div className="text-gold-300 text-xs font-bold uppercase tracking-wider mb-1">Sisa Pinjaman</div>
              <div className="font-black text-xl">{loading ? '—' : pinjaman ? fmt(sisaCicilan * pinjaman.cicilan_per_bln) : 'Tidak ada'}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Simpanan/Bln', value: 'Rp 500.000', sub: 'Auto tgl 25', color: '#1A9E6B' },
            { label: 'Cicilan/Bln', value: pinjaman ? fmt(pinjaman.cicilan_per_bln) : '—', sub: pinjaman ? `Sisa ${sisaCicilan}×` : 'Tidak ada pinjaman', color: '#D97706' },
            { label: 'Auto-Deduct', value: `Tgl 25`, sub: fmtShort(nextTanggal25()), color: '#2563EB' },
            { label: 'Pencairan', value: 'Tiap Kamis', sub: fmtShort(nextKamis()), color: '#C9973A' },
          ].map(s => (
            <div key={s.label} className="card">
              <div className="text-xs text-gray-500 font-semibold mb-1">{s.label}</div>
              <div className="font-black text-base" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Cicilan tracker */}
        {pinjaman && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-700">Progres Cicilan Pinjaman</h3>
              <span className="badge-warning">{sisaCicilan} SISA</span>
            </div>
            <div className="grid grid-cols-12 gap-1 mb-3">
              {Array.from({ length: pinjaman.tenor }, (_, i) => {
                const done = i < (pinjaman.tenor - sisaCicilan)
                const current = i === (pinjaman.tenor - sisaCicilan)
                return (
                  <div key={i} className="h-6 rounded flex items-center justify-center text-[9px] font-bold"
                    style={{
                      background: done ? '#1A9E6B' : current ? '#FEF3C7' : '#F4F6FA',
                      color: done ? '#fff' : current ? '#D97706' : '#9AAABF',
                      border: current ? '1.5px solid #D97706' : 'none',
                    }}>{i + 1}</div>
                )
              })}
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>🟢 Lunas ({pinjaman.tenor - sisaCicilan})</span>
              <span>🟡 Bulan ini</span>
              <span>⬜ Mendatang ({sisaCicilan - 1})</span>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Tarik Simpanan', href: '/anggota/penarikan', bg: '#EFF6FF', color: '#2563EB', emoji: '💸' },
            { label: 'Ajukan Pinjaman', href: '/anggota/ajukan-pinjaman', bg: '#FDF3DC', color: '#C9973A', emoji: '💰' },
            { label: 'Riwayat', href: '/anggota/simpanan', bg: '#E8F7F1', color: '#1A9E6B', emoji: '📊' },
            { label: 'Info', href: '/anggota/berita', bg: '#F0F4F9', color: '#0D2137', emoji: '📢' },
          ].map(a => (
            <a key={a.label} href={a.href}
              className="card flex flex-col items-center gap-2 py-4 hover:shadow-md transition-shadow text-center no-underline">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: a.bg }}>{a.emoji}</div>
              <span className="text-xs font-semibold text-gray-700 leading-tight">{a.label}</span>
            </a>
          ))}
        </div>

        {/* Mutasi */}
        <div className="card">
          <h3 className="font-bold text-navy-700 mb-4">Mutasi Terbaru</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm">Memuat...</div>
          ) : mutasi.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">Belum ada mutasi.</div>
          ) : mutasi.map((m: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${m.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  {m.type === 'credit' ? '↑' : '↓'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{m.keterangan}</div>
                  <div className="text-xs text-gray-400">{fmtShort(m.created_at)}</div>
                </div>
              </div>
              <div className={`font-bold text-sm ${m.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                {m.type === 'credit' ? '+' : '-'}{fmt(m.nominal)}
              </div>
            </div>
          ))}
        </div>

        {/* Email notif info */}
        <div className="rounded-xl p-4 border flex gap-3 items-start" style={{ background: '#EFF6FF', borderColor: '#93c5fd' }}>
          <span className="text-blue-600 text-lg">📧</span>
          <p className="text-blue-700 text-xs leading-relaxed">
            <strong>Notifikasi Email Aktif:</strong> Anda akan menerima email setiap ada mutasi,
            update approval pinjaman, konfirmasi penarikan, dan slip potongan setiap tanggal 25.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
