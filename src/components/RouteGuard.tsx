'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Protected routes that require authentication
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
  '/superAdmin',
  '/tags'
];

// Auth-related routes that should not trigger redirects when authenticated
const AUTH_ROUTES = ['/login', '/register', '/reset-password', '/forgot-password'];

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading, checkTokenExpiration } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route is protected
  const isProtectedRoute = (path: string | null): boolean => {
    if (!path) return false;
    return PROTECTED_ROUTES.some(route => path.startsWith(route));
  };

  // Check if current route is auth-related
  const isAuthRoute = (path: string | null): boolean => {
    if (!path) return false;
    return AUTH_ROUTES.some(route => path.startsWith(route));
  };

  useEffect(() => {
    // Skip checks if still loading or if we're on server-side
    if (loading || typeof window === 'undefined') return;

    const handleRouteGuard = () => {
      // Check token expiration
      const isTokenExpired = checkTokenExpiration();
      const currentPath = pathname;

      // Case 1: User is not authenticated and tries to access protected route
      if ((!user || isTokenExpired) && isProtectedRoute(currentPath)) {
        console.log('Unauthorized access attempt to protected route:', currentPath);
        const returnUrl = encodeURIComponent(currentPath || '/');
        
        // When token expires, add an expired flag to the URL
        const queryParam = isTokenExpired ? `expired=true&returnUrl=${returnUrl}` : `returnUrl=${returnUrl}`;
        router.push(`/login?${queryParam}`);
        return;
      }

      // Case 2: User is authenticated and tries to access auth routes
      if (user && !isTokenExpired && isAuthRoute(currentPath)) {
        console.log('Authenticated user trying to access auth route, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }
    };

    handleRouteGuard();
  }, [pathname, user, loading, router, checkTokenExpiration]);

  // If still checking authentication, show a simple loading indicator or nothing
  // This prevents flash of redirect when checking auth state
  if (loading) {
    // Either return null or a minimal loading indicator if the check takes time
    return null;
  }

  // Render children once authentication check is complete
  return <>{children}</>;
}