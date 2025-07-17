import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = ['/dashboard', '/onboarding', '/practitioner-onboarding']

// Paths that should redirect if already authenticated
const authPaths = ['/sign-in', '/sign-up']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the request has an auth cookie (Neon Auth)
  const hasSession = request.cookies.has('auth-token')

  // Check if path requires authentication
  if (protectedPaths.some(p => path.startsWith(p))) {
    if (!hasSession) {
      // Not authenticated, redirect to sign in
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(signInUrl)
    }
  }

  // If user has session and trying to access auth pages, redirect to dashboard
  if (hasSession && authPaths.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|camera-test).*)',
  ],
}