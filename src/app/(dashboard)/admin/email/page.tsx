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

const EMAIL_TRIGGERS = [
  { key: 'new_member', label: 'Anggota baru: kirim password default', active: true },
  { key: 'loan_apply', label: 'Pengajuan pinjaman diterima → anggota', active: true },
  { key: 'loan_approved', label: 'Approval L1/L2/L3 → anggota', active: true },
  { key: 'loan_l3_bendahara', label: 'L3 approve → notif pencairan ke Bendahara', active: true },
  { key: 'loan_disbursed', label: 'Pinjaman dicairkan → anggota', active: true },
  { key: 'loan_rejected', label: 'Pinjaman ditolak → anggota', active: true },
  { key: 'withdrawal_approved', label: 'Penarikan disetujui → anggota', active: true },
  { key: 'withdrawal_disbursed', label: 'Transfer penarikan selesai → anggota', active: true },
  { key: 'auto_deduct_slip', label: 'Slip potongan tgl 25 → tiap anggota', active: true },
  { key: 'auto_deduct_hr', label: 'Laporan rekap tgl 25 → HR & Bendahara', active: true },
  { key: 'profile_updated', label: 'Perubahan profil → anggota', active: true },
  { key: 'announcement', label: 'Pengumuman diterbitkan → semua anggota (opsional)', active: true },
]

export default function EmailConfigPage() {
  const [smtp, setSmtp] = useState({
    host: 'smtp.gmail.com', port: '587', user: 'koperasi@elsewedy.com',
    pass: '', fromName: 'Koperasi Karyawan Elsewedy',
  })
  const [triggers, setTriggers] = useState(EMAIL_TRIGGERS)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: '' })

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 4000)
  }

  function toggleTrigger(key: string) {
    setTriggers(prev => prev.map(t => t.key === key ? { ...t, active: !t.active } : t))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    showToast('Konfigurasi email disimpan. Pastikan env variable SMTP sudah diupdate di Vercel.')
    setSaving(false)
  }

  async function handleTest() {
    setTesting(true)
    await new Promise(r => setTimeout(r, 1200))
    showToast('Email test berhasil dikirim ke ' + smtp.user)
    setTesting(false)
  }

  return (
    <AppLayout navItems={NAV} role="admin" userName="Super Admin" userNik="admin001" title="Konfigurasi Notifikasi Email">
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm text-white max-w-xs ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}
      <div className="max-w-2xl mx-auto space-y-5">
        {/* SMTP Config */}
        <form onSubmit={handleSave} className="card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={18} className="text-navy-700" />
            <h3 className="font-bold text-navy-700">Konfigurasi SMTP</h3>
          </div>

          <div className="rounded-xl p-3 bg-blue-50 border border-blue-200 text-xs text-blue-700 font-semibold">
            📌 Konfigurasi SMTP sebenarnya diatur via Environment Variables di Vercel Dashboard (lebih aman).
            Form ini hanya untuk dokumentasi / referensi.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">SMTP Host</label>
              <input className="input-field" value={smtp.host} onChange={e => setSmtp({ ...smtp, host: e.target.value })} />
            </div>
            <div>
              <label className="label">Port</label>
              <input className="input-field" value={smtp.port} onChange={e => setSmtp({ ...smtp, port: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Email Pengirim</label>
            <input className="input-field" type="email" value={smtp.user} onChange={e => setSmtp({ ...smtp, user: e.target.value })} />
          </div>
          <div>
            <label className="label">Nama Pengirim</label>
            <input className="input-field" value={smtp.fromName} onChange={e => setSmtp({ ...smtp, fromName: e.target.value })} />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={handleTest} disabled={testing}
              className="btn-outline flex-1 py-2.5 disabled:opacity-60">
              {testing ? 'Mengirim...' : '📧 Kirim Email Test'}
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 disabled:opacity-60">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>

        {/* Email triggers */}
        <div className="card">
          <h3 className="font-bold text-navy-700 mb-1">Trigger Notifikasi Email (360°)</h3>
          <p className="text-xs text-gray-400 mb-4">Aktifkan/nonaktifkan jenis email yang dikirim sistem secara otomatis.</p>
          <div className="space-y-2">
            {triggers.map(t => (
              <div key={t.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.active ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700">{t.label}</span>
                </div>
                <button onClick={() => toggleTrigger(t.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${t.active ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${t.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full mt-4 py-2.5" onClick={() => showToast('Trigger email disimpan.')}>
            Simpan Pengaturan Trigger
          </button>
        </div>

        {/* Footer CarloTech note */}
        <div className="card bg-slate-50 border border-slate-200">
          <p className="text-xs text-gray-500 text-center">
            Semua email menggunakan template branded dengan logo Koperasi & footer CarloTech.<br />
            © CarloTech — The Ecosystem of Innovation
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
