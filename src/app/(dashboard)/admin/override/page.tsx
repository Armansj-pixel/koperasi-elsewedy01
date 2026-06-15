'use client'
import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Users, Settings, Shield, RefreshCw, Mail, User } from 'lucide-react'

const NAV = [
  { id: 'home', label: 'Overview Sistem', href: '/admin', icon: <Home size={17} /> },
  { id: 'members', label: 'Manajemen Anggota', href: '/admin/anggota', icon: <Users size={17} /> },
  { id: 'override', label: 'Override Transaksi', href: '/admin/override', icon: <Settings size={17} /> },
  { id: 'audit', label: 'Audit Log', href: '/admin/audit', icon: <Shield size={17} /> },
  { id: 'autoDeduct', label: 'Auto-Deduct Config', href: '/admin/auto-deduct', icon: <RefreshCw size={17} /> },
  { id: 'notif', label: 'Konfigurasi Email', href: '/admin/email', icon: <Mail size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/admin/profil', icon: <User size={17} /> },
]

const OVERRIDE_TYPES = [
  'Koreksi Saldo Simpanan',
  'Koreksi Status Cicilan',
  'Batalkan Transaksi Simpanan',
  'Update Status Pinjaman',
  'Update Simpanan Bulanan Anggota',
  'Reset Password Anggota',
]

export default function OverridePage() {
  const [form, setForm] = useState({ nik: '', type: OVERRIDE_TYPES[0], nilai: '', alasan: '', pin: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: '' })

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 5000)
  }

  async function handleOverride(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nik || !form.nilai || !form.alasan || !form.pin) {
      showToast('Semua field wajib diisi.', 'error'); return
    }
    if (form.pin !== 'admin1234') {
      showToast('PIN Admin salah.', 'error'); return
    }
    setLoading(true)
    // In real app: call specific override API
    await new Promise(r => setTimeout(r, 1000))
    showToast(`Override "${form.type}" untuk NIK ${form.nik} berhasil. Tercatat di audit log.`)
    setForm({ nik: '', type: OVERRIDE_TYPES[0], nilai: '', alasan: '', pin: '' })
    setLoading(false)
  }

  return (
    <AppLayout navItems={NAV} role="admin" userName="Super Admin" userNik="admin001" title="Override Transaksi">
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm text-white max-w-xs ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}
      <div className="max-w-lg mx-auto space-y-5">
        {/* Warning */}
        <div className="rounded-xl p-4 bg-red-50 border-2 border-red-200 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="text-sm text-red-700">
            <p className="font-black mb-1">Fitur Berbahaya — Gunakan dengan Hati-hati</p>
            <p>Override hanya untuk koreksi data error. Setiap tindakan <strong>tercatat permanen</strong> di audit log beserta waktu, user, dan alasan.</p>
          </div>
        </div>

        <form onSubmit={handleOverride} className="card space-y-4">
          <h3 className="font-bold text-navy-700">Form Override Transaksi</h3>

          <div>
            <label className="label">NIK Anggota *</label>
            <input className="input-field" placeholder="Masukkan NIK anggota target"
              value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value })} />
          </div>

          <div>
            <label className="label">Jenis Override *</label>
            <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {OVERRIDE_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Nilai / Data Baru *</label>
            <input className="input-field" placeholder="Nominal, status, atau nilai baru..."
              value={form.nilai} onChange={e => setForm({ ...form, nilai: e.target.value })} />
          </div>

          <div>
            <label className="label">Alasan Koreksi * (wajib detail)</label>
            <textarea className="input-field min-h-[90px] resize-none"
              placeholder="Jelaskan alasan koreksi secara detail untuk keperluan audit..."
              value={form.alasan} onChange={e => setForm({ ...form, alasan: e.target.value })} />
          </div>

          <div>
            <label className="label">PIN Admin (Konfirmasi) *</label>
            <input className="input-field" type="password" placeholder="Masukkan PIN admin"
              value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value })} />
            <p className="text-xs text-gray-400 mt-1">PIN demo: admin1234</p>
          </div>

          <button type="submit" disabled={loading} className="btn-danger w-full py-3 disabled:opacity-60">
            {loading ? 'Memproses...' : '⚡ Eksekusi Override'}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}
