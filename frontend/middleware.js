import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  // Await cookies().get()
  const session = await cookies().get('session');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Public paths that don't require authentication
  const publicPaths = ['/', '/auth', '/about', '/products'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // No session and trying to access protected route
  if (!session?.value && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Has session and trying to access auth page
  if (session?.value && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};