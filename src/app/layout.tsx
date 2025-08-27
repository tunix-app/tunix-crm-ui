import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
const inter = Inter({
  subsets: ['latin']
});
export const metadata: Metadata = {
  title: 'GetJahBodyRight - Fitness Trainer Dashboard',
  description: 'Professional dashboard for fitness trainers to manage clients and programs'
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>;
}