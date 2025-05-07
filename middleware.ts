// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/companies',
  '/users',
  '/employees',
  '/leads',
  '/insights',
  '/profiles',
  '/tags-cards',
  '/integrations',
  '/transactions',
  '/settings',
  '/support',
  '/admin'
];

// Define routes that should bypass authentication checks
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/api',
  '/_next',
  '/favicon.ico',
  '/static'
];

// Interface for decoded JWT token
interface DecodedToken {
  exp?: number;
  [key: string]: any;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check if current route requires authentication
  const requiresAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (!requiresAuth) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value || 
                request.cookies.get('authToken')?.value;
  
  // If no token exists, redirect to login with appropriate parameters
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    // Don't set expired=true here since the token might not have existed in the first place
    return NextResponse.redirect(url);
  }
  
  // Check if token is valid and not expired
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check expiration (exp is in seconds, Date.now() is in milliseconds)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      const url = new URL('/login', request.url);
      url.searchParams.set('expired', 'true');
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // If token can't be decoded, it's invalid
    const url = new URL('/login', request.url);
    url.searchParams.set('error', 'Invalid authentication token');
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Token exists and is valid, proceed
  return NextResponse.next();
}

// Configure the middleware to run on all routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};