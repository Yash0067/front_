import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register'];
    
    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    // If accessing public routes, allow access
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // For protected routes, we can't check localStorage here (server-side)
    // So we allow access and let the client-side auth context handle redirects
    // This prevents infinite redirect loops at the middleware level
    
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
