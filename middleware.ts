import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './src/lib/auth'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/reset-password']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  const token = req.cookies.get('koperasi_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const payload = verifyToken(token)
  if (!payload) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('koperasi_token')
    return res
  }

  // Role-based routing
  const headers = new Headers(req.headers)
  headers.set('x-user-id', payload.userId)
  headers.set('x-user-role', payload.role)
  headers.set('x-user-nama', payload.nama)

  // Redirect to correct dashboard
  if (pathname === '/') {
    const dashboardMap: Record<string, string> = {
      anggota: '/anggota',
      sekretaris: '/pengurus',
      bendahara: '/pengurus',
      ketua: '/pengurus',
      admin: '/admin',
    }
    return NextResponse.redirect(new URL(dashboardMap[payload.role] || '/login', req.url))
  }

  // Guard dashboard paths
  if (pathname.startsWith('/anggota') && payload.role !== 'anggota') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (pathname.startsWith('/pengurus') && !['sekretaris', 'bendahara', 'ketua'].includes(payload.role)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo-|.*\\.png$|.*\\.jpg$).*)'],
}
