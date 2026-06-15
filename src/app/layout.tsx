import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Koperasi Jasa Karyawan — PT. Elsewedy Electric Indonesia',
  description: 'Aplikasi Koperasi Simpan Pinjam Karyawan PT. Elsewedy Electric Indonesia',
  manifest: '/manifest.json',
  icons: { apple: '/logo-koperasi.jpg' },
}

export const viewport: Viewport = {
  themeColor: '#0D2137',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-gray-50">{children}</body>
    </html>
  )
}
