'use client';

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, ChangeEvent, useEffect } from "react";
import { loginUser } from "@/services/authService";

// Match the API response format
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  // Check URL params for token expiration, return URL, or other errors
  useEffect(() => {
    const expired = searchParams.get('expired');
    const errorParam = searchParams.get('error');
    const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('returnUrl');
    
    // Store return URL if provided
    if (callbackUrl) {
      setReturnUrl(decodeURIComponent(callbackUrl));
    }
    
    // Handle token expiration
    if (expired === 'true') {
      setError('Your session has expired. Please log in again to continue.');
      
      // Clear any expired tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation instead of using HTML5 required attribute
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Call the loginUser function with the credentials
      const data = await loginUser({ email, password });
      
      console.log('Login successful, data received:', data);
      
      // Determine where to redirect the user after successful login
      let redirectPath = '/dashboard';
      
      // First check for returnUrl from query parameter
      if (returnUrl) {
        redirectPath = returnUrl;
      } 
      // Then check for callback URL in localStorage as fallback
      else if (typeof window !== 'undefined' && localStorage.getItem('callbackUrl')) {
        redirectPath = localStorage.getItem('callbackUrl') || '/dashboard';
        localStorage.removeItem('callbackUrl');
      }
      
      // Add a short delay to ensure localStorage is updated
      // before navigation and auth checks occur
      setTimeout(() => {
        router.push(redirectPath);
      }, 300);
    } catch (err: any) {
      console.error('Login failed:', err);
      
      // Handle different error responses
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 403) {
        setError('Your account is locked. Please contact support.');
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError(err.response?.data?.message || 'An error occurred while signing in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {error && (
              <div className="p-3 text-sm rounded-md bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400">
                {error}
              </div>
            )}

            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                defaultValue={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  defaultValue={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 cursor-pointer -translate-y-1/2 right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <Link
                href="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button className="w-full" size="sm" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}