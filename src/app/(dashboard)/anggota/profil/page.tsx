'use client'
import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Wallet, CreditCard, ArrowDownToLine, FileText, User } from 'lucide-react'
import ProfilContent from '@/components/ui/ProfilContent'

const NAV = [
  { id: 'home', label: 'Beranda', href: '/anggota', icon: <Home size={17} /> },
  { id: 'simpanan', label: 'Simpanan', href: '/anggota/simpanan', icon: <Wallet size={17} /> },
  { id: 'pinjaman', label: 'Pinjaman', href: '/anggota/pinjaman', icon: <CreditCard size={17} /> },
  { id: 'tarik', label: 'Tarik Simpanan', href: '/anggota/penarikan', icon: <ArrowDownToLine size={17} /> },
  { id: 'ajukan', label: 'Ajukan Pinjaman', href: '/anggota/ajukan-pinjaman', icon: <CreditCard size={17} /> },
  { id: 'berita', label: 'Info & Berita', href: '/anggota/berita', icon: <FileText size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/anggota/profil', icon: <User size={17} /> },
]

export default function AnggotaProfilPage() {
  const [toast, setToast] = useState({ msg: '', type: '' })
  const showToast = (msg: string, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: '' }), 4000) }

  return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Profil Saya">
      {toast.msg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl font-semibold text-sm text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}
      <ProfilContent onToast={showToast} />
    </AppLayout>
  )
}
