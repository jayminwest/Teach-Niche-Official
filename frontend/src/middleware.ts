import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from './lib/supabase'

export async function middleware(request: NextRequest) {
  // Only run middleware on auth API routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const session = request.cookies.get('sb-auth-token')?.value

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(session)

      if (error || !user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/auth/:path*']  // Only protect API routes for now
}
