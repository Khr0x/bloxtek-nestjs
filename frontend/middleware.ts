import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const hasAccessToken = request.cookies.has('access_token');
  const hasRefreshToken = request.cookies.has('refresh_token');
  const isAuthenticated = hasAccessToken || hasRefreshToken;

  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);
  
  const isAuthPath = pathname === '/login' || pathname === '/register';

  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
