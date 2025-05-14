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
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
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
// Suppress hydration warnings caused by browser extensions
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (
      args[0]?.includes('Hydration failed because the initial UI does not match') ||
      args[0]?.includes('There was an error while hydrating') ||
      args[0]?.includes('Text content does not match server-rendered HTML')
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
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
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
