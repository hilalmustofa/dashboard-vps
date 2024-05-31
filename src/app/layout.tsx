"use client"
import React from 'react';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <title>Krembangan Dashboard</title>
        <meta name="description" content='Dashboard Warga Desa Krembangan' />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <body className={inter.className}>
      <SessionProvider>{children}</SessionProvider>
    </body>
  </html>
);

export default RootLayout;
