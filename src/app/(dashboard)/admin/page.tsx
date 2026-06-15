'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Users, Settings, Shield, RefreshCw, Mail, BarChart3, User } from 'lucide-react'
import { fmt, fmtShort } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Overview Sistem', href: '/admin', icon: <Home size={17} /> },
  { id: 'members', label: 'Manajemen Anggota', href: '/admin/anggota', icon: <Users size={17} /> },
  { id: 'override', label: 'Override Transaksi', href: '/admin/override', icon: <Settings size={17} /> },
  { id: 'audit', label: 'Audit Log', href: '/admin/audit', icon: <Shield size={17} /> },
  { id: 'autoDeduct', label: 'Konfigurasi Auto-Deduct', href: '/admin/auto-deduct', icon: <RefreshCw size={17} /> },
  { id: 'notif', label: 'Konfigurasi Email', href: '/admin/email', icon: <Mail size={17} /> },
  { id: 'laporan', label: 'Laporan Sistem', href: '/admin/laporan', icon: <BarChart3 size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/admin/profil', icon: <User size={17} /> },
]

const STATUS_ROWS = [
  { name: 'Database PostgreSQL (Supabase)', status: 'OK', latency: '12ms' },
  { name: 'API Server (Next.js)', status: 'OK', latency: '45ms' },
  { name: 'Cron Auto-Deduct (Vercel)', status: 'OK', latency: 'Aktif' },
  { name: 'Email Service (SMTP)', status: 'OK', latency: '89ms' },
  { name: 'File Storage', status: 'OK', latency: '120ms' },
]

const AUDIT_MOCK = [
  { user: 'Ketua', action: 'APPROVE_PINJAMAN_L3', target: 'PIN-027 · Riko P. · Rp 15 jt', tgl: '06 Jun 14:22', level: 'success' },
  { user: 'SISTEM', action: 'EMAIL_NOTIF → Bendahara', target: 'Pencairan PIN-027 siap diproses', tgl: '06 Jun 14:22', level: 'gold' },
  { user: 'SISTEM', action: 'AUTO_DEDUCT_SELESAI', target: '142 anggota · Rp 164.500.000', tgl: '25 Mei 09:00', level: 'success' },
  { user: 'SISTEM', action: 'EMAIL_SLIP → 142 anggota', target: 'Slip potongan Mei 2025 terkirim', tgl: '25 Mei 09:01', level: 'gold' },
  { user: 'Bendahara', action: 'DISBURSE_PINJAMAN', target: 'PIN-024 · Ahmad F. · Rp 15 jt', tgl: '01 Jun 13:00', level: 'success' },
  { user: 'Admin', action: 'TAMBAH_ANGGOTA', target: 'NIK 2025001 · Rina W.', tgl: '02 Jun 10:00', level: 'info' },
]

export default function AdminDashboard() {
  return (
    <AppLayout navItems={NAV} role="admin" userName="Super Admin" userNik="admin001" title="Overview Sistem">
      <div className="space-y-5">
        {/* Admin banner */}
        <div className="rounded-2xl p-5 text-white flex items-center justify-between flex-wrap gap-3"
          style={{ background: 'linear-gradient(135deg, #0D2137 0%, #1E4A73 100%)' }}>
          <div>
            <div className="text-gold-300 text-xs font-bold uppercase tracking-wider mb-1">🛡️ Super Admin Panel</div>
            <div className="font-black text-xl">Full System Access</div>
            <div className="text-blue-300 text-sm mt-1">Koperasi Jasa Karyawan PT. Elsewedy Electric Indonesia</div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-4 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 text-sm font-semibold">Sistem Normal</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total User', value: '156', sub: '142 anggota · 14 pengurus', emoji: '👥', color: '#2563EB' },
            { label: 'Transaksi Hari Ini', value: '23', sub: '21 sukses · 2 pending', emoji: '✅', color: '#1A9E6B' },
            { label: 'Error Log', value: '0', sub: '24 jam terakhir', emoji: '🔒', color: '#1A9E6B' },
            { label: 'Uptime', value: '99.9%', sub: '30 hari terakhir', emoji: '⚡', color: '#C9973A' },
          ].map(s => (
            <div key={s.label} className="card">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">{s.label}</div>
                  <div className="font-black text-lg" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Auto-Deduct status */}
        <div className="card">
          <h3 className="font-bold text-navy-700 mb-4">⚙️ Status Auto-Deduct</h3>
          <div className="rounded-xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #0D2137, #163352)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-gold-300 text-xs font-bold mb-1">Eksekusi Berikutnya</div>
                <div className="text-white font-black text-lg">25 Juli 2025 — 00:00 WIB</div>
                <div className="text-blue-300 text-sm mt-1">142 anggota · Est. {fmt(164500000)}</div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-3 py-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 text-xs font-bold">AKTIF</span>
                </div>
                <div className="text-blue-400 text-xs">Cron: 0 17 24 * * (UTC)</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '💳', label: 'Simpanan + cicilan otomatis dipotong', color: '#E8F7F1', border: '#6ee7b7' },
              { icon: '📧', label: 'Slip email ke tiap anggota', color: '#EFF6FF', border: '#93c5fd' },
              { icon: '🏢', label: 'Laporan rekap ke HR & Bendahara', color: '#FDF3DC', border: '#fcd34d' },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3 text-sm font-semibold text-gray-700 flex items-center gap-2"
                style={{ background: item.color, border: `1px solid ${item.border}` }}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Component health */}
        <div className="card">
          <h3 className="font-bold text-navy-700 mb-4">Status Komponen Sistem</h3>
          <div className="space-y-2">
            {STATUS_ROWS.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-gray-700">{c.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{c.latency}</span>
                  <span className="badge-success">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit log preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-700">Aktivitas Terkini</h3>
            <a href="/admin/audit" className="text-xs text-blue-600 font-semibold hover:underline">Lihat semua →</a>
          </div>
          <div className="space-y-2">
            {AUDIT_MOCK.slice(0, 5).map((log, i) => {
              const dotColor: Record<string, string> = { success: '#1A9E6B', gold: '#C9973A', info: '#2563EB', danger: '#DC2626' }
              return (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColor[log.level] || '#9AAABF' }} />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-gray-700">{log.user}</span>
                    <span className="text-xs text-gray-400 mx-1.5">·</span>
                    <span className="font-mono text-xs text-gray-500">{log.action}</span>
                    <div className="text-xs text-gray-400 mt-0.5 truncate">{log.target}</div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{log.tgl}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
