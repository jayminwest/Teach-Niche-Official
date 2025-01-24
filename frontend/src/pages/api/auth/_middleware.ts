import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('sb-auth-token')?.value

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(session)

    if (error || !user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
}

export const config = {
  matcher: ['/api/auth/:path*'],
}
