import { stackServerApp } from "@/lib/stack";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up']
};