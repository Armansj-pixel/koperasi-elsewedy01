'use client'
import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Users, Settings, Shield, RefreshCw, Mail, User } from 'lucide-react'
import ProfilContent from '@/components/ui/ProfilContent'

const NAV = [
  { id: 'home', label: 'Overview Sistem', href: '/admin', icon: <Home size={17} /> },
  { id: 'members', label: 'Manajemen Anggota', href: '/admin/anggota', icon: <Users size={17} /> },
  { id: 'override', label: 'Override Transaksi', href: '/admin/override', icon: <Settings size={17} /> },
  { id: 'audit', label: 'Audit Log', href: '/admin/audit', icon: <Shield size={17} /> },
  { id: 'autoDeduct', label: 'Auto-Deduct Config', href: '/admin/auto-deduct', icon: <RefreshCw size={17} /> },
  { id: 'notif', label: 'Konfigurasi Email', href: '/admin/email', icon: <Mail size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/admin/profil', icon: <User size={17} /> },
]

export default function AdminProfilPage() {
  const [toast, setToast] = useState({ msg: '', type: '' })
  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 4000)
  }
  return (
    <AppLayout navItems={NAV} role="admin" userName="Super Admin" userNik="admin001" title="Profil Saya">
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}
      <ProfilContent onToast={showToast} />
    </AppLayout>
  )
}
