'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Users, Settings, Shield, RefreshCw, Mail, BarChart3, User, Plus, Edit2 } from 'lucide-react'
import { fmt } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Overview Sistem', href: '/admin', icon: <Home size={17} /> },
  { id: 'members', label: 'Manajemen Anggota', href: '/admin/anggota', icon: <Users size={17} /> },
  { id: 'override', label: 'Override Transaksi', href: '/admin/override', icon: <Settings size={17} /> },
  { id: 'audit', label: 'Audit Log', href: '/admin/audit', icon: <Shield size={17} /> },
  { id: 'autoDeduct', label: 'Auto-Deduct Config', href: '/admin/auto-deduct', icon: <RefreshCw size={17} /> },
  { id: 'notif', label: 'Konfigurasi Email', href: '/admin/email', icon: <Mail size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/admin/profil', icon: <User size={17} /> },
]

const ROLE_OPTS = ['anggota', 'sekretaris', 'bendahara', 'ketua']

export default function AdminAnggotaPage() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: '' })
  const [form, setForm] = useState({
    nik: '', nama: '', email: '', departemen: '', no_hp: '',
    role: 'anggota', simpanan_bulanan: '', nama_bank: '', no_rekening: '', atas_nama_rek: ''
  })

  const showToast = (msg: string, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 4500) }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/anggota')
    const data = await res.json()
    setList(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd() {
    if (!form.nik || !form.nama || !form.email || !form.simpanan_bulanan) {
      showToast('NIK, Nama, Email, dan Simpanan Bulanan wajib diisi!', 'error'); return
    }
    setSaving(true)
    const res = await fetch('/api/anggota', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, simpanan_bulanan: Number(form.simpanan_bulanan) })
    })
    const data = await res.json()
    if (data.success) {
      showToast(`Anggota ${form.nama} berhasil ditambahkan! Email & password default dikirim.`)
      setShowForm(false)
      setForm({ nik: '', nama: '', email: '', departemen: '', no_hp: '', role: 'anggota', simpanan_bulanan: '', nama_bank: '', no_rekening: '', atas_nama_rek: '' })
      load()
    } else {
      showToast(data.error || 'Gagal menambahkan anggota.', 'error')
    }
    setSaving(false)
  }

  return (
    <AppLayout navItems={NAV} role="admin" userName="Super Admin" userNik="admin001" title="Manajemen Anggota">
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-black text-navy-700 text-xl">Daftar Anggota & Pengurus</h2>
            <p className="text-sm text-gray-400">{list.length} pengguna terdaftar</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Tambah Anggota
          </button>
        </div>

        {/* Add Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6">
              <h3 className="font-black text-navy-700 text-lg mb-1">Tambah Anggota Baru</h3>
              <p className="text-sm text-gray-400 mb-5">Password default akan dikirim otomatis via email.</p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">NIK *</label>
                    <input className="input-field" placeholder="Contoh: 2025001"
                      value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Role</label>
                    <select className="input-field" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                      {ROLE_OPTS.map(r => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Nama Lengkap *</label>
                  <input className="input-field" placeholder="Nama sesuai KTP"
                    value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} />
                </div>

                <div>
                  <label className="label">Email Karyawan *</label>
                  <input className="input-field" type="email" placeholder="nama@elsewedy.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Departemen</label>
                    <input className="input-field" placeholder="Engineering, HR..."
                      value={form.departemen} onChange={e => setForm({ ...form, departemen: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">No. HP</label>
                    <input className="input-field" placeholder="0812-xxxx-xxxx"
                      value={form.no_hp} onChange={e => setForm({ ...form, no_hp: e.target.value })} />
                  </div>
                </div>

                {/* Simpanan bulanan - KEY FIELD */}
                <div className="rounded-xl p-4 border-2 border-gold-400 bg-gold-50">
                  <label className="block text-xs font-bold text-gold-500 mb-1.5 uppercase tracking-wider">
                    ⚙️ Simpanan Bulanan (Auto-Deduct) *
                  </label>
                  <input className="input-field text-base font-bold" type="number"
                    placeholder="Contoh: 500000" value={form.simpanan_bulanan}
                    onChange={e => setForm({ ...form, simpanan_bulanan: e.target.value })} />
                  <p className="text-xs text-gold-600 mt-2">
                    Nominal ini akan dipotong otomatis setiap <strong>tanggal 25</strong> bersama cicilan pinjaman.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Nama Bank</label>
                    <input className="input-field" placeholder="BCA, Mandiri, BRI..."
                      value={form.nama_bank} onChange={e => setForm({ ...form, nama_bank: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">No. Rekening</label>
                    <input className="input-field" placeholder="Nomor rekening"
                      value={form.no_rekening} onChange={e => setForm({ ...form, no_rekening: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label">Atas Nama Rekening</label>
                  <input className="input-field" placeholder="Nama pemilik rekening"
                    value={form.atas_nama_rek} onChange={e => setForm({ ...form, atas_nama_rek: e.target.value })} />
                </div>

                <div className="rounded-xl p-3 bg-blue-50 border border-blue-200 text-xs text-blue-700">
                  📧 <strong>Login pertama:</strong> NIK sebagai username · Password default dikirim via email · Anggota wajib ganti password saat login pertama.
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleAdd} disabled={saving} className="btn-primary flex-1 py-3">
                  {saving ? 'Menyimpan...' : '+ Tambah Anggota'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline px-6">Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy-700 text-white">
                <tr>
                  {['NIK', 'Nama', 'Dept', 'Role', 'Simpanan/Bln', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">Memuat...</td></tr>
                ) : list.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">Belum ada data.</td></tr>
                ) : list.map((u, i) => (
                  <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{u.nik}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{u.nama}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.departemen || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={u.role === 'anggota' ? 'badge-info' : u.role === 'admin' ? 'badge-danger' : 'badge-gold'}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{fmt(u.simpanan_bulanan)}</td>
                    <td className="px-4 py-3">
                      <span className={u.status === 'aktif' ? 'badge-success' : 'badge-danger'}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-gray-400 hover:text-navy-700 transition-colors p-1">
                        <Edit2 size={15} />
                      </button>
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
