'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Wallet, CreditCard, ArrowDownToLine, FileText, User } from 'lucide-react'
import { fmt, fmtShort, nextKamis } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Beranda', href: '/anggota', icon: <Home size={17} /> },
  { id: 'simpanan', label: 'Simpanan', href: '/anggota/simpanan', icon: <Wallet size={17} /> },
  { id: 'pinjaman', label: 'Pinjaman', href: '/anggota/pinjaman', icon: <CreditCard size={17} /> },
  { id: 'tarik', label: 'Tarik Simpanan', href: '/anggota/penarikan', icon: <ArrowDownToLine size={17} /> },
  { id: 'ajukan', label: 'Ajukan Pinjaman', href: '/anggota/ajukan-pinjaman', icon: <CreditCard size={17} /> },
  { id: 'berita', label: 'Info & Berita', href: '/anggota/berita', icon: <FileText size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/anggota/profil', icon: <User size={17} /> },
]

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Menunggu Approval', color: 'badge-warning' },
  disetujui: { label: 'Disetujui', color: 'badge-success' },
  cair:      { label: 'Sudah Cair', color: 'badge-info' },
  ditolak:   { label: 'Ditolak', color: 'badge-danger' },
}

export default function PenarikanPage() {
  const [saldo, setSaldo] = useState(0)
  const [profil, setProfil] = useState<any>(null)
  const [riwayat, setRiwayat] = useState<any[]>([])
  const [nominal, setNominal] = useState('')
  const [catatan, setCatatan] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/simpanan?type=saldo').then(r => r.json()),
      fetch('/api/profil').then(r => r.json()),
      fetch('/api/penarikan').then(r => r.json()),
    ]).then(([s, p, wd]) => {
      setSaldo(s.saldo || 0)
      setProfil(p)
      setRiwayat(Array.isArray(wd) ? wd : [])
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nom = Number(nominal)
    if (!nom || nom < 10000) { setError('Nominal minimal Rp 10.000.'); return }
    if (nom > saldo) { setError('Nominal melebihi saldo simpanan.'); return }
    setSubmitting(true); setError('')
    const res = await fetch('/api/penarikan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nominal: nom, catatan }),
    })
    const data = await res.json()
    if (data.success) {
      setSuccess('Pengajuan penarikan berhasil! Email konfirmasi dikirim.')
      setNominal(''); setCatatan('')
      const wd = await fetch('/api/penarikan').then(r => r.json())
      setRiwayat(Array.isArray(wd) ? wd : [])
      const s = await fetch('/api/simpanan?type=saldo').then(r => r.json())
      setSaldo(s.saldo || 0)
    } else {
      setError(data.error || 'Gagal mengajukan penarikan.')
    }
    setSubmitting(false)
  }

  return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Tarik Simpanan">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Saldo */}
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #0D2137, #1E4A73)' }}>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Saldo Tersedia</p>
          <p className="font-black text-3xl">{loading ? '...' : fmt(saldo)}</p>
        </div>

        {/* Jadwal info */}
        <div className="rounded-xl p-4 bg-amber-50 border border-amber-200 flex items-start gap-3">
          <span className="text-xl">📅</span>
          <div className="text-sm text-amber-700">
            <p className="font-bold mb-0.5">Pencairan setiap Kamis</p>
            <p className="text-xs">Kamis berikutnya: <strong>{nextKamis().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</strong></p>
            <p className="text-xs mt-0.5">Transfer dilakukan manual oleh Bendahara ke rekening terdaftar.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h3 className="font-bold text-navy-700">Form Pengajuan Penarikan</h3>

          <div>
            <label className="label">Nominal Penarikan (Rp) *</label>
            <input className="input-field text-base font-bold" type="number"
              placeholder="Masukkan nominal" value={nominal}
              onChange={e => setNominal(e.target.value)} />
          </div>

          {/* Rekening otomatis dari profil */}
          <div className="rounded-xl p-3 bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-bold text-emerald-600 mb-1">🏦 Rekening Tujuan (dari Profil)</p>
            {profil?.no_rekening ? (
              <p className="text-sm font-semibold text-gray-700">
                {profil.nama_bank} — {profil.no_rekening} a.n. {profil.atas_nama_rek}
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">
                ⚠️ Belum ada rekening. <a href="/anggota/profil" className="underline">Lengkapi di Profil</a>
              </p>
            )}
          </div>

          <div>
            <label className="label">Catatan (opsional)</label>
            <input className="input-field" placeholder="Keperluan penarikan..."
              value={catatan} onChange={e => setCatatan(e.target.value)} />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl px-4 py-3">⚠️ {error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl px-4 py-3">✅ {success}</div>}

          <button type="submit" disabled={submitting || !profil?.no_rekening}
            className="btn-primary w-full py-3 disabled:opacity-60">
            {submitting ? 'Mengajukan...' : 'Kirim Pengajuan'}
          </button>
        </form>

        {/* Riwayat */}
        {riwayat.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-navy-700 mb-4">Riwayat Penarikan</h3>
            <div className="divide-y divide-gray-50">
              {riwayat.map((wd, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{wd.no_penarikan}</p>
                    <p className="text-xs text-gray-400">{fmtShort(wd.created_at)}</p>
                    {wd.status === 'cair' && wd.cair_at && (
                      <p className="text-xs text-emerald-600">Cair: {fmtShort(wd.cair_at)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">{fmt(wd.nominal)}</span>
                    <span className={STATUS_MAP[wd.status]?.color || 'badge-info'}>
                      {STATUS_MAP[wd.status]?.label || wd.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
