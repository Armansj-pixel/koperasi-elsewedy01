'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Users, Settings, Shield, RefreshCw, Mail, User } from 'lucide-react'
import { fmt, fmtShort, nextTanggal25 } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Overview Sistem', href: '/admin', icon: <Home size={17} /> },
  { id: 'members', label: 'Manajemen Anggota', href: '/admin/anggota', icon: <Users size={17} /> },
  { id: 'override', label: 'Override Transaksi', href: '/admin/override', icon: <Settings size={17} /> },
  { id: 'audit', label: 'Audit Log', href: '/admin/audit', icon: <Shield size={17} /> },
  { id: 'autoDeduct', label: 'Auto-Deduct Config', href: '/admin/auto-deduct', icon: <RefreshCw size={17} /> },
  { id: 'notif', label: 'Konfigurasi Email', href: '/admin/email', icon: <Mail size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/admin/profil', icon: <User size={17} /> },
]

export default function AutoDeductConfigPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: '' })

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 5000)
  }

  useEffect(() => {
    fetch('/api/auto-deduct').then(r => r.json()).then(data => {
      setLogs(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  async function handleManualRun() {
    if (!confirm('Jalankan auto-deduct manual sekarang? Pastikan ini hanya dilakukan pada tanggal 25 atau untuk testing.')) return
    setRunning(true)
    const res = await fetch('/api/auto-deduct', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json()
    if (data.success) {
      showToast(`✅ Auto-deduct selesai! ${data.totalAnggota} anggota diproses. Total: ${fmt(data.totalSimpanan + data.totalCicilan)}`)
      const newLogs = await fetch('/api/auto-deduct').then(r => r.json())
      setLogs(Array.isArray(newLogs) ? newLogs : [])
    } else {
      showToast(data.error || 'Gagal menjalankan auto-deduct.', 'error')
    }
    setRunning(false)
  }

  return (
    <AppLayout navItems={NAV} role="admin" userName="Super Admin" userNik="admin001" title="Konfigurasi Auto-Deduct">
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm text-white max-w-xs ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Status */}
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #0D2137, #1E4A73)' }}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-gold-300 text-xs font-bold uppercase tracking-wider mb-2">⚙️ Jadwal Auto-Deduct</p>
              <p className="font-black text-xl">Tanggal 25 Setiap Bulan</p>
              <p className="text-blue-300 text-sm mt-1">Pukul 00:00 WIB (17:00 UTC)</p>
              <p className="text-blue-300 text-xs mt-1">Cron: <code className="bg-white/10 px-1.5 py-0.5 rounded">0 17 24 * *</code></p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-2 self-start">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-sm font-bold">AKTIF</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-blue-300 text-xs">Eksekusi berikutnya: <strong className="text-white">
              {nextTanggal25().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </strong></p>
          </div>
        </div>

        {/* Yang diproses */}
        <div className="card">
          <h3 className="font-bold text-navy-700 mb-4">Yang Diproses Setiap Tgl 25</h3>
          <div className="space-y-2">
            {[
              { icon: '💳', label: 'Potong simpanan bulanan semua anggota aktif', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { icon: '💳', label: 'Potong cicilan pinjaman yang jatuh tempo bulan ini', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { icon: '📊', label: 'Update saldo simpanan & status cicilan real-time', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { icon: '📧', label: 'Kirim slip potongan via email ke masing-masing anggota', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { icon: '🏢', label: 'Kirim laporan rekap ke HR & Bendahara via email', color: 'bg-gold-50 border-gold-200 text-gold-600' },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl p-3 border flex items-center gap-3 text-sm font-semibold ${item.color}`}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Manual trigger */}
        <div className="card border-2 border-red-200">
          <h3 className="font-bold text-red-700 mb-2">⚡ Jalankan Manual (Testing)</h3>
          <p className="text-sm text-gray-500 mb-4">Hanya gunakan untuk testing atau jika cron gagal. Data akan benar-benar diproses.</p>
          <button onClick={handleManualRun} disabled={running}
            className="btn-danger w-full py-3 disabled:opacity-60">
            {running ? '⏳ Memproses...' : '▶ Jalankan Auto-Deduct Sekarang'}
          </button>
        </div>

        {/* Riwayat */}
        <div className="card">
          <h3 className="font-bold text-navy-700 mb-4">Riwayat Eksekusi</h3>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Memuat...</div>
          ) : logs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Belum ada riwayat.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50">
                    {['Periode', 'Anggota', 'Simpanan', 'Cicilan', 'Total', 'Status'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs text-gray-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2.5 font-semibold">{fmtShort(log.periode)}</td>
                      <td className="px-3 py-2.5 text-gray-500">{log.total_anggota}</td>
                      <td className="px-3 py-2.5 text-emerald-600 font-semibold">{fmt(log.total_simpanan)}</td>
                      <td className="px-3 py-2.5 text-amber-600 font-semibold">{fmt(log.total_cicilan)}</td>
                      <td className="px-3 py-2.5 font-black text-navy-700">{fmt(log.total_potongan)}</td>
                      <td className="px-3 py-2.5">
                        <span className={log.status === 'success' ? 'badge-success' : 'badge-danger'}>{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
