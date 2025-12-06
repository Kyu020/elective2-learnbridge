// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/tutors',
  '/resources',
  '/bookings',
  '/favorites',
  '/profile',
  '/progress',
  '/notifications'
]

// Public routes that should redirect to dashboard if authenticated
const publicRoutes = [
  '/login',
  '/signup',
]

// Routes that are always accessible
const publicOnlyRoutes = ['/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies (set by login page)
  const token = request.cookies.get('token')?.value

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if route is public (login/signup)
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect logic
  if (isProtectedRoute && !token) {
    // Redirect to login if accessing protected route without token
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicRoute && token) {
    // Redirect to dashboard if accessing login/signup while authenticated
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow request to proceed
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

