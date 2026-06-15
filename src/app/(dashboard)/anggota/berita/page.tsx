'use client'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Home, Wallet, CreditCard, ArrowDownToLine, FileText, User } from 'lucide-react'
import { fmtShort } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Beranda', href: '/anggota', icon: <Home size={17} /> },
  { id: 'simpanan', label: 'Simpanan', href: '/anggota/simpanan', icon: <Wallet size={17} /> },
  { id: 'pinjaman', label: 'Pinjaman', href: '/anggota/pinjaman', icon: <CreditCard size={17} /> },
  { id: 'tarik', label: 'Tarik Simpanan', href: '/anggota/penarikan', icon: <ArrowDownToLine size={17} /> },
  { id: 'ajukan', label: 'Ajukan Pinjaman', href: '/anggota/ajukan-pinjaman', icon: <CreditCard size={17} /> },
  { id: 'berita', label: 'Info & Berita', href: '/anggota/berita', icon: <FileText size={17} /> },
  { id: 'profil', label: 'Profil Saya', href: '/anggota/profil', icon: <User size={17} /> },
]

const KATEGORI_MAP: Record<string, { emoji: string; color: string }> = {
  info:        { emoji: 'ℹ️', color: 'badge-info' },
  pengumuman:  { emoji: '📢', color: 'badge-warning' },
  kegiatan:    { emoji: '🎯', color: 'badge-success' },
}

export default function BeritaPage() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/pengumuman').then(r => r.json()).then(data => {
      setList(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  return (
    <AppLayout navItems={NAV} role="anggota" userName="Ahmad Fauzi" userNik="2024001" title="Info & Berita">
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Memuat...</div>
        ) : list.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-400 font-semibold">Belum ada pengumuman</p>
          </div>
        ) : list.map((p) => {
          const k = KATEGORI_MAP[p.kategori] || KATEGORI_MAP.info
          const isOpen = expanded === p.id
          return (
            <div key={p.id} className="card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setExpanded(isOpen ? null : p.id)}>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: '#F4F6FA' }}>
                  {k.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={k.color}>{p.kategori.toUpperCase()}</span>
                    <span className="text-xs text-gray-400">
                      {p.diterbitkan_at ? fmtShort(p.diterbitkan_at) : fmtShort(p.created_at)}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-base leading-snug">{p.judul}</h4>
                  {isOpen ? (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{p.isi}</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.isi}</p>
                  )}
                  <p className="text-xs text-blue-500 font-semibold mt-2">{isOpen ? '▲ Tutup' : '▼ Selengkapnya'}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
