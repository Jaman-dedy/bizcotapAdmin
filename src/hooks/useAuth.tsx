'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/services/api';
import { jwtDecode } from 'jwt-decode';

// Define types for better TypeScript support
interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'individual';
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  checkTokenExpiration: () => boolean;
}

// Define type for decoded JWT to match your actual token structure
interface DecodedToken {
  sub?: number; // ID comes as a number
  email?: string;
  role?: string; // Role comes as uppercase (SUPER_ADMIN)
  exp?: number;
  iat?: number;
}

// Define user profile type to match your API response
interface UserProfile {
  id: number;
  email: string;
  role: string; // API returns "SUPER_ADMIN" format
  firstName?: string;
  lastName?: string;
  [key: string]: any; // Allow additional properties
}

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
  '/support'
];

// Auth-related routes that should not trigger redirects
const AUTH_ROUTES = ['/login', '/register', '/reset-password'];

// Initialize with null but specify the type
const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to normalize role values
const normalizeRole = (role?: string): 'super_admin' | 'company_admin' | 'individual' => {
  if (!role) return 'individual';
  
  const lowercaseRole = role.toLowerCase();
  
  if (lowercaseRole.includes('super')) return 'super_admin';
  if (lowercaseRole.includes('company')) return 'company_admin';
  return 'individual';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function to get user profile data - not needed if stored in localStorage
  const getUserProfile = async (userId: number): Promise<UserProfile | null> => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data as UserProfile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  // Safely decode JWT token
  const safeDecodeToken = (token: string): DecodedToken | null => {
    try {
      // Basic format check - should have 3 parts separated by dots
      if (!token || !token.includes('.') || token.split('.').length !== 3) {
        console.warn('Token has invalid format');
        return null;
      }
      
      // Try to decode the token
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Check if token is expired
  const checkTokenExpiration = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    if (!token) return true; // No token means it's effectively expired
    
    const decoded = safeDecodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // Add a 10-second buffer to account for slight timing differences
    return decoded.exp * 1000 < Date.now() - 10000;
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      console.log('Logging out user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      setUser(null);
      
      // Only redirect if not already on an auth page
      if (!AUTH_ROUTES.some(route => pathname?.includes(route))) {
        router.push('/login');
      }
    }
  };

  // Check if current route is protected
  const isProtectedRoute = (path: string | null): boolean => {
    if (!path) return false;
    return PROTECTED_ROUTES.some(route => path.startsWith(route));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check if running on server
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        console.log('Auth check started for path:', pathname);
        
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        
        // If no token and on protected route, redirect to login
        if (!token) {
          if (isProtectedRoute(pathname)) {
            console.log('No token, redirecting from protected route');
            router.push('/login');
          }
          setLoading(false);
          return;
        }
        
        // Try to get user from localStorage first (faster than API)
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser({
              id: String(parsedUser.id),
              email: parsedUser.email,
              role: normalizeRole(parsedUser.role),
              firstName: parsedUser.firstName,
              lastName: parsedUser.lastName
            });
            
            // Still validate token to ensure it's not expired
            if (checkTokenExpiration()) {
              console.log('Token expired, logging out');
              logout();
            }
            
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing stored user:', error);
            // Continue with token validation if user parsing fails
          }
        }
        
        // Fall back to token decoding if no stored user
        const decoded = safeDecodeToken(token);
        
        // Handle invalid or expired token
        if (!decoded) {
          console.log('Invalid token format');
          if (isProtectedRoute(pathname)) {
            logout();
          }
          setLoading(false);
          return;
        }
        
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.log('Token expired');
          if (isProtectedRoute(pathname)) {
            logout();
          }
          setLoading(false);
          return;
        }
        
        // Token is valid
        const userId = decoded.sub;
        
        if (userId !== undefined) {
          // If we have user ID, try to get the stored user profile first
          const storedUser = localStorage.getItem('user');
          
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              
              if (String(parsedUser.id) === String(userId)) {
                // Use stored user if IDs match
                setUser({
                  id: String(parsedUser.id),
                  email: parsedUser.email,
                  role: normalizeRole(parsedUser.role),
                  firstName: parsedUser.firstName,
                  lastName: parsedUser.lastName
                });
                setLoading(false);
                return;
              }
            } catch (error) {
              console.error('Error parsing stored user:', error);
              // Continue with API fetch if parsing fails
            }
          }
          
          // If no stored user or ID mismatch, fetch from API
          const userProfile = await getUserProfile(userId);
          
          if (userProfile) {
            const normalizedUser = {
              id: String(userProfile.id),
              email: userProfile.email,
              role: normalizeRole(userProfile.role),
              firstName: userProfile.firstName,
              lastName: userProfile.lastName
            };
            
            setUser(normalizedUser);
            
            // Store for future use
            localStorage.setItem('user', JSON.stringify(userProfile));
          } else {
            // Fallback to basic info from token
            setUser({
              id: String(userId),
              email: decoded.email || '',
              role: normalizeRole(decoded.role),
              firstName: '',
              lastName: ''
            });
          }
        } else {
          console.warn('No user ID found in token');
          if (isProtectedRoute(pathname)) {
            logout();
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        if (isProtectedRoute(pathname)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up interval to periodically check token expiration
    const tokenCheckInterval = setInterval(() => {
      if (checkTokenExpiration() && isProtectedRoute(pathname)) {
        console.log('Token expired during session, logging out');
        logout();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(tokenCheckInterval);
  }, [router, pathname]);

  // Provide a loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, checkTokenExpiration }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;