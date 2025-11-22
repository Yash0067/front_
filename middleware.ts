import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Get the token from localStorage (client-side) or cookies
    const token = request.cookies.get('accessToken')?.value;

    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/'];

    // Define protected routes that require authentication
    const protectedRoutes = ['/', '/projects', '/inbox', '/trash', '/tasks'];

    // If user is authenticated and tries to access login/register, redirect to home
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is not authenticated and tries to access protected routes, redirect to login
    if (!token && protectedRoutes.some(route => pathname.startsWith(route)) && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
