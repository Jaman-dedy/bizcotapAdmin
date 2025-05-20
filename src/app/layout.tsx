import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { TagsProvider } from '@/context/tags/TagsContext';
import AntdRegistry from '@/components/AntdRegistry';
import AntdProvider from '@/components/AntdProvider';
import RouteGuard from '@/components/RouteGuard';
import { QueryProvider } from '@/services/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Bizcotap Dashboard',
    default: 'Bizcotap Dashboard',
  },
  description: 'Manage your contacts, leads, and payments effortlessly with Bizcotap Dashboard.',
  robots: {
    index: false,
    follow: false,
  },
};

if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorMsg = args[0]?.toString() || '';
    if (
      errorMsg.includes('Hydration failed because the initial UI does not match') ||
      errorMsg.includes('There was an error while hydrating') ||
      errorMsg.includes('Text content does not match server-rendered HTML') ||
      errorMsg.includes('Warning: Expected server HTML to contain a matching') ||
      errorMsg.includes('data-js-focus-visible') ||
      errorMsg.includes('js-focus-visible') ||
      errorMsg.includes('focus-visible')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
        <head>
    <Script id="focus-visible-fix" strategy="beforeInteractive">{`
      (function() {
        if (typeof window !== 'undefined') {
          const ready = (callback) => {
            if (document.readyState !== 'loading') {
              callback();
            } else {
              document.addEventListener('DOMContentLoaded', callback);
            }
          };
          
          ready(() => {
            document.documentElement.classList.remove('js-focus-visible');
            const elementsWithAttr = document.querySelectorAll('[data-js-focus-visible]');
            elementsWithAttr.forEach(el => {
              el.removeAttribute('data-js-focus-visible');
            });
          });
        }
      })();
    `}</Script>
  </head>
      <body className={`${outfit.className} dark:bg-gray-900`} suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <RouteGuard>
                <SidebarProvider>
                  <TagsProvider>
                    <AntdRegistry>
                      <AntdProvider>
                        {children}
                        <Toaster position="top-right" />
                      </AntdProvider>
                    </AntdRegistry>
                  </TagsProvider>
                </SidebarProvider>
              </RouteGuard>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}