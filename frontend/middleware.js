import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Define public routes
  const publicPaths = ['/', '/auth', '/about', '/products'];
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect unauthenticated user from protected routes
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redirect authenticated user away from auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
