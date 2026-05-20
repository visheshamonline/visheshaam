import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Vishesham – Kerala News', template: '%s | Vishesham' },
  description: 'AI-powered Kerala news aggregation. Latest news from Manorama, Mathrubhumi, Asianet and more.',
  openGraph: {
    siteName: 'Vishesham',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  metadataBase: new URL('https://vishesham.online'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');})()` }} />
      </head>
      <body className={`${inter.variable} font-sans bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 antialiased`}>
        <Navbar />
        <main className="pt-24 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
