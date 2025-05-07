import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/hooks/useAuth';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';// Adjust the path as needed
import AntdRegistry from '@/components/AntdRegistry';
import AntdProvider from '@/components/AntdProvider';
import RouteGuard from '@/components/RouteGuard';

const outfit = Outfit({
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <RouteGuard>
              <SidebarProvider>
                <AntdRegistry>
                  <AntdProvider>
                    {children}
                  </AntdProvider>
                </AntdRegistry>
              </SidebarProvider>
            </RouteGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}