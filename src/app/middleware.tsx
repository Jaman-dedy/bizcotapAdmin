import { NextRequest, NextResponse } from 'next/server';

// List of paths that don't require authentication
const publicPaths = [
  '/',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh-token',
  '/api/auth/forgot-password',
];

// Function to check if the path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`)
  );
};

// Function to check if the path is an API route that should be handled by API middleware
const isApiRoute = (path: string) => {
  return path.startsWith('/api/');
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for public paths and static assets
  if (
    isPublicPath(path) || 
    path.includes('.') || // Static files like .js, .css, etc.
    path.startsWith('/_next/') || 
    path.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }
  
  // Check for token in cookies or authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // For API routes, return 401 if no token
  if (isApiRoute(path) && !token) {
    return NextResponse.json(
      { message: 'Authentication required' }, 
      { status: 401 }
    );
  }
  
  // For page routes, redirect to login if no token
  if (!token) {
    // Create the return URL
    const returnUrl = encodeURIComponent(request.nextUrl.pathname);
    const loginUrl = new URL(`/?returnUrl=${returnUrl}`, request.url);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Token exists, continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except public and static asset paths
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};