import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Define public paths that don't need authentication
  const publicPaths = [
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password',
    '/auth/callback',
    '/'  // assuming your homepage is public
  ]

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for authentication
  const hasSession = request.cookies.get('sb-access-token')?.value || 
                    request.cookies.get('sb-refresh-token')?.value

  if (!hasSession) {
    // Redirect to login if no session exists
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
