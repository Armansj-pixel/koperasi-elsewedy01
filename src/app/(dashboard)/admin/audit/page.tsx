'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Users, Settings, Shield, RefreshCw, Mail, User } from 'lucide-react'
import { fmtShort } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Overview Sistem', href: '/admin', icon: <Home size={17} /> },
  { id: 'members', label: 'Manajemen Anggota', href: '/admin/anggota', icon: <Users size={17} /> },
  { id: 'override', label: 'Override Transaksi', href: '/admin/override', icon: <Settings size={17} /> },
  { id: 'audit', label: 'Audit Log', href: '/admin/audit', icon: <Shield size={17} /> },
  { id: 'autoDeduct', label: 'Auto-Deduct Config', href: '/admin/auto-deduct', icon: <RefreshCw size={17} /> },
  { id: 'notif', label: 'Konfigurasi Email', href: '/admin/email', icon: <Mail size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/admin/profil', icon: <User size={17} /> },
]

const LEVEL_COLOR: Record<string, string> = {
  LOGIN: 'badge-info', APPLY_PINJAMAN: 'badge-info',
  APPROVE_PINJAMAN_L1: 'badge-success', APPROVE_PINJAMAN_L2: 'badge-success', APPROVE_PINJAMAN_L3: 'badge-success',
  REJECT_PINJAMAN: 'badge-danger', DISBURSE_PINJAMAN: 'badge-gold',
  AUTO_DEDUCT_SELESAI: 'badge-success', TAMBAH_ANGGOTA: 'badge-info',
  UPDATE_USER: 'badge-warning', OVERRIDE: 'badge-danger',
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('semua')

  useEffect(() => {
    fetch('/api/audit').then(r => r.json()).then(data => {
      setLogs(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const filtered = logs.filter(l => {
    const matchSearch = !search ||
      (l.user?.nama || '').toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <AppLayout navItems={NAV} role="admin" userName="Super Admin" userNik="admin001" title="Audit Log Sistem">
      <div className="space-y-5">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <input className="input-field flex-1 min-w-[200px]" placeholder="Cari user atau aksi..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input-field w-40" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="semua">Semua</option>
            <option value="pinjaman">Pinjaman</option>
            <option value="penarikan">Penarikan</option>
            <option value="auto">Auto-Deduct</option>
            <option value="user">User</option>
          </select>
          <div className="card py-2 px-4 text-sm font-bold text-gray-600 whitespace-nowrap">
            {filtered.length} entri
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-navy-700 text-white">
                <tr>
                  {['Waktu', 'User', 'Aksi', 'Detail', 'Level'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">Memuat...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">Tidak ada data.</td></tr>
                ) : filtered.map((log, i) => (
                  <tr key={log.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtShort(log.created_at)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{log.user?.nama || 'SISTEM'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{log.action}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{log.detail ? JSON.stringify(log.detail).slice(0, 60) + '...' : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={LEVEL_COLOR[log.action] || 'badge-info'}>{log.action.split('_')[0]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
