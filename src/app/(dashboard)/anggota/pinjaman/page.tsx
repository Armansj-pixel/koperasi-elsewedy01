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

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending_l1: { label: 'Menunggu Sekretaris', color: 'badge-info' },
  pending_l2: { label: 'Menunggu Bendahara', color: 'badge-warning' },
  pending_l3: { label: 'Menunggu Ketua', color: 'badge-gold' },
  disetujui:  { label: 'Disetujui', color: 'badge-success' },
  cair:       { label: 'Aktif', color: 'badge-success' },
  lunas:      { label: 'Lunas', color: 'badge-info' },
  ditolak:    { label: 'Ditolak', color: 'badge-danger' },
}

export default function PinjamanPage() {
  const [pinjamans, setPinjamans] = useState<any[]>([])
  const [cicilans, setCicilans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    fetch('/api/pinjaman').then(r => r.json()).then(data => {
      const list = Array.isArray(data) ? data : []
      setPinjamans(list)
      const active = list.find((p: any) => p.status === 'cair')
      if (active) setSelected(active)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    fetch(`/api/pinjaman/${selected.id}/cicilan`).then(r => r.json()).then(data => {
      setCicilans(Array.isArray(data) ? data : [])
    })
  }, [selected])

  const sisaCicilan = cicilans.filter(c => c.status === 'menunggu').length
  const terbayar = cicilans.filter(c => c.status === 'terbayar').length

  return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Pinjaman Saya">
      <div className="space-y-5">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Memuat...</div>
        ) : pinjamans.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">💳</div>
            <p className="font-bold text-gray-500">Belum ada pinjaman</p>
            <a href="/anggota/ajukan-pinjaman" className="btn-primary inline-block mt-4">Ajukan Pinjaman</a>
          </div>
        ) : (
          <>
            {/* Loan selector jika lebih dari 1 */}
            {pinjamans.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {pinjamans.map(p => (
                  <button key={p.id} onClick={() => setSelected(p)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all
                      ${selected?.id === p.id ? 'bg-navy-700 border-navy-700 text-white' : 'bg-white border-gray-200 text-gray-500'}`}>
                    {p.no_pinjaman}
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <>
                {/* Header card */}
                <div className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold">{selected.no_pinjaman}</p>
                      <p className="font-black text-2xl text-navy-700 mt-1">{fmt(selected.nominal)}</p>
                    </div>
                    <span className={STATUS_LABEL[selected.status]?.color || 'badge-info'}>
                      {STATUS_LABEL[selected.status]?.label || selected.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {[
                      ['Tenor', `${selected.tenor} bulan`],
                      ['Cicilan/Bln', fmt(selected.cicilan_per_bln)],
                      ['Terbayar', `${terbayar}× cicilan`],
                      ['Sisa', `${sisaCicilan}× cicilan`],
                      ['Sisa Pokok', fmt(sisaCicilan * selected.cicilan_per_bln)],
                      ['Auto-Deduct', 'Tgl 25/Bln'],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">{l}</p>
                        <p className="font-bold text-sm text-gray-800 mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar cicilan */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Progres Cicilan</span>
                      <span>{terbayar}/{selected.tenor} bulan</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(terbayar / selected.tenor) * 100}%`, background: 'linear-gradient(90deg, #1A9E6B, #E8B84B)' }} />
                    </div>
                  </div>

                  {/* Cicilan dots */}
                  <div className="grid gap-1 mt-3" style={{ gridTemplateColumns: `repeat(${selected.tenor}, 1fr)` }}>
                    {cicilans.map((c, i) => (
                      <div key={i} title={`Cicilan ke-${c.ke}`}
                        className="h-6 rounded flex items-center justify-center text-[9px] font-bold"
                        style={{
                          background: c.status === 'terbayar' ? '#1A9E6B' : c.status === 'menunggu' && i === terbayar ? '#FEF3C7' : '#F4F6FA',
                          color: c.status === 'terbayar' ? '#fff' : i === terbayar ? '#D97706' : '#9AAABF',
                          border: i === terbayar ? '1.5px solid #D97706' : 'none',
                        }}>{c.ke}</div>
                    ))}
                  </div>
                </div>

                {/* Approval trail */}
                {selected.status !== 'cair' && selected.status !== 'lunas' && (
                  <div className="card">
                    <h3 className="font-bold text-navy-700 mb-4">Status Approval</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Sekretaris (L1)', done: !!selected.approved_l1_at, at: selected.approved_l1_at },
                        { label: 'Bendahara (L2)', done: !!selected.approved_l2_at, at: selected.approved_l2_at },
                        { label: 'Ketua (L3 Final)', done: !!selected.approved_l3_at, at: selected.approved_l3_at },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                            ${step.done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {step.done ? '✓' : i + 1}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${step.done ? 'text-emerald-700' : 'text-gray-400'}`}>{step.label}</p>
                            {step.at && <p className="text-xs text-gray-400">{fmtShort(step.at)}</p>}
                          </div>
                          {!step.done && <span className="badge-warning text-xs">Menunggu</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jadwal cicilan */}
                {cicilans.length > 0 && (
                  <div className="card">
                    <h3 className="font-bold text-navy-700 mb-4">Jadwal Cicilan</h3>
                    <div className="divide-y divide-gray-50">
                      {cicilans.map((c, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Cicilan ke-{c.ke}</p>
                            <p className="text-xs text-gray-400">Tgl 25 · {fmtShort(c.periode)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm">{fmt(c.nominal)}</span>
                            <span className={
                              c.status === 'terbayar' ? 'badge-success' :
                              c.status === 'terlambat' ? 'badge-danger' : 'badge-warning'
                            }>
                              {c.status === 'terbayar' ? 'Lunas' : c.status === 'terlambat' ? 'Terlambat' : 'Menunggu'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
